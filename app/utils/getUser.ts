import axios from "axios";

async function getUser(accessToken: string) {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());
    const { userId } = payload;

    if (!userId) {
        throw new Error('User ID not found in access token');
    }

    const backendUrl = process.env.BACKEND_URL || '';
    const response = await axios.get(`${backendUrl}/users/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data; 
}

export default getUser