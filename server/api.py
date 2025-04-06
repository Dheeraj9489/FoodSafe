from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import json
from .gemini_generation import gemini_generation
from deep_translator import GoogleTranslator
from google.cloud import texttospeech
import base64

allergies = []
data = {
    "allergies": [],
    "categories": {}
}
ALLERGIES_FILE = ''
last_maybe_allergies = []
last_food_name = ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    global data
    global ALLERGIES_FILE

    ALLERGIES_FILE = os.path.join("server", "data", "allergies.json")

    # load on startup
    if os.path.exists(ALLERGIES_FILE):
        with open(ALLERGIES_FILE, 'r') as f:
            data = json.load(f)
    else:
        data = {"allergies": [], "categories": {}}

    yield

app = FastAPI(lifespan=lifespan)

def save_allergies():
    os.makedirs(os.path.dirname(ALLERGIES_FILE), exist_ok=True)
    with open(ALLERGIES_FILE, 'w') as f:
        json.dump(data, f)

def get_all_allergens():
    allergens = set(data["allergies"])
    for item in data["categories"].values():
        allergens.update(item)
    return allergens

@app.get("/get-allergies/")
def get_all_allergens_endpoint():   
    return {"allergies": list(get_all_allergens())}

# individual allergies
@app.post("/add-allergy/{item}")
def add_allergy(item: str):
    if item in get_all_allergens():
        raise HTTPException(status_code=400, detail="Allergy already exists")
    data["allergies"].append(item)
    save_allergies()
    return {"message": f"Added allergy: {item}"}

@app.delete("/remove-allergy/{item}")
def remove_allergy(item: str):
    if item in data["allergies"]:
        data["allergies"].remove(item)
        save_allergies()
        return {"message": f"Removed individual allergy {item}"}
    for category, allergens in data["categories"].items():
        if item in allergens:    
            raise HTTPException(status_code=400, detail=f"'{item}' is part of category '{category}'. Remove whole category instead.")
    raise HTTPException(status_code=404, detail="Allergy not found")

# categories
@app.post("/add-category/{name}")
def add_category(name: str, allergens: list[str]):
    if name in data["categories"]:
        raise HTTPException(status_code=400, detail="Category already exists")
    if any(item in get_all_allergens() for item in allergens):
        raise HTTPException(status_code=400, detail="One or more allergens already tracked individually or in another category")
    data["categories"][name] = allergens
    save_allergies()
    return {"message": f"Added category: {name}", "items": allergens}

@app.delete("/remove-category/{name}")
def remove_allergy(name: str):
    if name not in data["categories"]:
        raise HTTPException(status_code=404, detail="Category not found")
    removed = data["categories"].pop(name)
    save_allergies()
    return {"message": f"Removed category: {name}", "items": removed}


@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    global last_maybe_allergies
    global last_food_name
    image_bytes = await file.read()
    result = gemini_generation(image_bytes, allergens=get_all_allergens())
    last_maybe_allergies = result['maybe']
    last_food_name = result['food_name']
    return JSONResponse(content=result)


# text to speech translation stuff
@app.post("/translate/{language}")
def text_to_speech(language: str):
    # translation to specified language
    text = f"Does this {last_food_name} contain any of these: {" ,".join(last_maybe_allergies)}."
    supported_langs = GoogleTranslator().get_supported_languages(True)
    translation = GoogleTranslator(source='en', target=language).translate(text)
    print("translation done")
    # text to speech
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=translation)

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.VoiceSelectionParams(
        language_code=supported_langs[language], ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    output_path = "output.mp3"
    # # The response's audio_content is binary.
    with open(output_path, "wb") as out:
        # Write the response to the output file.
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')
    audio_base64 = base64.b64encode(response.audio_content).decode('utf-8')

    return {
        'translation': translation,
        'audio': audio_base64
    }


# @app.get("/image/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None ):
#     return {"item_id": item_id, "q": q}
