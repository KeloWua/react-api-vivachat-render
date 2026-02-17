
export async function getCommentsByPost(postId, userId) {
    const res = await fetch(`http://localhost:3000/comments/${postId}?userId=${userId}`);
    if (!res.ok) throw new Error(res.statusText);

    const { postComments } = await res.json();
    return postComments;
}



export async function postComment(comment) {
    const {postId, userId, commentContent} = comment;
    const res = await fetch('http://localhost:3000/comments', {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            postId: postId,
            userId: userId,
            commentContent: commentContent,
        })
        }
    );
    if (!res.ok) throw new Error(res.statusText);
}

export async function deleteComment(commentId) {
    const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'DELETE'
    });
    if (!res.ok) throw new Error(res.statusText);
}



export async function likeComment(commentId, userId) {
    const res = await fetch('http://localhost:3000/comments/like', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            commentId,
            userId
        })
    });
    const data = await res.json();
    return data;
}
