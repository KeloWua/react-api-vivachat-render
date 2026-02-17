import { postComment } from "../services/comments";
import { useAuth } from "../../context/AuthContext";

export default function CommentInput({ postId, onCommentAdded }) {
    const { user } = useAuth();
    const userId = user.id;
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const commentContent = e.target.commentInput.value
        if (!commentContent.length) {

            return
        }
        try {
            await postComment({postId, userId, commentContent})

            if (onCommentAdded) onCommentAdded();

            e.target.reset()
        } catch (error) {
            console.log(error)
        }
        
    }

    return (
        <form 
        onSubmit={handleSubmitComment}
        className="flex items-center w-full max-w-xl mx-auto px-4 py-3 bg-gray-200 rounded-2xl shadow-lg border border-gray-200">
            <input
                id="commentInput"
                type="text"
                placeholder="Write something..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800"
            />
            <button
                type="submit"
                className="ml-4 px-5 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
            >
                Send
            </button>
        </form>
    )
}