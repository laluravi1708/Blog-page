import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register({ setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (err) { setError(err.response?.data?.message || "Registration failed"); }
  }

  return <div className="auth">
    <h1>Create account</h1><p>Join the BlogNest community.</p>
    <form onSubmit={submit}>
      <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
      <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
      <input type="password" placeholder="Password" minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
      {error && <p className="error">{error}</p>}
      <button className="primary">Register</button>
    </form>
    <p>Already registered? <Link to="/login">Login</Link></p>
  </div>;
}
