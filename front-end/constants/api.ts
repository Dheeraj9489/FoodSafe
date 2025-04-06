//const BASE_URL = 'http://10.108.29.140:8000'; // Replace with your actual IP
const BASE_URL = 'https://6445-2001-49d0-8512-1-715c-9826-b548-24b2.ngrok-free.app'; // change to your

export const getAllergies = async () => {
    const res = await fetch(`${BASE_URL}/get-allergies/`);
    const data = await res.json();
    console.log('Allergies:', data.allergies);
    return data.allergies;
};

export const addAllergy = async (item: string) => {
    const res = await fetch(`${BASE_URL}/add-allergy/${item}`, { method: 'POST' });
    return res.json();
};

export const removeAllergy = async (item: string) => {
    const res = await fetch(`${BASE_URL}/remove-allergy/${item}`, { method: 'DELETE' });
    return res.json();
};

export const uploadImage = async (fileUri: string) => {
    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
    } as any);

    const res = await fetch(`${BASE_URL}/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.json();
};

export const translateTextToSpeech = async (language: string) => {
    const res = await fetch(`${BASE_URL}/translate/${language}`, {
        method: 'POST',
    });

    if (!res.ok) {
        throw new Error(`Translation failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
        translation: data.translation,
        audio: data.audio,
    };
};
