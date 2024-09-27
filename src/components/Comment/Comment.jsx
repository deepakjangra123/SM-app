import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Comment.css";
import { LuSendHorizonal } from "react-icons/lu";

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/VSAPI/V1/posts/${postId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(response.data.comments);
        console.log(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId, token]);

  const postComment = async () => {
    if (!text.trim()) return; // Prevent posting empty comments

    try {
      const response = await axios.post(
        `http://localhost:5050/VSAPI/V1/posts/${postId}/comments`,
        { commentText: text }, // Send the comment text in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data.comment]);
      setText(""); // Clear the input field
      console.log(response.data.comment);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const getTimeDifference = (postDate) => {
    const currentTime = new Date();
    const postTime = new Date(postDate);
    const differenceInMilliseconds = currentTime - postTime;
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
    }
  };

  return (
    <div className="title_section">
      <div className="title_container">
        <h3>Comments</h3>
      </div>
      <div className="description_container">
        <div className="upper">
          {comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment_user">
                  <h4>{comment.username}</h4>
                  <small>({getTimeDifference(comment.createdAt)})</small>
                </div>
                <p>{comment.commentText}</p>
              </div>
            ))
          )}
        </div>
        <div className="lower">
          <input
          className="input_comment"
            type="text"
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
          />
          <LuSendHorizonal className = "icon_size" onClick={postComment} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
