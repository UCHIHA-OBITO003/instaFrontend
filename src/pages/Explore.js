import React, { useEffect, useState } from 'react';
import API from '../services/api';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem('userId');
  const [sort, setSort] = useState('none'); // Default to "None" (No sorting)
  const [appliedSort, setAppliedSort] = useState('none'); // Tracks last applied filter

  useEffect(() => {
    fetchExplore();
  }, [appliedSort]); // Only refetch when "Apply Filter" is clicked

  const fetchExplore = async () => {
    try {
      let endpoint = `/posts/explore`;
      if (appliedSort !== 'none') {
        endpoint += `?sort=${appliedSort}`;
      }
      const res = await API.get(endpoint);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyFilter = () => {
    setAppliedSort(sort); // Update applied filter and trigger useEffect
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
          <option value="none">None</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most_liked">Most Liked</option>
          <option value="least_liked">Least Liked</option>
          <option value="most_commented">Most Commented</option>
          <option value="least_commented">Least Commented</option>
          <option value="media_only">Posts with Media</option>
        </select>
        <button 
          onClick={handleApplyFilter} 
          style={{ marginLeft: '1rem', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Apply Filter
        </button>
      </div>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onUnlike={handleUnlike}
          >
            <CommentSection postId={post.id} />
          </PostCard>
        ))
      )}
    </div>
  );
};

export default Explore;
