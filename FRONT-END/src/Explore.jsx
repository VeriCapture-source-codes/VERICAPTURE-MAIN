import React, { useState, useEffect } from "react";
import GoLiveModal from './Components/GoLiveModal';
import CommentSection from './CommentSection';
import {Link} from 'react-router-dom';
import {toast, Toaster} from 'react-hot-toast';
import { apiRequest } from './utils/api'; 
import {Heart, Edit, Trash2} from 'lucide-react'
import './Explore.css';

function ExplorePage() {
  const categories = ['Crime', 'Protest', 'Accident', 'Riot', 'Traffic', 'General'];
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [posts, setPosts] = useState([]);

  const openGoLiveModal = () => setShowGoLiveModal(true);
  const closeGoLiveModal = () => {
    setShowGoLiveModal(false);
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      const result = await apiRequest({ 
      method: 'GET', 
      route: '/users/get-user-posts'
       });

      if (result.success) {
        setPosts(result.data.posts || []);
      } else {
        toast.error('Failed to fetch posts:', result.message);
      }
    } catch (error) {
      toast.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await apiRequest({
        method: 'POST',
        route: `/users/like-post/${postId}`,
      });
      if (result.success) {
        toast.success('Post liked!');
        fetchPosts();
      } else {
        toast.error(result.message || 'Failed to like post');
      }
    } catch (err) {
      toast.error('Error liking post' + err.message);
    }
  };
  
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
  
    try {
      const result = await apiRequest({
        method: 'DELETE',
        route: `/users/delete-post/${postId}`,
      });
      if (result.success) {
        toast.success('Post deleted!');
        fetchPosts();
      } else {
        toast.error(result.message || 'Failed to delete post');
      }
    } catch (err) {
      toast.error('Error deleting post' + err.message);
    }
  };
  
  const handleEdit = () => {
    // You can either open a modal or navigate to an edit page
    // Example: navigate(`/edit-post/${post._id}`) using useNavigate from react-router
    toast('Edit functionality not implemented yet'); // Placeholder
  };
  

  const getFileExtension = (url) => url.split('.').pop().toLowerCase().split('?')[0];

  const renderMedia = (mediaUrl) => {
    const ext = getFileExtension(mediaUrl);
    if (['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(ext)) {
      return <video src={mediaUrl} controls className="post-media" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <img src={mediaUrl} alt="Post Media" className="post-media" />;
    } else {
      return <p>Unsupported media type</p>;
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="explore-container">
    <Toaster position="top-center" reverseOrder={false} />
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/Explore Vericapture img.png" alt="Logo" />
        </div>
        <nav className="sidebar-nav">
          <Link to ="#" className="nav-item active">
            <img src="/House.png" alt="Home" className="icon" />
            Home
          </Link>

          <Link to ="/explore" className="nav-item">
            <img src="/Explore.png" alt="Explore" className="icon" />
            Explore
          </Link>
         
          <Link to="#" className="nav-item">
            <img src="/notification.png" alt="Notification" className="icon" />
            Notification
          </Link>
          
          <Link to="#" className="nav-item">
            <img src="/user.png" alt="Profile" className="icon" />
            Profile
          </Link>
        </nav>
      </aside>

      <div className="main-content">
        <div className="top-nav">
          <div className="top-links">
            <div>
              <a href="#">Home</a>
              <a href="#">RealTime Capture</a>
              <a href="#">Map</a>
              <a href="#">Trending</a>
            </div>
            <div className="action-buttons">
              <button className="btn btn-update">Post an Update</button>
              <button className="btn btn-live" onClick={openGoLiveModal}>Go Live</button>
            </div>
          </div>
        </div>

        <div className="category-container">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="feed">
          {posts.length === 0 ? (
            <div className="feed-empty">
              <img src="/empty-state.png" alt="Empty Feed" />
              <p>No posts yet! Start by uploading 🚀</p>
            </div>
          ) : (
            <div className="post-grid">
              {posts
                .filter(post => selectedCategory === 'General' || post.category === selectedCategory
                )
                .map(post => (
                  <div key={post._id} className="post-card">
                    <h4 className="post-title">{post.caption}</h4>
                    <p className="post-meta"><strong>Location:</strong> {post.location || 'Unknown'}</p>
                    {renderMedia(post.media)}
                    <CommentSection 
                     postId={post._id} 
                    comments={post.comments || []} 
                     refreshPosts={fetchPosts} />

                    <div className="post-actions">
              <button className="icon-btn" onClick={() => handleLike(post._id)} title="Like">
                <Heart size={20} color="red" />
              </button>
            
             <button className="icon-btn" onClick={() => handleEdit(post)} title="Edit">
                <Edit size={20} color="blue" />
             </button>
            
            <button className="icon-btn" onClick={() => handleDelete(post._id)}title="Delete">
                <Trash2 size={20} color="red" />
              </button>
         </div>
            </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showGoLiveModal && (
        <GoLiveModal selectedCategory={selectedCategory} onClose={closeGoLiveModal} />
      )}
    </div>
  );
}

export default ExplorePage;
