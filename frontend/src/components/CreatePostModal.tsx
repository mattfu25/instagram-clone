import React, { useState } from 'react';
import axios from 'axios';

function CreatePostModal({ showCreatePostModal, setShowCreatePostModal }) {
  const [picture, setPicture] = useState(null);
  const [caption, setCaption] = useState('');

  const handlePictureChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('picture', picture);
    formData.append('caption', caption);

    try {
      const response = await axios.post('/api/post/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowCreatePostModal(false);
    } catch (error) {
      alert(error.response.data.error || 'Failed to create post.');
    }
  };

  if (!showCreatePostModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        className="bg-white p-5 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-3">Create new post</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handlePictureChange}
          className="mb-3"
        />
        <textarea
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a caption..."
          className="border p-2 mb-3 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Share
        </button>
        <button
          type="button"
          onClick={() => setShowCreatePostModal(false)}
          className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default CreatePostModal;
