import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  getAllCategories,
  findProductByName,
} from "../../api";
import Modal from "../../components/dash-modal/Modal";
import Swal from "sweetalert2";
import "../Tables.css";
import "../../sweetalert2-custom.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category_id: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const response = await getAllProducts(page, 10);
      if (response.data && response.data.data) {
        setProducts(response.data.data.products || []);
        setTotalPages(response.data.data.total || 1);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (Array.isArray(response.data.data.categories)) {
        setCategories(response.data.data.categories);
      } else {
        console.error(
          "Expected an array but got:",
          response.data.data.categories
        );
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
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
      try {
        await deleteProduct(id);
        fetchProducts(currentPage);
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
      } catch (err) {
        console.error("Error deleting product:", err);
        Swal.fire("Error", "Hubo un error eliminando el producto.", "error");
      }
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentProduct({ name: "", price: 0, stock: 0, category_id: 1 });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentProduct({ name: "", price: 0, stock: 0, category_id: 1 });
  };

  const handleSave = async () => {
    try {
      const formattedProduct = {
        ...currentProduct,
        price: parseFloat(currentProduct.price.toString().replace(",", ".")),
      };

      if (
        !formattedProduct.name ||
        formattedProduct.price < 0 ||
        !Number.isInteger(formattedProduct.stock) ||
        !Number.isInteger(formattedProduct.category_id)
      ) {
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Todos los campos deben estar correctamente llenados.",
        });
        return;
      }

      if (currentProduct.id) {
        await updateProduct(currentProduct.id, formattedProduct);
      } else {
        await createProduct(formattedProduct);
      }
      fetchProducts(currentPage);
      handleModalClose();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = err.response.data.message;
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          html: errors.map((error) => `<p>${error}</p>`).join(""),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error inesperado.",
        });
      }
    }
  };

  const getCategoryNameById = (id) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : "Sin categoría";
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      try {
        const response = await findProductByName(term);
        if (response.data && response.data.data) {
          setProducts(response.data.data.products || []);
          setTotalPages(response.data.data.total || 1);
          setCurrentPage(1);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (err) {
        console.error("Error searching products:", err);
      }
    } else {
      fetchProducts(currentPage);
    }
  };

  if (!products || !Array.isArray(products)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-container">
      <h2>Productos</h2>
      <div className="table-header">
        <button className="add" onClick={handleAdd}>
          Agregar
        </button>
        <input
          type="text"
          className="search"
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Unidades</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{getCategoryNameById(product.category?.id)}</td>
              <td>
                <div className="button-container">
                  <button className="edit" onClick={() => handleEdit(product)}>
                    Editar
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(product.id)}
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
        <h2>{currentProduct.id ? "Editar" : "Agregar"} Producto</h2>
        <form>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={currentProduct.name}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Precio</label>
            <input
              type="text"
              value={currentProduct.price}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  price: e.target.value.replace(",", "."),
                })
              }
            />
          </div>
          <div>
            <label>Unidades</label>
            <input
              type="number"
              value={currentProduct.stock}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  stock: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Categoría</label>
            <select
              value={currentProduct.category_id}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  category_id: parseInt(e.target.value),
                })
              }
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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

export default ProductsPage;
