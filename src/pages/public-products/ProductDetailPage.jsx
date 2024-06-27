import { Navigation } from "../../components/navigation";
import { Contact } from "../../components/contact";
import JsonData from "../../data/data.json";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, createOrder } from "../../api";
import { getUserFromToken } from "../../utils/auth";
import Swal from "sweetalert2";
import "../../styles/ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [contactData, setContactData] = useState({});

  useEffect(() => {
    setContactData(JsonData);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError(err.message);
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleOrder = async () => {
    const user = getUserFromToken();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const orderData = {
        user_id: user.sub,
        order_details: [
          {
            product_id: product.id,
            quantity: quantity,
          },
        ],
      };
      const nameFirstUpper =
        user.name.charAt(0).toUpperCase() + user.name.slice(1);
      await createOrder(orderData);
      Swal.fire({
        title: "Orden creada correctamente",
        text: `¡Gracias por su pedido ${nameFirstUpper}! Nos comunicaremos con usted lo más pronto posible.`,
        icon: "success",
        confirmButtonText: "Volver",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm",
        },
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      console.error("Error creating order:", err.message);
      Swal.fire({
        title: "Error",
        text: "Error creando la orden: " + err.message,
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm",
        },
      });
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <Navigation />
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-image">
            <img
              src="https://res.cloudinary.com/dkiwegaku/image/upload/v1718834238/npzpskylxyusk2z9izag.jpg"
              alt={product.name}
            />
          </div>
          <div className="product-info">
            <h1>
              {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
            </h1>
            <p className="category">Categoría: {product.category.name}</p>
            <div className="product-description">
              <p>
                Nuestro producto{" "}
                {product.name.charAt(0).toUpperCase() + product.name.slice(1)}{" "}
                es la mejor opción en el mercado actual. No dude en hacer su
                pedido ahora, nos comunicaremos con usted y le brindaremos toda
                la información necesaria.
              </p>
            </div>
            <p className="price">COP {product.price}</p>
            <p className="stock"> Unidades disponibles: {product.stock}</p>
            <div className="quantity">
              <button onClick={handleDecrease}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
            <button className="order-button" onClick={handleOrder}>
              Hacer pedido
            </button>
          </div>
        </div>
      </div>
      <Contact data={contactData.Contact} />
    </div>
  );
};

export default ProductDetailPage;
