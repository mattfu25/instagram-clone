import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import CreatePostModal from '../components/PostCreateModal';
import Profile from '../components/Profile';

function ProfilePage() {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // Fetch the session data to get the username
        const sessionRes = await axios.get('/api/user/session');
        if (sessionRes.data && sessionRes.data.session) {
          const username = sessionRes.data.session;

          // Update state with the new username
          setUsername(username);
        }
      } catch (error) {
        console.error('Error fetching username', error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <>
      <Sidebar
        showCreatePostModal={showCreatePostModal}
        setShowCreatePostModal={setShowCreatePostModal}
      />
      <div
        className="flex flex-col items-center"
        style={{ minHeight: '100vh', marginLeft: '4rem' }}
      >
        <Profile username={username} />
        <CreatePostModal
          showCreatePostModal={showCreatePostModal}
          setShowCreatePostModal={setShowCreatePostModal}
        />
      </div>
    </>
  );
}

export default ProfilePage;
