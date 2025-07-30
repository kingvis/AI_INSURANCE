"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { motion } from "framer-motion";
import { Database, Plus, Trash2, RefreshCw } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id?: string;
}

export function SupabaseDemo() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [error, setError] = useState<string | null>(null);
  
  const { supabase, user } = useSupabase();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("posts")
        .insert([
          {
            title: newPost.title,
            content: newPost.content,
            author_id: user?.id,
          },
        ]);

      if (error) throw error;
      setNewPost({ title: "", content: "" });
      await fetchPosts();
    } catch (error: any) {
      setError(error.message);
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchPosts();
    } catch (error: any) {
      setError(error.message);
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Database className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-semibold">Supabase Database Demo</h3>
        <Button
          onClick={fetchPosts}
          variant="outline"
          size="sm"
          disabled={loading}
          className="ml-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
        >
          Database Error: {error} 
          <br />
          <span className="text-xs opacity-75">
            Note: You need to create the 'posts' table in your Supabase dashboard first.
          </span>
        </motion.div>
      )}

      {/* Create Post Form */}
      <form onSubmit={createPost} className="space-y-4">
        <input
          type="text"
          placeholder="Post title..."
          value={newPost.title}
          onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          placeholder="Post content..."
          value={newPost.content}
          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <Button
          type="submit"
          disabled={loading || !newPost.title.trim() || !newPost.content.trim()}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {loading ? <Loading size="sm" className="mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Create Post
        </Button>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        {loading && posts.length === 0 ? (
          <div className="text-center py-8">
            <Loading />
            <p className="mt-2 text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No posts yet. Create your first post above!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{post.title}</h4>
                <Button
                  onClick={() => deletePost(post.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-400/30 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-gray-300 text-sm mb-2">{post.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleDateString()} at{" "}
                {new Date(post.created_at).toLocaleTimeString()}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 