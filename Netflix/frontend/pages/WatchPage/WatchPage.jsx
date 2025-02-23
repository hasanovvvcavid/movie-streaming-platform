import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useContentStore } from "../../store/content";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import {
  ORIGINAL_IMG_BASE_URL,
  SMALL_IMG_BASE_URL,
} from "../../src/utils/constants";
import ReactPlayer from "react-player";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatReleaseDate } from "../../src/utils/dateConverter";
import WatchPageSkeleton from "../../components/skeletons/WatchPageSkeleton";
import "./WatchPage.css";
import { useAuthStore } from "../../store/authUser";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [haveFavorites, setHaveFavorites] = useState(false);
  const { contentType } = useContentStore();
  const [later, setLater] = useState([]);
  const [haveLater, setHaveLater] = useState(false);

  const userId = useAuthStore((state) => state.user?._id);
  const user = useAuthStore((state) => state.user);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [initialText, setInitialText] = useState("");
  const [initialRating, setInitialRating] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const sliderRef = useRef(null);

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
      }
    };

    getTrailers();
  }, [contentType, id]);

  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        setSimilarContent(res.data.similar);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilarContent([]);
        }
      }
    };

    getSimilarContent();
  }, [contentType, id]);

  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
        setContent(res.data.content);
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getContentDetails();
  }, [contentType, id]);

  const handleNext = () => {
    if (currentTrailerIdx < trailers.length - 1)
      setCurrentTrailerIdx(currentTrailerIdx + 1);
  };
  const handlePrev = () => {
    if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
  };

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  //movie comment

  const handleRatingChange = (rating) => {
    setCurrentRating(rating);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || currentRating === 0) return;

    setIsLoading(true);

    const newCommentObject = {
      userId: {
        username: user?.username, // Varsayılan kullanıcı adı
        image: user?.image || "/user-avatar.jpg", // Varsayılan avatar
        id: user?._id, // Kullanıcı ID'si
      },
      text: newComment,
      rating: currentRating,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/v1/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          movieId: id,
          text: newComment,
          createdAt: new Date().toISOString(),
          rating: currentRating,
          userId: user?._id,
          user: {
            username: user?.username,
            image: user?.image || "/user-avatar.jpg",
          },
        }),
      });

      if (response.ok) {
        setComments([...comments, newCommentObject]);
        setNewComment("");
        setCurrentRating(0);
        Swal.fire({
          title: "Sent!",
          text: "Your comment has been successfully sent.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/v1/comments/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleDeleteComment = async (commentId) => {
    setIsLoading(true);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;
    try {
      const response = await fetch(`/api/v1/comments/delete/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user?._id,
          isAdmin: user?.isAdmin, // Admin yetkisi kontrolü
        }),
      });

      if (response.ok) {
        fetchComments(); // Güncellenmiş listeyi getir
        Swal.fire({
          title: "Deleted!",
          text: "Your comment has been successfully deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editedText.trim() || editedRating === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/comments/update/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          text: editedText,
          rating: editedRating,
          userId: user?._id,
        }),
      });

      if (response.ok) {
        setEditingComment(null); // Düzenleme modunu kapat
        fetchComments(); // Güncellenmiş yorumları getir
        Swal.fire({
          title: "Success!",
          text: "Your comment has been updated.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/auth/${userId}/favorites`
        );

        if (response.status === 200) {
          const data = await response.json();

          setFavorites(data);
        } else {
          console.error("Favoriler alınamadı");
        }
      } catch (error) {
        console.error("Favoriler alınırken hata:", error);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId, content.id]);

  useEffect(() => {
    const isMovieInFavorites = !!favorites?.find(
      (fav) => fav.movieId == content.id
    );

    setHaveFavorites(isMovieInFavorites);
  }, [favorites]);

  const handleFavorite = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/auth/favorites/toggle/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieId: content.id,
            title: content.title,
            poster: content.poster_path,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFavorites(data?.favorites);

        if (haveFavorites) {
          toast.error("Removed from Favorites! ❌");
        } else {
          toast.success("Added to Favorites! ✅");
        }
      } else {
        console.error("Favori işlemi başarısız oldu");
      }
    } catch (error) {
      console.error("Favori işlemi sırasında hata:", error);
    }
  };

  //Watch later
  const fetchLater = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/auth/${userId}/later`
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);

        setLater(data);
      } else {
        console.error("Later not found");
      }
    } catch (error) {
      console.error("getLater has problem", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLater();
    }
  }, [userId, content.id]);

  useEffect(() => {
    console.log("l", later);

    const isMovieInLater = !!later?.find(
      (later) => later.movieId == content.id
    );
    console.log(isMovieInLater);

    setHaveLater(isMovieInLater);
  }, [later]);
  // console.log(haveLater);

  const handleLater = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/auth/later/toggle/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieId: content.id,
            title: content.title,
            poster: content.poster_path,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setLater(data?.watchLater);

        if (haveLater) {
          toast.error("Removed from Watch later list! ❌");
        } else {
          toast.success("Added to Watch later list! ✅");
        }
      } else {
        console.error("Later operation failed");
      }
    } catch (error) {
      console.error("Later operation failed", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );

  if (!content) {
    return (
      <div className="bg-black text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />

        {trailers.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed " : ""
              }}
							`}
              disabled={currentTrailerIdx === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === trailers.length - 1
                  ? "opacity-50 cursor-not-allowed "
                  : ""
              }}
							`}
              disabled={currentTrailerIdx === trailers.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          {trailers.length > 0 && (
            <ReactPlayer
              controls={true}
              width={"100%"}
              height={"70vh"}
              className="mx-auto overflow-hidden rounded-lg"
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
            />
          )}

          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{" "}
              <span className="font-bold text-red-600">
                {content?.title || content?.name}
              </span>{" "}
              😥
            </h2>
          )}
        </div>

        {/* movie details */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-20 
				max-w-6xl mx-auto"
        >
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>

            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}{" "}
            </p>
            <p className="mt-4 text-lg">{content?.overview}</p>
            <div className="add-button-fl flex items-center gap-4 mt-4">
              <button
                id="addToFavorites"
                onClick={handleFavorite}
                disabled={loading}
                style={{
                  backgroundColor: haveFavorites ? "#681111" : "#681111",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "0.3s",
                }}
              >
                {isLoading
                  ? "loading..."
                  : haveFavorites
                    ? "❌ Remove from Favorites"
                    : "❤️ Add to Favorites"}
              </button>
              <button
                id="addToLater"
                onClick={handleLater}
                disabled={loading}
                style={{
                  backgroundColor: haveLater ? "#681111" : "#681111",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "0.3s",
                }}
              >
                {isLoading
                  ? "loading..."
                  : haveLater
                    ? "❌ Remove from watch later"
                    : "🕒 Add to watch later"}
              </button>
            </div>
          </div>
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt="Poster image"
            className="max-h-[600px] rounded-md"
          />
        </div>

        <div className="movie-comment">
          <div className="comment">
            <h3 id="movie-title">Comment ({comments.length})</h3>
          </div>

          <div className="previous-comments">
            {[...comments]
              .sort((a, b) => {
                if (a.userId?.username === user?.username) return -1;
                if (b.userId?.username === user?.username) return 1;
                return 0;
              })
              .map((comment, index) => (
                <div className="previous-box" key={comment._id || index}>
                  <div className="comment-profile">
                    <img src={`../public/${comment.userId?.image}`} alt="" />
                    {comment.userId?.username || "Anonymous"}
                  </div>
                  <div className="comment-rating">
                    <h4>{new Date(comment?.createdAt).toLocaleString()}</h4>
                    <div className="comment-star">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className="fa-solid fa-star"
                          style={{
                            color:
                              i < (comment?.rating || 0)
                                ? "#FFD700"
                                : "rgba(255, 215, 0, 0.3)",
                          }}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <div className="comment-ds">
            
                    <p className="w-[50%] break-words">{comment?.text}</p>
              
                    <div className="comment-action max-w-full overflow-hidden">
                      {comment.userId?.username === user?.username && (
                        <>
                          <button
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditedText(comment.text);
                              setEditedRating(comment.rating);
                              setInitialText(comment.text);
                              setInitialRating(comment.rating);
                            }}
                            id="update-button"
                          >
                            Update
                          </button>
                        </>
                      )}

                      {(user?.admin ||
                        comment.userId?.username === user?.username) && (
                        <>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            id="delete-button"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="previous-comments">
            {!comments.length && (
              <h2>No comments yet. Be the first to comment!</h2>
            )}
          </div>

          <div className="comment-form">
            <div className="responsive-comment">
              <textarea
                name=""
                id=""
                placeholder="Write a comment"
                value={editingComment ? editedText : newComment}
                onChange={(e) =>
                  editingComment
                    ? setEditedText(e.target.value)
                    : setNewComment(e.target.value)
                }
              ></textarea>
            </div>
            <div className="responsive-rating">
              <div className="rating-section">
                <h4>Rate movie:</h4>
                <div className="star-input">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = editingComment
                      ? editedRating
                      : currentRating;
                    const displayRating = hoverRating || ratingValue;

                    return (
                      <i
                        key={i}
                        className="fa-solid fa-star"
                        style={{
                          color:
                            i < displayRating
                              ? "#FFD700"
                              : "rgba(255, 215, 0, 0.3)",
                          transition: "color 0.2s ease-in-out",
                          cursor: "pointer",
                        }}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() =>
                          editingComment
                            ? setEditedRating(i + 1)
                            : setCurrentRating(i + 1)
                        }
                      ></i>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="responsive-send">
              {editingComment ? (
                <>
                  <button
                    onClick={() => handleUpdateComment(editingComment)}
                    disabled={
                      isLoading ||
                      (editedText === initialText &&
                        editedRating === initialRating)
                    }
                    style={{
                      backgroundColor:
                        isLoading ||
                        (editedText === initialText &&
                          editedRating === initialRating)
                          ? "rgba(255, 215, 0, 0.3)"
                          : "#007bff",
                      color:
                        isLoading ||
                        (editedText === initialText &&
                          editedRating === initialRating)
                          ? "#666"
                          : "#fff",
                      cursor:
                        isLoading ||
                        (editedText === initialText &&
                          editedRating === initialRating)
                          ? "not-allowed"
                          : "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditingComment(null)}
                    disabled={isLoading}
                    style={{
                      backgroundColor: "rgb(143, 10, 10)",
                      color: "#fff",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleCommentSubmit} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send"}
                </button>
              )}
            </div>
          </div>
        </div>

        {similarContent.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto relative">
            <h3 className="text-3xl font-bold mb-4">Similar Movies/Tv Show</h3>

            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${content.id}`}
                    className="w-52 flex-none"
                  >
                    <img
                      src={SMALL_IMG_BASE_URL + content.poster_path}
                      alt="Poster path"
                      className="w-full h-auto rounded-md"
                    />
                    <h4 className="mt-2 text-lg font-semibold">
                      {content.title || content.name}
                    </h4>
                  </Link>
                );
              })}

              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-red-600 text-white rounded-full"
                onClick={scrollRight}
              />
              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
								text-white rounded-full"
                onClick={scrollLeft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
