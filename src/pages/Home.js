// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';
import { isAuthenticated } from '../utils/auth';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchHomeFeed();
  }, [navigate]);

  const fetchHomeFeed = async () => {
    try {
      const res = await API.get(`/posts/home/${userId}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.post('/posts/like', { userId, postId });
      fetchHomeFeed();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await API.post('/posts/unlike', { userId, postId });
      fetchHomeFeed();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Home</h2>
      <CreatePost refreshFeed={fetchHomeFeed} />
      {posts.length === 0 ? <p>No posts or not following anyone yet.</p> : null}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onUnlike={handleUnlike}
        >
          <CommentSection postId={post.id} />
        </PostCard>
      ))}
    </div>
  );
};

export default Home;

// For creating a post at the top:
function CreatePost({ refreshFeed }) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('content', content);
      if (file) formData.append('file', file);

      await API.post('/posts', formData);
      setContent('');
      setFile(null);
      if (refreshFeed) refreshFeed();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={2}
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
