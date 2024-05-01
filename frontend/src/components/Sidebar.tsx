import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import homeIcon from '../assets/home-icon.svg';
import searchIcon from '../assets/search-icon.svg';
import createIcon from '../assets/create-icon.svg';

function Sidebar({ showCreatePostModal, setShowCreatePostModal }) {
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch the session data to get the username
        const sessionRes = await axios.get('/api/user/session');
        if (sessionRes.data && sessionRes.data.session) {
          const username = sessionRes.data.session;

          // Fetch profile data using the username
          const profileRes = await axios.get(`/api/user/profile/${username}`);
          if (profileRes.data && profileRes.data.profilePicture) {
            const profilePicUrl = profileRes.data.profilePicture;

            // Update state with the new profile picture URL
            setProfilePic(`/api/user/profile-pictures/${profilePicUrl}`);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile', error);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleCreatePostModal = () => {
    setShowCreatePostModal(!showCreatePostModal);
  };

  return (
    <div className="fixed top-0 left-0 h-full w-16 m-0 flex flex-col bg-white text-gray-800 shadow-lg">
      <button onClick={() => navigate('/home')} className="p-4">
        <img src={homeIcon} alt="Home" className="w-full" />
      </button>
      <button onClick={() => navigate('/search')} className="p-4">
        <img src={searchIcon} alt="Search" className="w-full" />
      </button>
      <button onClick={toggleCreatePostModal} className="p-4">
        <img src={createIcon} alt="Create Post" className="w-full" />
      </button>
      <button onClick={() => navigate('/profile')} className="p-4">
        <img src={profilePic} alt="Profile" className="w-full rounded-full" />
      </button>
    </div>
  );
}

export default Sidebar;
