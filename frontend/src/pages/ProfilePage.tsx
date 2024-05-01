import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CreatePostModal from '../components/PostCreateModal';

function ProfilePage() {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  return (
    <>
      <Sidebar
        showCreatePostModal={showCreatePostModal}
        setShowCreatePostModal={setShowCreatePostModal}
      />
      <div
        className="flex items-center justify-center"
        style={{ height: '100vh', marginLeft: '4rem' }}
      >
        <p>Profile</p>
        <CreatePostModal
          showCreatePostModal={showCreatePostModal}
          setShowCreatePostModal={setShowCreatePostModal}
        />
      </div>
    </>
  );
}

export default ProfilePage;
