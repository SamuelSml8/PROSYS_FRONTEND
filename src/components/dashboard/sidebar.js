import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { logout } from "../../utils/auth";
import { styled } from "@mui/system";

const drawerWidth = 250;

const DrawerPaper = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#202020",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px",
  backgroundColor: "#202020",
}));

const DrawerTitle = styled(Typography)(({ theme }) => ({
  fontSize: "3.5rem",
  fontWeight: "bold",
  color: "#ffffff",
  fontFamily: '"Raleway", sans-serif',
  textTransform: "uppercase",
}));

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const getItemStyles = (path) => {
    const isActive = location.pathname === path;
    return {
      padding: "10px 20px",
      backgroundColor: isActive ? "#ffffff" : "inherit",
      color: isActive ? "#000000" : "#f9f9f9",
      borderRadius: isActive ? "50px 0 0 50px" : "0",
      "&:hover": {
        backgroundColor: isActive ? "#ffffff" : "#e23d40",
        color: isActive ? "#000000" : "#ffffff",
        borderRadius: "50px 0 0 50px",
      },
    };
  };

  const getIconStyles = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? "#000000" : "#ffffff",
      minWidth: "56px",
    };
  };

  const getTextStyles = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? "#000000" : "#ffffff",
      "& .MuiTypography-root": {
        fontSize: "1.4rem",
      },
    };
  };

  return (
    <DrawerPaper variant="permanent">
      <Box>
        <DrawerHeader>
          <DrawerTitle variant="h4">Prosys</DrawerTitle>
        </DrawerHeader>
        <List>
          <ListItem button component={Link} to="/" sx={getItemStyles("/")}>
            <ListItemIcon sx={getIconStyles("/")}>
              <HomeIcon style={{ fontSize: "2.8rem" }} />
            </ListItemIcon>
            <ListItemText primary="Inicio" sx={getTextStyles("/")} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/products-admin"
            sx={getItemStyles("/products-admin")}
          >
            <ListItemIcon sx={getIconStyles("/products-admin")}>
              <InventoryIcon style={{ fontSize: "2.8rem" }} />
            </ListItemIcon>
            <ListItemText
              primary="Productos"
              sx={getTextStyles("/products-admin")}
            />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/users"
            sx={getItemStyles("/users")}
          >
            <ListItemIcon sx={getIconStyles("/users")}>
              <PeopleIcon style={{ fontSize: "2.8rem" }} />
            </ListItemIcon>
            <ListItemText primary="Usuarios" sx={getTextStyles("/users")} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/categories"
            sx={getItemStyles("/categories")}
          >
            <ListItemIcon sx={getIconStyles("/categories")}>
              <CategoryIcon style={{ fontSize: "2.8rem" }} />
            </ListItemIcon>
            <ListItemText
              primary="Categorías"
              sx={getTextStyles("/categories")}
            />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/orders"
            sx={getItemStyles("/orders")}
          >
            <ListItemIcon sx={getIconStyles("/orders")}>
              <ShoppingCartIcon style={{ fontSize: "2.8rem" }} />
            </ListItemIcon>
            <ListItemText primary="Órdenes" sx={getTextStyles("/orders")} />
          </ListItem>
        </List>
      </Box>
      <Box>
        <List>
          <ListItem button onClick={handleLogout} sx={getItemStyles("/logout")}>
            <ListItemIcon sx={getIconStyles("/logout")}>
              <ExitToAppIcon style={{ fontSize: "2.8rem" }} />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar sesión"
              sx={getTextStyles("/logout")}
            />
          </ListItem>
        </List>
      </Box>
    </DrawerPaper>
  );
};

export default Sidebar;
