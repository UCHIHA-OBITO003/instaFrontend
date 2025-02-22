// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';

const Profile = () => {
  const { userId } = useParams();
  const loggedInUserId = localStorage.getItem('userId');
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
    fetchFollowers();
    fetchFollowing();
    // eslint-disable-next-line
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await API.get(`/users/profile/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await API.get(`/posts/user/${userId}`);
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await API.get(`/follows/${userId}/followers`);
      setFollowers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await API.get(`/follows/${userId}/following`);
      setFollowing(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    try {
      await API.post('/follows/follow', {
        followerId: loggedInUserId,
        followedId: userId,
      });
      fetchFollowers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await API.post('/follows/unfollow', {
        followerId: loggedInUserId,
        followedId: userId,
      });
      fetchFollowers();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <div>Loading user...</div>;

  const isFollowing = followers.some((f) => f.id === Number(loggedInUserId));

  return (
    <div className="container">
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>

      {user.avatar_url && (
        <img
          src={user.avatar_url}
          alt="Avatar"
          style={{ width: '100px', borderRadius: '50%' }}
        />
      )}
      <div>
        <span>Followers: {followers.length}</span> | <span>Following: {following.length}</span>
      </div>

      {/* Only show follow/unfollow if viewing someone else's profile */}
      {loggedInUserId !== userId && (
        <button onClick={isFollowing ? handleUnfollow : handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}

      <hr />
      <h3>Posts by {user.username}</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post}>
          <CommentSection postId={post.id} />
        </PostCard>
      ))}
    </div>
  );
};

export default Profile;
