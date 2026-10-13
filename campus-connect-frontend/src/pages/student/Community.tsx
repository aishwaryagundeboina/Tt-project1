import React, { useEffect, useState } from 'react';
import { getAllPosts, Post, createPost, addComment } from '../../services/communityService';
import { MessageSquare, User, Send } from 'lucide-react';

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newPostTitle || !newPostContent) return;
      try {
          await createPost({title: newPostTitle, content: newPostContent});
          setNewPostTitle('');
          setNewPostContent('');
          fetchPosts(); // Refresh
      } catch (err) {
          console.error(err);
      }
  }

  const handleAddComment = async (postId: number, e: React.FormEvent) => {
      e.preventDefault();
      const content = commentInputs[postId];
      if(!content) return;
      try {
          await addComment(postId, {content});
          setCommentInputs({...commentInputs, [postId]: ''});
          fetchPosts(); // Refresh
      } catch(err) {
          console.error(err);
      }
  }

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading community discussions...</div>;

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-xl font-bold mb-4 flex items-center"><MessageSquare className="mr-2" /> Start a Discussion</h2>
           <form onSubmit={handleCreatePost} className="space-y-4">
              <input type="text" placeholder="Title" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              <textarea placeholder="What's on your mind?" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px]" required />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Post</button>
           </form>
        </div>

        <div className="space-y-6">
            {posts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1"/> <span className="font-medium mr-4">{post.authorName}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-700 mb-4">Comments ({post.comments.length})</h4>
                        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                            {post.comments.map(comment => (
                                <div key={comment.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <p className="text-gray-800 text-sm mb-1">{comment.content}</p>
                                    <div className="text-xs text-gray-500 flex justify-between">
                                        <span>{comment.authorName}</span>
                                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center mt-2">
                            <input type="text" placeholder="Add a comment..." value={commentInputs[post.id] || ''} onChange={e => setCommentInputs({...commentInputs, [post.id]: e.target.value})} className="flex-1 rounded-l-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" required />
                            <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 py-2 rounded-r-lg text-gray-600 hover:bg-gray-200">
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
