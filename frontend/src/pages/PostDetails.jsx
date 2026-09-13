import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function PostDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [p, c] = await Promise.all([api.get(`/posts/${id}`), api.get(`/comments/post/${id}`)]);
    setPost(p.data); setComments(c.data);
  };
  useEffect(() => { load().catch(()=>setError("Could not load post.")); }, [id]);

  async function addComment(e) {
    e.preventDefault();
    try { await api.post(`/comments/post/${id}`, {content: comment}); setComment(""); load(); }
    catch (err) { setError(err.response?.data?.message || "Login required."); }
  }

  async function deletePost() {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/posts/${id}`); navigate("/");
  }

  async function deleteComment(cid) {
    await api.delete(`/comments/${cid}`); load();
  }

  if (!post) return <p>{error || "Loading..."}</p>;
  const owner = user && post.author?._id === user.id;

  return <article className="post">
    <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
    <h1>{post.title}</h1>
    <small>By {post.author?.name}</small>
    <div className="post-content">{post.content}</div>
    {owner && <div className="actions"><Link to={`/edit/${id}`}>Edit</Link><button onClick={deletePost}>Delete</button></div>}

    <section className="comments">
      <h2>Comments ({comments.length})</h2>
      <form onSubmit={addComment} className="comment-form">
        <textarea rows="3" placeholder="Share your thoughts..." value={comment} onChange={e=>setComment(e.target.value)} required />
        <button className="primary">Comment</button>
      </form>
      {error && <p className="error">{error}</p>}
      {comments.map(c=><div className="comment" key={c._id}>
        <div><strong>{c.author?.name}</strong><span>{new Date(c.createdAt).toLocaleDateString()}</span></div>
        <p>{c.content}</p>
        {user?.id === c.author?._id && <button onClick={()=>deleteComment(c._id)}>Delete</button>}
      </div>)}
    </section>
  </article>;
}
