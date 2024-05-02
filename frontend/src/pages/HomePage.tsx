import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import CreatePostModal from '../components/PostCreateModal';
import PostCard from '../components/PostCard';

const fetcher = (url) => axios.get(url).then((res) => res.data);

function HomePage() {
  const [showCreatePostModal, setShowCreatePostModal] = React.useState(false);
  const { data: posts, mutate } = useSWR('/api/post/feed', fetcher);

  return (
    <>
      <Sidebar
        showCreatePostModal={showCreatePostModal}
        setShowCreatePostModal={setShowCreatePostModal}
      />
      <div
        className="flex items-start justify-center"
        style={{
          height: 'calc(100vh - 4rem)',
          marginLeft: '4rem',
          overflowY: 'auto',
        }}
      >
        <div>
          {posts &&
            posts.map((post) => (
              <PostCard key={post.postId} post={post} mutate={mutate} />
            ))}
        </div>
        <CreatePostModal
          showCreatePostModal={showCreatePostModal}
          setShowCreatePostModal={setShowCreatePostModal}
        />
      </div>
    </>
  );
}

export default HomePage;
