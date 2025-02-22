import React, { useState, useEffect } from 'react';
import API from '../services/api';

const CommentSection = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const reloadComments = () => {
    fetchComments();
  };

  // Submit a top-level comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await API.post('/comments', {
        userId,
        postId,
        parentCommentId: null,
        commentText,
      });
      setCommentText('');
      setShowCommentBox(false);
      reloadComments();
    } catch (err) {
      console.error(err);
    }
  };

  const likeComment = async (commentId) => {
    try {
      await API.post('/comments/like', { userId, commentId });
      reloadComments();
    } catch (err) {
      console.error(err);
    }
  };

  const unlikeComment = async (commentId) => {
    try {
      await API.post('/comments/unlike', { userId, commentId });
      reloadComments();
    } catch (err) {
      console.error(err);
    }
  };

  // Component to render a single comment with a toggleable reply box
  const CommentItem = ({ comment, childrenComments }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = async (e) => {
      e.preventDefault();
      if (!replyText.trim()) return;
      try {
        await API.post('/comments', {
          userId,
          postId,
          parentCommentId: comment.id,
          commentText: replyText,
        });
        setReplyText('');
        setShowReplyBox(false);
        reloadComments();
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div style={{ marginLeft: comment.parent_comment_id ? '1.5rem' : '0', marginTop: '1rem' }}>
        <div style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
          <strong>@{comment.username}</strong>: {comment.comment_text}
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={() => likeComment(comment.id)}>Like</button>
            <button onClick={() => unlikeComment(comment.id)}>Unlike</button>
            <span style={{ marginLeft: '0.5rem' }}>{comment.commentLikeCount} likes</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={() => setShowReplyBox(!showReplyBox)}>
              {showReplyBox ? 'Cancel' : 'Reply'}
            </button>
          </div>
          {showReplyBox && (
            <form onSubmit={handleReplySubmit} style={{ marginTop: '0.5rem' }}>
              <input
                type="text"
                placeholder="Reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
        {childrenComments}
      </div>
    );
  };

  // Recursively render comments using CommentItem
  const renderComments = (list, parentId = null) => {
    return list
      .filter((c) => c.parent_comment_id === parentId)
      .map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          childrenComments={renderComments(list, comment.id)}
        />
      ));
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Top-level comment input: only shown when user clicks "Add Comment" */}
      {!showCommentBox ? (
        <button onClick={() => setShowCommentBox(true)}>Add Comment</button>
      ) : (
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      )}
      <div style={{ marginTop: '1rem' }}>
        {renderComments(comments, null)}
      </div>
    </div>
  );
};

export default CommentSection;
