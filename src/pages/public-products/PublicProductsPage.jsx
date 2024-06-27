import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, findProductByName } from "../../api";
import { Navigation } from "../../components/navigation";
import { Contact } from "../../components/contact";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import JsonData from "../../data/data.json";
import "../../styles/PublicProductsPage.css";

const PublicProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contactData, setContactData] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    setContactData(JsonData);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = searchTerm
          ? await findProductByName(searchTerm, page, limit)
          : await getAllProducts(page, limit);
        const formattedProducts = response.data.data.products.map(
          (product) => ({
            ...product,
            name: product.name.charAt(0).toUpperCase() + product.name.slice(1),
          })
        );
        setProducts(formattedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [searchTerm, page, limit]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <Navigation />
      <div className="products-page">
        <h2 className="page-title">Productos</h2>
        <div className="search-bar">
          <InputBase
            className="MuiInputBase-root"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon className="search-icon" />
              </InputAdornment>
            }
          />
        </div>
        <div className="products-container">
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/products/${product.id}`}>
                  <img
                    src="https://res.cloudinary.com/dkiwegaku/image/upload/v1718834238/npzpskylxyusk2z9izag.jpg"
                    alt={product.name}
                  />
                  <div className="card-content">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p className="product-price">COP {product.price}</p>
                  </div>
                  <button className="order-product">Ordenar</button>
                </Link>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Anterior
            </button>
            <span>Página {page}</span>
            <button onClick={() => setPage(page + 1)}>Siguiente</button>
          </div>
        </div>
      </div>
      <Contact data={contactData.Contact} />
    </div>
  );
};

export default PublicProductsPage;
