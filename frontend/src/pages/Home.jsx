
import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineShareAlt, AiFillDelete  } from "react-icons/ai";
import { getPosts, sendPost, deletePosts } from "../services/posts";
import { useAuth } from '../../context/AuthContext'
import { timeAgo } from "../services/timeAgo";
import Comments from "../components/Comments";
import { likePost } from "../services/likes";


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [addImage, setAddImage] = useState(false);
  const [likeCooldown, setLikeCooldown] = useState({});
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth()


  const handleUpdateCommentsCount = (postId, newCount) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: newCount }
          : post
      )
    );
  };

  const handleToggleLike = async (postId) => {
    if (likeCooldown[postId]) return;
    setLikeCooldown(prev => ({ ...prev, [postId]: true }));

    try {
      const { totalLikes } = await likePost(postId, user.id);

      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? {
            ...post,
            likes: totalLikes,
            userLiked: !post.userLiked

          } : post
        )
      );
    } catch (err) {
      console.error("Error updating post likes:", err);
    } finally {
      setTimeout(() => {
        setLikeCooldown(prev => ({ ...prev, [postId]: false }));
      }, 1000);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?')
    if (!confirmed) return
    await deletePosts(postId, user.id)
  }

  const handleShowComments = (postId) => {
    setOpenCommentsId(prev =>
      prev === postId ? null : postId
    )
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault()
    const contentPost = e.target.contentPost?.value || ''
    const contentImg = e.target.contentImg?.value || ''

    if (contentPost.trim() === '') {
      setError("Content is empty");
      return
    }
    const newPost = {
      userId: user.id,
      contentPost,
      contentImg
    };
    await sendPost(newPost)
    handleGetPosts(user.id)

    e.target.reset();
  };

  const handleGetPosts = async (userId) => {
    const posts = await getPosts(userId)
    setPosts(posts)
  };
  useEffect(() => {
    if (!user) return; // ⚠️ evita crash si user no está cargado
    handleGetPosts(user.id);
  }, [user, posts]);



  return (
    <div className="min-h-screen bg-gray-100">

      {user ?
        <>
          <div className="pt-16 lg:pt-16 flex">

            <main className={`flex-1 transition-all duration-300 p-4`}>
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmitPost}>

                  <div className="bg-gray-400 rounded-lg shadow-md p-4 mb-6">
                    {error && (
                      <p className="text-red-400 text-center text-sm">{error}</p>
                    )}
                    <div className="flex space-x-4">

                      <img
                        src={user.avatar || '/user-icon.svg'}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <input onChange={() => setError("")} id="contentPost"
                        type="text"
                        placeholder="What's on your mind?"
                        className="flex-1 text-black bg-gray-100 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <img
                        src='/img-icon.svg'
                        alt="Add image"
                        className="
                        w-6 h-10 rounded-full cursor-pointer
                        transition-all duration-150
                        hover:opacity-70
                        active:scale-90
                        active:opacity-50
                      "
                        onClick={() => { setAddImage(!addImage) }}
                      />
                      <button>
                        <img
                          type='submit'
                          src='/public/send-icon.svg'
                          alt="Send post"
                          className="
                        w-7 h-11 rounded-full cursor-pointer
                        transition-all duration-150
                        hover:opacity-70
                        active:scale-90
                        active:opacity-50
                      "
                        />
                      </button>
                    </div>
                    {addImage ?
                      <>
                        <div className="flex space-x-4 pt-4">
                          <input id="contentImg"
                            type="text"
                            placeholder="Image URL"
                            className="flex-1 text-black bg-gray-100 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                        </div>
                      </> :
                      ''}

                  </div>

                </form>
                <div className="space-y-6">
                  {posts.length ?
                    <>
                      {posts.map((post) => (
                        <article key={post.id} className="bg-gray-300 rounded-lg shadow-md overflow-hidden">
                          <div className="p-4 text-black" >
                            <div className="flex items-center space-x-3">
                              <img
                                /* src={post.user.avatar} */
                                src={post.user.avatar}
                                alt={post.user.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <h3 className="font-semibold">{post.user.name}</h3>
                                <p className="text-sm text-gray-900">{timeAgo(post.createdAt)}</p>
                              </div>
                            </div>
                            <p className="mt-3">{post.content}</p>
                          </div>

                          {!post.image || post.image === 'No image' ?
                            '' :
                            <>
                              <img
                                src={post.image}
                                alt=""
                                className="w-full h-64 object-cover"
                              />
                            </>
                          }
                          {openCommentsId == post.id &&
                            <Comments
                              postId={post.id}
                              onUpdateCommentsCount={handleUpdateCommentsCount}
                              userId={user.id}
                            />
                          }


                          <div className="p-4 border-t flex items-center space-x-4">
                            {post.userLiked ?

                              <button onClick={() => { handleToggleLike(post.id); }} className="flex items-center space-x-2 text-red-800   hover:text-red-900">
                                <AiFillHeart className="w-6 h-6" />
                                <span className="text-gray-500">{post.likes}</span>
                              </button>
                              :
                              <button onClick={() => { handleToggleLike(post.id); }} className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                                <AiOutlineHeart className="w-6 h-6" />
                                <span>{post.likes}</span>
                              </button>
                            }



                            <button onClick={() => handleShowComments(post.id)} className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                              <AiOutlineComment className="w-6 h-6" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                              <AiOutlineShareAlt className="w-6 h-6" />
                              <span>Share</span>
                            </button>
                            
                            { post.user.id === user.id?

                            <button onClick={() => handleDeletePost(post.id)}
                            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                              <AiFillDelete  className="w-6 h-6" />
                            </button>
                            :
                            ''
                            }
                          </div>
                        </article>
                      ))}
                    </> :
                    <>
                      <div className="p-4 text-black text-center" >
                        <p className="p-20 font-bold">KINDA BORING..</p>
                      </div>
                    </>
                  }
                </div>
              </div>
            </main>
          </div>

        </> :
        <>
          <div className="p-20 text-center font-bold text-black">
            Hey there!
          </div>
        </>
      }
    </div>
  );
};

export default Home;