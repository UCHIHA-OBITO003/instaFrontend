// frontend/src/pages/Explore.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem('userId');
  const [sort, setSort] = useState('newest'); // Default to latest posts

  useEffect(() => {
    fetchExplore();
  }, [sort]);

  const fetchExplore = async () => {
    try {
      const endpoint = `/posts/explore?sort=${sort}`;
      const res = await API.get(endpoint);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.post('/posts/like', { userId, postId });
      fetchExplore();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await API.post('/posts/unlike', { userId, postId });
      fetchExplore();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Explore</h2>
      <div>
        <label>Sort by:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most_liked">Most Liked</option>
          <option value="least_liked">Least Liked</option>
          <option value="most_commented">Most Commented</option>
          <option value="least_commented">Least Commented</option>
          <option value="media_only">Posts with Media</option>
        </select>
      </div>

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

export default Explore;
