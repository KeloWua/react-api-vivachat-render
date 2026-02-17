import { MdDelete } from "react-icons/md";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { timeAgo } from "../services/timeAgo";
import { deleteComment, likeComment } from "../services/comments";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";


export default function CommentTile({ postComment, onDeleteComment }) {
    const { user } = useAuth();
    const [comment, setComment] = useState(postComment);
    console.log(comment)
    const [likeCooldown, setLikeCooldown] = useState({});
    const userId = user.id;
    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return;
        await deleteComment(postComment.commentId)
        onDeleteComment()
    }


    const handleToggleLike = async (commentId) => {
      if (likeCooldown[commentId]) return;
      setLikeCooldown(prev => ({ ...prev, [commentId]: true }));
    
      try {
        const { totalLikes } = await likeComment(commentId, user.id);
    
        setComment(prev =>
            prev.commentId === commentId ? { 
              ...prev, 
              likes: totalLikes,
              userLiked: !prev.userLiked 
    
            } : prev
        );
      } catch (err) {
        console.error("Error updating comment likes:", err);
      } finally {
        setTimeout(() => {
          setLikeCooldown(prev => ({ ...prev, [commentId]: false }));
        }, 1000);
      }
    };


    return (
        <article key={comment.commentId} className="flex ml-8 px-3 py-2 text-sm bg-gray-100 text-black rounded-lg shadow-sm">

            {/* Avatar */}
            <div className="">
            <img
                src={comment.avatarUrl || '/user-icon.svg'}
                alt="comment user avatar"
                className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
            />
            {/* Delete */}
            {
            userId == comment.userId && 
            (
            <button id="deleteComment" onClick={handleDelete}>
                <MdDelete className="w-5.5 h-7"/>
             </button>
            )
            }

            </div>

            {/* Content */}
            <div className="flex-1">
              <span className="text-xs text-gray-400">{comment.userName}</span>
                <p>
                    {comment.content}
                </p>
                <span className="text-xs text-gray-500">
                    {timeAgo(comment.createdAt)}
                </span>
            </div>

            {/* Actions */}
            {comment.userLiked ?

            <button onClick={() => {handleToggleLike(comment.commentId);}} className="flex items-center space-x-2 text-red-800   hover:text-red-900">
                <AiFillHeart className="w-6 h-6" />
                <span className="text-gray-500">{comment.likes}</span>
            </button>
            :
            <button onClick={() => {handleToggleLike(comment.commentId);}} className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                <AiOutlineHeart className="w-6 h-6" />
                <span>{comment.likes}</span>
            </button>
            }
            

        </article>
    )

}

