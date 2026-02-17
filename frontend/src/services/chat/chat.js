import { BASE_URL } from "../../config.js";

export async function chat(chatId, userId, message) {

    const res = await fetch(`${BASE_URL}/chats`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            chatId: chatId,
            userId: userId,
            message: message,
        })
    });
    const data = await res.json();
    return data;
};

export async function chatList() {

    const res = await fetch(`${BASE_URL}/chats/lists`);
    const data = await res.json();
    return data;
};


export async function chatMessages(chatId) {

    const res = await fetch(`${BASE_URL}/chats/${chatId}`);
    const data = await res.json();
    return data;
};

export async function getUserAvatar(userId) {
    
    const res = await fetch(`${BASE_URL}/chats/userInfo/${userId}`);
    const data = await res.json();
    return data;
}