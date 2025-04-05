from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import json
from gemini_generation import gemini_generation

allergies = []
ALLERGIES_FILE = ''

@asynccontextmanager
async def lifespan(app: FastAPI):
    global allergies
    global ALLERGIES_FILE

    ALLERGIES_FILE = os.path.join("server", "data", "allergies.json")

    # load on startup
    if os.path.exists(ALLERGIES_FILE):
        with open(ALLERGIES_FILE, 'r') as f:
            allergies = json.load(f)
    else:
        allergies = []

    yield

app = FastAPI(lifespan=lifespan)

def save_allergies():
    os.makedirs(os.path.dirname(ALLERGIES_FILE), exist_ok=True)
    with open(ALLERGIES_FILE, 'w') as f:
        json.dump(allergies, f)

@app.get("/get-allergies/")
def get_allergies():
    return {"allergies": allergies}

@app.post("/add-allergy/{item}")
def add_allergy(item: str):
    if item in allergies:
        raise HTTPException(status_code=400, detail="Allergy already exists")
    allergies.append(item)
    save_allergies()
    return {"message": f"Added allergy: {item}"}

@app.delete("/remove-allergy/{item}")
def remove_allergy(item: str):
    if item not in allergies:
        raise HTTPException(status_code=404, detail="Allergy not found")
    allergies.remove(item)
    save_allergies()
    return {"message": f"Removed allergy: {item}"}


@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = gemini_generation(image_bytes, allergens=allergies)
    return JSONResponse(content=result)





# @app.get("/image/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None ):
#     return {"item_id": item_id, "q": q}