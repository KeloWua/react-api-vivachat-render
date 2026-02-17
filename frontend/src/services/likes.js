
export async function likePost(postId, userId) {
    const res = await fetch('http://localhost:3000/likes', {
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
