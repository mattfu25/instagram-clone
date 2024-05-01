import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CreatePostModal from '../components/CreatePostModal';

function SearchPage() {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  return (
    <>
      <Sidebar
        showCreatePostModal={showCreatePostModal}
        setShowCreatePostModal={setShowCreatePostModal}
      />
      <div className="flex items-center justify-center" style={{ height: '100vh', marginLeft: '4rem' }}>
        <p>Search</p>
        <CreatePostModal
          showCreatePostModal={showCreatePostModal}
          setShowCreatePostModal={setShowCreatePostModal}
        />
      </div>
    </>
  );
}

export default SearchPage;
