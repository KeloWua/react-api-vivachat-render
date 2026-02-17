export async function chat(chatId, userId, message) {

    const res = await fetch('http://localhost:3000/chats', {
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

    const res = await fetch('http://localhost:3000/chats/lists');
    const data = await res.json();
    return data;
};


export async function chatMessages(chatId) {

    const res = await fetch(`http://localhost:3000/chats/${chatId}`);
    const data = await res.json();
    return data;
};

export async function getUserAvatar(userId) {
    
    const res = await fetch(`http://localhost:3000/chats/userInfo/${userId}`);
    const data = await res.json();
    return data;
}