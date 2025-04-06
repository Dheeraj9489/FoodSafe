from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
import os
import json
from server.gemini_generation import gemini_generation
from deep_translator import GoogleTranslator
from google.cloud import texttospeech
import base64

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLERGIES_FILE = os.path.join("server", "data", "allergies.json")
if os.path.exists(ALLERGIES_FILE):
    with open(ALLERGIES_FILE, 'r') as f:
        data = json.load(f)
else:
    data = {"allergies": [], "categories": {}}

last_maybe_allergies = []
last_food_name = ""

def save_allergies():
    with open(ALLERGIES_FILE, 'w') as f:
        json.dump(data, f)

def get_all_allergens():
    allergens = set(data["allergies"])
    for item in data["categories"].values():
        allergens.update(item)
    return list(allergens)

@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    if request.method == 'POST':
        image = request.files['image']
        filename = secure_filename(image.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(image_path)

        custom_allergies = request.form.get('custom_allergies', '').split(',')
        custom_allergies = [a.strip() for a in custom_allergies if a.strip()]
        selected_allergies = request.form.getlist('allergies')
        all_allergens = set(selected_allergies + custom_allergies)

        with open(image_path, 'rb') as img_file:
            image_bytes = img_file.read()
        result = gemini_generation(image_bytes, allergens=all_allergens)

        global last_maybe_allergies, last_food_name
        last_maybe_allergies = result.get('maybe', [])
        last_food_name = result.get('food_name', '')

    return render_template('form.html', allergens=get_all_allergens(), result=result)

@app.route('/translate/<language>', methods=['POST'])
def translate(language):
    text = f"Does this {last_food_name} contain any of these: {', '.join(last_maybe_allergies)}."
    supported_langs = GoogleTranslator().get_supported_languages(True)
    translation = GoogleTranslator(source='en', target=language).translate(text)

    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=translation)
    voice = texttospeech.VoiceSelectionParams(
        language_code=supported_langs[language],
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    audio_base64 = base64.b64encode(response.audio_content).decode('utf-8')
    return {
        'translation': translation,
        'audio': audio_base64
    }

if __name__ == '__main__':
    app.run(debug=True)
