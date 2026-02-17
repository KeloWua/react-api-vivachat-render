import { BASE_URL } from "../config.js";


export async function likePost(postId, userId) {
    const res = await fetch(`${BASE_URL}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            postId,
            userId
        })
    });
    const data = await res.json();
    return data;
}
