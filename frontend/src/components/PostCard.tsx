import React from 'react';
import axios from 'axios';
import likeEmptyIcon from '../assets/like-empty-icon.svg';

// TODO: Add unlikes and change like icon
const PostCard = ({ post, mutate }) => {
  const profilePictureUrl = `/api/user/profile-pictures/${post.User.profilePicture}`;
  const postPictureUrl = `/api/post/posts/${post.picture}`;

  const handleLike = async () => {
    try {
      await axios.post('/api/like/add', { postId: post.postId });
      mutate();
    } catch (error) {
      alert(error.response.data.error || 'Failed to like.');
    }
  };

  const handleCommentSubmit = async (commentText) => {
    try {
      await axios.post('/api/comment/add', {
        postId: post.postId,
        text: commentText,
      });
      mutate();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const commentText = event.target.value;
      handleCommentSubmit(commentText);
      event.target.value = '';
    }
  };

  return (
    <div className="border m-4">
      <div className="flex items-center space-x-2 mb-2 px-4 py-2">
        <img
          src={profilePictureUrl}
          alt={`${post.User.username}'s profile`}
          className="h-10 w-10 rounded-full"
        />
        <span className="font-bold">{post.User.username}</span>
        <span className="text-sm">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      <img
        src={postPictureUrl}
        alt="Post"
        className="max-w-full h-auto"
        style={{ maxWidth: '500px' }}
      />
      <div className="flex items-center mt-2 px-4 py-2">
        <button onClick={handleLike} className="flex items-center mr-2">
          <img src={likeEmptyIcon} alt="Like" className="h-6 w-6" />
        </button>
        <span>{post.likeCount} Likes</span>
      </div>
      <div className="px-4 py-1">
        <strong>{post.User.username}</strong> {post.caption}
      </div>
      <div className="mt-1 px-4">
        {post.comments.map((comment) => (
          <div key={comment.createdAt} className="mt-1 text-gray-500">
            <strong>{comment.userUsername}</strong> {comment.text}
          </div>
        ))}
      </div>
      <form className="mt-1 px-4 py-1">
        <input
          type="text"
          name="comment"
          placeholder="Add a comment..."
          className="p-2 w-full"
          style={{ paddingLeft: '0' }}
          onKeyPress={handleKeyPress}
        />
      </form>
    </div>
  );
};

export default PostCard;
