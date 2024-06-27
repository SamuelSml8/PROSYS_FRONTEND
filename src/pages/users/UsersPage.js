import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
  findUserByName,
} from "../../api";
import Swal from "sweetalert2";
import Modal from "../../components/dash-modal/Modal";
import "../../sweetalert2-custom.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    password: "",
    telephone: "",
    role: "user",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const response = await getAllUsers(page, 10);
      setUsers(response.data.data.users);
      setTotalPages(response.data.data.total);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmed.isConfirmed) {
      await deleteUser(id);
      fetchUsers(currentPage);
      Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentUser({
      name: "",
      email: "",
      password: "",
      telephone: "",
      role: "user",
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentUser({
      name: "",
      email: "",
      password: "",
      telephone: "",
      role: "user",
    });
  };

  const handleSave = async () => {
    try {
      if (currentUser.id) {
        await updateUser(currentUser.id, currentUser);
      } else {
        await createUser(currentUser);
      }
      fetchUsers(currentPage);
      handleModalClose();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      try {
        const response = await findUserByName(term);
        setUsers(response.data.data.users);
        setTotalPages(1); // Reinicia a la primera página después de la búsqueda
        setCurrentPage(1);
      } catch (err) {
        console.error("Error searching users:", err);
      }
    } else {
      fetchUsers(currentPage);
    }
  };

  return (
    <div className="table-container">
      <h2>Usuarios</h2>
      <div className="table-header">
        <button className="add" onClick={handleAdd}>
          Agregar
        </button>
        <input
          type="text"
          className="search"
          placeholder="Buscar usuarios por nombre..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.telephone}</td>
              <td>{user.role}</td>
              <td>
                <div className="button-container">
                  <button className="edit" onClick={() => handleEdit(user)}>
                    Editar
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          Anterior
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Siguiente
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2>{currentUser.id ? "Editar" : "Agregar"} Usuario</h2>
        <form>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={currentUser.name}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={currentUser.email}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
            />
          </div>
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={currentUser.password}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, password: e.target.value })
              }
            />
          </div>
          <div>
            <label>Teléfono</label>
            <input
              type="text"
              value={currentUser.telephone}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, telephone: e.target.value })
              }
            />
          </div>
          <div>
            <label>Rol</label>
            <select
              value={currentUser.role}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, role: e.target.value })
              }
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="button" onClick={handleSave}>
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
