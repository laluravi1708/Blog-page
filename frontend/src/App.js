import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    setUser(null);
    navigate("/");
  }

  return <>
    <nav className="navbar">
      <Link className="brand" to="/">BlogNest</Link>
      <div>
        {user ? <>
          <span className="welcome">Hi, {user.name}</span>
          <Link to="/create">Write</Link>
          <button onClick={logout} className="nav-btn">Logout</button>
        </> : <>
          <Link to="/login">Login</Link>
          <Link to="/register" className="signup">Register</Link>
        </>}
      </div>
    </nav>

    <main className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetails user={user} />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </main>
  </>;
}
