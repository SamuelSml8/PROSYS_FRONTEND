import React, { useEffect, useState } from "react";
import { getUserFromToken, logout } from "../utils/auth";

export const Navigation = (props) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loggedUser = getUserFromToken();
    setUser(loggedUser);
    if (loggedUser && loggedUser.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            Prosys
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Funciones
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                Sobre nosotros
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Servicios
              </a>
            </li>
            <li>
              <a href="/products" className="page-scroll">
                Productos
              </a>
            </li>
            {user ? (
              <>
                {isAdmin && (
                  <li>
                    <a href="/products-admin" className="page-scroll">
                      Panel de control
                    </a>
                  </li>
                )}
                <li>
                  <a href="#" onClick={handleLogout}>
                    Cerrar sesión
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/login">Iniciar sesión</a>
                </li>
                <li>
                  <a href="/register">Crear cuenta</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
