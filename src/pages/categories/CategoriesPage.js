import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  deleteCategory,
  updateCategory,
  createCategory,
  findCategoryByName,
} from "../../api";
import Swal from "sweetalert2";
import Modal from "../../components/dash-modal/Modal";
import "../../sweetalert2-custom.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const fetchCategories = async (page) => {
    try {
      const response = await getAllCategories(page, 10);
      setCategories(response.data.data.categories);
      setTotalPages(response.data.data.total);
    } catch (err) {
      console.error("Error fetching categories:", err);
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
      await deleteCategory(id);
      fetchCategories(currentPage);
      Swal.fire("¡Eliminado!", "La categoría ha sido eliminada.", "success");
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentCategory({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCategory({ name: "", description: "" });
  };

  const handleSave = async () => {
    try {
      if (currentCategory.id) {
        await updateCategory(currentCategory.id, currentCategory);
      } else {
        await createCategory(currentCategory);
      }
      fetchCategories(currentPage);
      handleModalClose();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      try {
        const response = await findCategoryByName(term);
        setCategories(response.data.data.category); // Actualizamos el estado de categories con el array de categorías encontrado
        setTotalPages(response.data.data.total); // Actualizamos el total de páginas según la respuesta
        setCurrentPage(1); // Reiniciamos a la primera página después de la búsqueda
      } catch (err) {
        console.error("Error searching categories:", err);
      }
    } else {
      fetchCategories(currentPage);
    }
  };

  return (
    <div className="table-container">
      <h2>Categorías</h2>
      <div className="table-header">
        <button className="add" onClick={handleAdd}>
          Agregar
        </button>
        <input
          type="text"
          className="search"
          placeholder="Buscar categorías por nombre..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories &&
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <div className="button-container">
                    <button
                      className="edit"
                      onClick={() => handleEdit(category)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(category.id)}
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
        <h2>{currentCategory.id ? "Editar" : "Agregar"} Categoría</h2>
        <form>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={currentCategory.name}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Descripción</label>
            <input
              type="text"
              value={currentCategory.description}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  description: e.target.value,
                })
              }
            />
          </div>
          <button type="button" onClick={handleSave}>
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
