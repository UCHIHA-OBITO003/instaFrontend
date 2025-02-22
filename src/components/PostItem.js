import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, TextField } from '@mui/material';

export default function PostItem({ post, fetchPosts }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post('http://localhost:5000/api/posts/like', {
        userId,
        postId: post.id
      });
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.post('http://localhost:5000/api/posts/unlike', {
        userId,
        postId: post.id
      });
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/posts/comment', {
        userId,
        postId: post.id,
        commentText
      });
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      {post.image_url && (
        <CardMedia
          component="img"
          height="300"
          image={`http://localhost:5000/${post.image_url}`} // If using static path, ensure you set up express.static
          alt="Post image"
        />
      )}
      <CardContent>
        <Typography variant="h6">@{post.username}</Typography>
        <Typography variant="body1">{post.content}</Typography>
        <Typography variant="body2" color="text.secondary">
          Likes: {post.likeCount} | Comments: {post.commentCount}
        </Typography>
        <Button onClick={handleLike} sx={{ mr: 2 }}>Like</Button>
        <Button onClick={handleUnlike}>Unlike</Button>
      </CardContent>
      <CardContent>
        <form onSubmit={handleComment}>
          <TextField
            label="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            fullWidth
            size="small"
          />
          <Button type="submit" variant="contained" size="small" sx={{ mt: 1 }}>
            Comment
          </Button>
        </form>
        {comments.map((cmt) => (
          <Typography variant="body2" key={cmt.id} sx={{ mt: 1 }}>
            <strong>@{cmt.username}: </strong>
            {cmt.comment_text}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}
