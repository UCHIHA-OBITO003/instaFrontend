// src/pages/SearchPage.js
import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [activeTab, setActiveTab] = useState(null); // 'users' or 'posts'
  
  // For "dynamic while typing" we can do a simple setTimeout
  const typingTimeoutRef = useRef(null);

  // If you want to auto-search whenever query changes:
  useEffect(() => {
    if (!activeTab) return;

    // Clear previous typing timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Set new typing timer
    typingTimeoutRef.current = setTimeout(() => {
      handleSearch(activeTab);
    }, 500); // 500ms debounce
  }, [query, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // If query is not empty, search immediately
    if (query.trim()) {
      handleSearch(tab);
    }
  };

  const handleSearch = async (type) => {
    if (!query.trim()) {
      if (type === 'users') setUserResults([]);
      if (type === 'posts') setPostResults([]);
      return;
    }

    try {
      if (type === 'users') {
        const res = await API.get(`/users/search?query=${query}`);
        setUserResults(res.data);
      } else if (type === 'posts') {
        const res = await API.get(`/posts/search?query=${query}`);
        setPostResults(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Search Page</h2>
      <input
        type="text"
        placeholder="Type your search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => handleTabClick('users')}>Search Users</button>
        <button onClick={() => handleTabClick('posts')}>Search Posts</button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h3>User Results</h3>
          {userResults.length === 0 && <p>No matching users.</p>}
          {userResults.map((user) => (
            <div key={user.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              <strong>@{user.username}</strong>
              {/* Possibly link to the user’s profile */}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          <h3>Post Results</h3>
          {postResults.length === 0 && <p>No matching posts.</p>}
          {postResults.map((post) => (
            <div key={post.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              <strong>@{post.username}</strong> : {post.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
