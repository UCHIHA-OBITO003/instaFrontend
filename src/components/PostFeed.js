import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, TextField, Button } from '@mui/material';
import PostItem from './PostItem';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const userId = localStorage.getItem('userId');

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', userId);
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setContent('');
      setImage(null);
      fetchPosts(); // Refresh post feed
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleCreatePost} sx={{ mb: 4 }}>
        <TextField
          label="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" component="label" sx={{ mr: 2 }}>
          Upload Image
          <input
            hidden
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
        <Button variant="contained" type="submit">Post</Button>
      </Box>

      {posts.map((post) => (
        <PostItem key={post.id} post={post} fetchPosts={fetchPosts} />
      ))}
    </Container>
  );
}
