import React, { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5050/VSAPI/V1/auth/login",
        {
          email: email,
          password: password,
        }
      );


      const { token } = response.data;
        localStorage.setItem("token", token); 
        navigate("/home");
      
    } catch (error) {
      console.error("Login failed", error);
      setError(error.response?.data?.message || "Login failed: Unknown error");
    }
  };

  return (
    <div className="login_body">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <p className="login-link">
          Don't have account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
