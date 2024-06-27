import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../../api";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Register.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("register-body");

    const timeout = setTimeout(() => {
      setIsFormVisible(true);
    }, 100);

    return () => {
      document.body.classList.remove("register-body");
      clearTimeout(timeout);
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password, name, telephone });
      Swal.fire({
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada con éxito.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          content: "swal-text",
        },
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Mostrar mensaje de error específico de la API
      } else {
        setError("Error al registrar"); // Mensaje de error genérico
      }
    }
  };

  return (
    <div className={`register-container ${isFormVisible ? "show" : ""}`}>
      <h2>Registro</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="input-container">
          <FaUser className="icon" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            required
          />
        </div>
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
        <div className="input-container">
          <FaPhone className="icon" />
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Celular"
            required
          />
        </div>
        <button type="submit" className="register-button">
          Crear cuenta
        </button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
