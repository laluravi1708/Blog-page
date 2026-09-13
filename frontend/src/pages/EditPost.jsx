import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function EditPost() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/posts/${id}`).then(r=>setForm({title:r.data.title,content:r.data.content}));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    try { await api.put(`/posts/${id}`, form); navigate(`/post/${id}`); }
    catch (err) { setError(err.response?.data?.message || "Update failed"); }
  }

  return <div className="editor">
    <h1>Edit post</h1>
    <form onSubmit={submit}>
      <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
      <textarea rows="14" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required />
      {error && <p className="error">{error}</p>}
      <button className="primary">Save changes</button>
    </form>
  </div>;
}
