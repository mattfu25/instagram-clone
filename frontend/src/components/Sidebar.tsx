import React from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home-icon.svg';
import searchIcon from '../assets/search-icon.svg';
import createIcon from '../assets/create-icon.svg';

function Sidebar({ showCreatePostModal, setShowCreatePostModal }) {
    const navigate = useNavigate();

    const toggleCreatePostModal = () => {
        setShowCreatePostModal(!showCreatePostModal);
    };

    return (
        <div className="fixed top-0 left-0 h-full w-16 m-0 flex flex-col bg-white text-gray-800 shadow">
            <button onClick={() => navigate('/home')} className="p-4">
                <img src={homeIcon} alt="Home" className="w-full" />
            </button>
            <button onClick={() => navigate('/search')} className="p-4">
                <img src={searchIcon} alt="Search" className="w-full" />
            </button>
            <button onClick={toggleCreatePostModal} className="p-4">
                <img src={createIcon} alt="Create Post" className="w-full" />
            </button>
        </div>
    );
}

export default Sidebar;
