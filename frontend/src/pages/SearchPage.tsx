import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CreatePostModal from '../components/PostCreateModal';
import Searchbar from '../components/Searchbar';
import Profile from '../components/Profile';

function SearchPage() {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <>
      <Sidebar
        showCreatePostModal={showCreatePostModal}
        setShowCreatePostModal={setShowCreatePostModal}
      />
      <Searchbar setUsername={setUsername} />
      <div
        className="flex flex-col items-center"
        style={{ minHeight: '100vh', marginLeft: '4rem' }}
      >
        <Profile username={username}/>
        <CreatePostModal
          showCreatePostModal={showCreatePostModal}
          setShowCreatePostModal={setShowCreatePostModal}
        />
      </div>
    </>
  );
}

export default SearchPage;
