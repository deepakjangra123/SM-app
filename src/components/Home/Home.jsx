import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SlOptionsVertical } from "react-icons/sl";
import Modal from "../Modal/Modal"; // Ensure you're importing the correct modal
import "./Home.css";
import { LiaCommentSolid } from "react-icons/lia";
import { AiTwotoneLike } from "react-icons/ai";

import { PiShareFatLight } from "react-icons/pi";
import Title from "../Title/Title"
import Comment from "../Comment/Comment"

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const optionsButtonRef = useRef(null);
  const token = localStorage.getItem("token");
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);
  const getTimeDifference = (postDate) => {
    const currentTime = new Date();
    const postTime = new Date(postDate);
    const differenceInMilliseconds = currentTime - postTime;
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days > 0 && days <= 6 ? `${days} days ago` : `${postDate}`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5050/VSAPI/V1/posts/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data.posts);
      console.log(response.data.posts);
      response.data.posts.forEach((post) => fetchUserData(post.userId));
      console.log(users);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/VSAPI/V1/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: response.data.user }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleButtonClick = () => {
    setShowModal(true);
    setSelectedPost(null);
  };

  const handleMoreOptionsClick = (post, event) => {
    setSelectedPost(post);
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.left });
    setShowMenu(!showMenu);
  };

  const handleOpenDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/VSAPI/V1/posts/${selectedPost._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSelectedPost(response.data.post);
      setShowModal(true);
      setShowMenu(false);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost || !selectedPost._id) {
      console.error("No post selected for deletion.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5050/VSAPI/V1/posts/${selectedPost._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete response:", response);
      fetchPosts();
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPost(null);
  };
  const handleCommentClick = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  return (
    <div className="posts-container">
      {posts.map((post) => {
        if (!users[post.userId]) {
          fetchUserData(post.userId);
        }
        const user = users[post.userId] || {};
        return (
          <div className="post-card" key={post._id}>
            <div className="post-header">
              <div className="header_left">
                <div className="profile_image">
                  {user.profilePhoto != "null" ? (
                    <img
                      src={`http://localhost:5050/${user.profilePhoto}`}
                      alt="could not get the image"
                    />
                  ) : (
                    <img
                      src="https://th.bing.com/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?w=170&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                      alt="Default profile"
                    />
                  )}
                </div>
                <div className="profile_name">
                  <h3>{user.username || "Loading..."}</h3>
                  <small> {getTimeDifference(new Date(post.createdAt))} </small>
                </div>
              </div>
              <SlOptionsVertical
                className="more-options"
                onClick={(e) => handleMoreOptionsClick(post, e)}
                ref={optionsButtonRef}
              />
            </div>

            <div className="bottom_section">
              <div className="content_container">
                {post.mediaType && (
                  <div className="media">
                    {post.mediaType === "image" && (
                      <img
                        src={`http://localhost:5050/${post.mediaPath}`}
                        alt={post.title}
                      />
                    )}
                    {post.mediaType === "video" && (
                      <video controls>
                        <source
                          src={`http://localhost:5050/${post.mediaPath}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {post.mediaType === "audio" && (
                      <audio controls>
                        <source
                          src={`http://localhost:5050/${post.mediaPath}`}
                          type="audio/mp3"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                )}
              </div>

              {!showComments[post._id] ? (
                <Title title={post.title} description={post.description} />
              ) : (
                <Comment postId={post._id} />
              )}
            </div>
            <div className="card_footer">
              <div className="comment_container">
                <div
                  className="icon_container"
                  onClick={() => console.log("icon-clicked")}
                >
                  <AiTwotoneLike className="icon_size" />
                </div>
                <div
                  className="icon_container"
                  onClick={() =>handleCommentClick(post._id)}
                >
                  <LiaCommentSolid className="icon_size" />
                </div>
                <div
                  className="icon_container"
                  onClick={() => console.log("icon-clicked")}
                >
                  <PiShareFatLight className="icon_size" />{" "}
                </div>
              </div>
            </div>
            {showMenu && selectedPost === post && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                }}
              >
                <button onClick={handleOpenDetail}>Detail</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        );
      })}

      <button className="add-button" onClick={handleButtonClick}>
        +
      </button>
      {showModal && (
        <Modal
          onClose={handleModalClose}
          onSubmit={fetchPosts}
          postDetails={selectedPost}
        />
      )}
    </div>
  );
};

export default Home;
