// src/components/PostCard.js
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import API from '../services/api';
import './compcss/postcard.css'; // Your CSS file

const PostCard = ({ post, onLike, onUnlike, children }) => {
  const cardRef = useRef(null);
  const userId = localStorage.getItem('userId'); // Logged-in user id

  // Local states for follow status, like count, and comment count
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount] = useState(post.commentCount);

  // Update local likeCount if post.likeCount changes from parent fetch
  useEffect(() => {
    setLikeCount(post.likeCount);
  }, [post.likeCount]);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, []);

  const handleFollow = async () => {
    try {
      await API.post('/follows/follow', {
        followerId: userId,
        followedId: post.user_id,
      });
      setIsFollowing(true);
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await API.post('/follows/unfollow', {
        followerId: userId,
        followedId: post.user_id,
      });
      setIsFollowing(false);
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  // Default like handler if onLike prop is not provided
  const defaultOnLike = async (postId) => {
    try {
      const res = await API.post('/posts/like', { userId, postId });
      console.log('Post like successful:', res.data);
      setLikeCount((prev) => prev + 1);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Default unlike handler if onUnlike prop is not provided
  const defaultOnUnlike = async (postId) => {
    try {
      const res = await API.post('/posts/unlike', { userId, postId });
      console.log('Post unlike successful:', res.data);
      setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.error('Error unliking post:', err);
    }
  };

  const handleLikeClick = () => {
    if (onLike) {
      onLike(post.id);
    } else {
      defaultOnLike(post.id);
    }
  };

  const handleUnlikeClick = () => {
    if (onUnlike) {
      onUnlike(post.id);
    } else {
      defaultOnUnlike(post.id);
    }
  };

  return (
    <div ref={cardRef} className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user_id}`} className="post-username">
          @{post.username}
        </Link>
        {userId !== post.user_id && (
          <button className="post-follow-btn" onClick={isFollowing ? handleUnfollow : handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-media">
        {post.image_url && <img src={post.image_url} alt="Post" />}
        {post.video_url && <video src={post.video_url} controls autoPlay muted loop />}
      </div>

      <div className="post-actions">
        <span className="post-likes">{likeCount} likes</span>
        <span className="post-comments">{commentCount} comments</span>
      </div>

      <div className="post-buttons">
        <button className="like-btn" onClick={handleLikeClick}>Like Post</button>
        <button className="unlike-btn" onClick={handleUnlikeClick}>Unlike Post</button>
      </div>

      {children}
    </div>
  );
};

export default PostCard;
