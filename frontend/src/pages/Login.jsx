import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
  }

  return <div className="auth">
    <h1>Welcome back</h1><p>Login to continue writing.</p>
    <form onSubmit={submit}>
      <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
      <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
      {error && <p className="error">{error}</p>}
      <button className="primary">Login</button>
    </form>
    <p>Don't have an account? <Link to="/register">Register</Link></p>
  </div>;
}
