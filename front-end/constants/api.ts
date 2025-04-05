//const BASE_URL = 'http://10.108.29.140:8000'; // Replace with your actual IP
const BASE_URL = 'https://3685-2001-49d0-8512-1-a1a9-8b8a-db04-c24.ngrok-free.app';

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
