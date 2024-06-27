import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../../api";
import { setAuthToken, getUserFromToken } from "../../../utils/auth";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-body");

    const timeout = setTimeout(() => {
      setIsFormVisible(true);
    }, 100);

    return () => {
      document.body.classList.remove("login-body");
      clearTimeout(timeout);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      const token = response.data.data.access_token;
      setAuthToken(token);

      const user = getUserFromToken();
      if (user && user.role === "admin") {
        navigate("/products-admin");
      } else if (user && user.role === "user") {
        navigate("/");
      } else {
        setError("Unable to determine user role");
      }
    } catch (err) {
      setError("Correo electrónico o contraseña incorrecta");
    }
  };

  return (
    <div className={`login-container ${isFormVisible ? "show" : ""}`}>
      <h2>Iniciar sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <FaEnvelope className="icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
          />
        </div>
        <div className="input-container">
          <FaLock className="icon" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      <p>
        ¿No tienes una cuenta? <Link to="/register">Crear una</Link>
      </p>
    </div>
  );
};

export default LoginPage;
