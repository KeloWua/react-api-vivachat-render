import { useState, useEffect } from "react";
import { getCommentsByPost } from "../services/comments";
import CommentTile from "./CommentTile";
import CommentInput from "./CommentInput";

export default function Comments({ postId, onUpdateCommentsCount, userId }) {

    const [postComments, setPostComments] = useState([]);
    const loadComments = async () => {
        try {
            const comments = await getCommentsByPost(postId, userId);
            setPostComments(comments);

            if (onUpdateCommentsCount) {
                onUpdateCommentsCount(postId, comments.length);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (!postId) return;
        loadComments();
    }, [postId]);

    const handleCommentAdded = async () => {

        await loadComments();
    };



    return (
        <>
            <div className="p-4 border-t flex items-center space-x-4">
                <span className="text-black">Comments</span>
            </div>
            <div className=" p-4 space-x-4 space-y-6">

                {postComments.map(postComment => (
                    <CommentTile
                    key={postComment.commentId} 
                    postComment={postComment}
                    onDeleteComment={loadComments} />
                ))}
                <CommentInput postId={postId} onCommentAdded={handleCommentAdded} />

            </div>
        </>

    )
}
