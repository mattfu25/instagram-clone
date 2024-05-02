import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ username }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`api/user/profile/${username}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [username]);

  const handleFollow = async () => {
    try {
      await axios.post('api/follower/follow', { usernameToFollow: username });
      alert('Follow request sent!');
    } catch (error) {
      alert(error.response.data.error || 'Failed to follow.');
    }
  };

  return (
    <div className="container mx-auto w-1/2 mt-0"> 
      {userData && (
        <div className="flex flex-col items-center p-4">
          <div className="flex w-full items-center">
            <img
              src={`/api/user/profile-pictures/${userData.profilePicture}`}
              alt="Profile"
              className="h-16 w-16 rounded-full"
            />
            <div className="ml-4"> 
              <h1 className="text-xl font-bold">{userData.username}</h1>
              <p className="text-sm">{userData.firstName} {userData.lastName}</p>
            </div>
            <div className="flex-grow" /> 
            <button
              onClick={handleFollow}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Follow
            </button>
          </div>
          <div className="flex justify-center space-x-10 p-2">
            <div><span className="font-bold">{userData.posts.length}</span> posts</div>
            <div><span className="font-bold">{userData.followersCount}</span> followers</div>
            <div><span className="font-bold">{userData.followingCount}</span> following</div>
          </div>
          <div className="grid grid-cols-3 gap-1 p-3 w-full"> 
            {userData.posts.map((post) => (
              <img
                key={post.postId}
                src={`/api/post/posts/${post.picture}`}
                alt="Post"
                className="aspect-square object-cover w-full"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
