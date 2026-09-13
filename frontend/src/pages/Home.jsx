import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/posts").then(r => setPosts(r.data)).catch(() => setError("Could not load posts."));
  }, []);

  return <>
    <section className="hero">
      <p className="eyebrow">SHARE • READ • CONNECT</p>
      <h1>Ideas worth <span>sharing.</span></h1>
      <p>Write your thoughts, discover new stories, and join the conversation.</p>
      <Link className="primary" to="/create">Create a post</Link>
    </section>

    <h2>Latest posts</h2>
    {error && <p className="error">{error}</p>}
    <div className="grid">
      {posts.map(post => (
        <article className="card" key={post._id}>
          <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
          <h3>{post.title}</h3>
          <p>{post.content.length > 150 ? post.content.slice(0,150) + "..." : post.content}</p>
          <small>By {post.author?.name || "User"}</small>
          <Link to={`/post/${post._id}`} className="read">Read more →</Link>
        </article>
      ))}
      {!posts.length && !error && <p>No posts yet. Be the first to write one!</p>}
    </div>
  </>;
}
