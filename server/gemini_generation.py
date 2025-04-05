from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import json

load_dotenv()

def gemini_generation(image, allergens):
    # with open(image_path, "rb") as f:
    #     byte_string = f.read()

    byte_string = image
    
    generate_content_config = types.GenerateContentConfig(
        temperature=0,
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type = genai.types.Type.OBJECT,
            required = ["food_name", "allergen_rating"],
            properties = {
                "food_name": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "allergen_rating": genai.types.Schema(
                    type = genai.types.Type.ARRAY,
                    items = genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                ),
            },
        ),
    )

    prompt = """Does the food in this image contain these allergens:\n""" + ",".join(allergens) + ".\nFor each allergen give it rating of yes, maybe or no. Yes means that the food does contain the allergen, maybe means you aren't sure, no means that the food does not contain the allergen. Make the rating in the format of allergen name, rating. Also give me the name of the food itself"
    
    client = genai.Client(api_key=os.getenv("GEMINI_KEY"))
    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=[
            types.Part.from_text(text=prompt),
            types.Part.from_bytes(data=byte_string, mime_type="image/jpeg")
        ],
        config=generate_content_config
    )

    # json_dict = json.loads(response.text)
    # allergen_dict = json_dict['allergen_rating']
    # result =  {}
    # for i in allergen_dict:
    #     temp = i.split(',')
    #     result[temp[0]] = temp[1]
    # result['food_name'] = json_dict['food_name']

    json_dict = json.loads(response.text)
    allergen_list = json_dict['allergen_rating']
    result =  {}
    result['food_name'] = json_dict['food_name']
    for i in allergen_list:
        temp = i.split(',')
        if temp[1] in result:
            result[temp[1].strip()].append(temp[0].strip())
        else:
            result[temp[1].strip()]  = [temp[0].strip()]

    return result