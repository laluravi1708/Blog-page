import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/posts", form);
      navigate(`/post/${data._id}`);
    } catch (err) { setError(err.response?.data?.message || "Please login first."); }
  }

  return <div className="editor">
    <h1>Write a new post</h1>
    <form onSubmit={submit}>
      <input placeholder="Post title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
      <textarea rows="14" placeholder="Start writing..." value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required />
      {error && <p className="error">{error}</p>}
      <button className="primary">Publish post</button>
    </form>
  </div>;
}
