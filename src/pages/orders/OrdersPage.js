import React, { useState, useEffect } from "react";
import {
  getAllOrders,
  deleteOrder,
  updateOrder,
  createOrder,
  getAllUsers,
  getAllProducts,
} from "../../api";
import Swal from "sweetalert2";
import Modal from "../../components/dash-modal/Modal";
import "../Tables.css";
import "../../sweetalert2-custom.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    user_id: "",
    order_details: [{ product_id: "", quantity: 0 }],
    status: "pending",
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchOrders(currentPage);
    fetchUsers();
    fetchProducts();
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const response = await getAllOrders(page, 10);
      setOrders(response.data.data.orders);
      setTotalPages(response.data.data.total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(1, 100); // Fetching all users
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(1, 100); // Fetching all products
      setProducts(response.data.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // handleDelete para Órdenes
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
        await deleteOrder(id);
        fetchOrders(currentPage);
        Swal.fire("¡Eliminado!", "La orden ha sido eliminada.", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire("Error", "Hubo un error eliminando la orden.", "error");
      }
    }
  };

  const handleEdit = (order) => {
    setCurrentOrder({
      ...order,
      user_id: order.user.id,
      order_details:
        order.orderDetails && order.orderDetails.length > 0
          ? order.orderDetails.map((detail) => ({
              product_id: detail.product.id,
              quantity: detail.quantity,
            }))
          : [{ product_id: "", quantity: 0 }],
      status: order.status || "pending",
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentOrder({
      user_id: "",
      order_details: [{ product_id: "", quantity: 0 }],
      status: "pending",
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentOrder({
      user_id: "",
      order_details: [{ product_id: "", quantity: 0 }],
      status: "pending",
    });
  };

  const handleSave = async () => {
    const userId = parseInt(currentOrder.user_id);
    const orderDetails = currentOrder.order_details.map((detail) => ({
      ...detail,
      product_id: parseInt(detail.product_id),
    }));

    try {
      let response;
      if (currentOrder.id) {
        response = await updateOrder(currentOrder.id, {
          ...currentOrder,
          user_id: userId,
          order_details: orderDetails,
          status: currentOrder.status,
        });
      } else {
        response = await createOrder({
          ...currentOrder,
          user_id: userId,
          order_details: orderDetails,
          status: currentOrder.status,
        });
      }
      fetchOrders(currentPage);
      handleModalClose();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  return (
    <div className="table-container">
      <h2>Órdenes</h2>
      <button className="add" onClick={handleAdd}>
        Agregar
      </button>
      <table>
        <thead>
          <tr>
            <th>Cliente ID</th>
            <th>Cliente Nombre</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Monto total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.user ? order.user.id : "-"}</td>
              <td>{order.user ? order.user.name : "-"}</td>
              <td>
                {order.orderDetails &&
                order.orderDetails.length > 0 &&
                order.orderDetails[0].product
                  ? order.orderDetails[0].product.name
                  : "-"}
              </td>
              <td>
                {order.orderDetails && order.orderDetails.length > 0
                  ? order.orderDetails[0].quantity
                  : "-"}
              </td>
              <td>{order.total_amount ?? "-"}</td>
              <td>{order.status ?? "-"}</td>
              <td>
                <div className="button-container">
                  <button className="edit" onClick={() => handleEdit(order)}>
                    Editar
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(order.id)}
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
        <h2>{currentOrder.id ? "Editar" : "Agregar"} Orden</h2>
        <form>
          <div>
            <label>Cliente</label>
            <select
              value={currentOrder.user_id}
              onChange={(e) =>
                setCurrentOrder({ ...currentOrder, user_id: e.target.value })
              }
            >
              <option value="">Seleccione un cliente</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          {currentOrder.order_details &&
            currentOrder.order_details.length > 0 && (
              <div>
                <label>Producto</label>
                <select
                  value={currentOrder.order_details[0].product_id}
                  onChange={(e) =>
                    setCurrentOrder({
                      ...currentOrder,
                      order_details: [
                        {
                          ...currentOrder.order_details[0],
                          product_id: e.target.value,
                        },
                      ],
                    })
                  }
                >
                  <option value="">Seleccione un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          {currentOrder.order_details &&
            currentOrder.order_details.length > 0 && (
              <div>
                <label>Cantidad</label>
                <input
                  type="number"
                  value={currentOrder.order_details[0].quantity}
                  onChange={(e) =>
                    setCurrentOrder({
                      ...currentOrder,
                      order_details: [
                        {
                          ...currentOrder.order_details[0],
                          quantity: parseInt(e.target.value),
                        },
                      ],
                    })
                  }
                />
              </div>
            )}
          <div>
            <label>Estado</label>
            <select
              value={currentOrder.status}
              onChange={(e) =>
                setCurrentOrder({ ...currentOrder, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
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

export default OrdersPage;
