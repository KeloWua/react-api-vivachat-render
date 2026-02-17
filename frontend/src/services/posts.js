import { BASE_URL } from "../config.js";

export async function getPosts(userId) {

    const res = await fetch(`${BASE_URL}
/posts?userId=${userId}`);
    const { posts } = await res.json();
    if (!res.ok) throw new Error(res.statusText);
    return posts;
}


export async function deletePosts(postId, userId) {

    const res = await fetch(`${BASE_URL}
/posts`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'DELETE',
        body: JSON.stringify({
            postId: postId,
            userId: userId
        })
    });
    const data = await res.json();
    return data;
}


export async function sendPost(post) {
    const { userId, contentPost, contentImg } = post;
    const res = await fetch(`${BASE_URL}
/posts`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            contentPost: contentPost,
            contentImg: contentImg
        })
    }
    );
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
}