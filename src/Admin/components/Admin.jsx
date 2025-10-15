import { CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { Box } from "@mui/material";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/Inbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const menu = [
  { name: "Dashboard", link: "/admin", icon: <DashboardIcon /> },
  { name: "Products", link: "/admin/products",icon:<InventoryIcon/> },
  { name: "Customers", link: "/admin/customers", icon: <PersonIcon /> },
  { name: "Orders", link: "/admin/orders", icon: <ShoppingCartIcon /> },
  { name: "AddProduct", link: "/admin/product/create",icon:<CategoryIcon/>}
  // {name:"Categories",link:"/admin/categories"},
];

const Admin = () => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const [sideBarVisible,setSideBarVisible] = useState(isLargeScreen);
    const navigate = useNavigate();
    const drawer = (
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {isLargeScreen && <Toolbar />}
        <List>
          {menu.map((item, index) => (
            <ListItem
              key={item.name}
              disablePadding
              onClick={() => navigate(item.path)}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );
  return (
    <div>
      <Box sx={{ display: `${isLargeScreen} ? "flex" : "block"` }}>
        <CssBaseline />
        <Drawer
         variant='permanent'
        >
          {drawer}
        </Drawer>
      </Box>
    </div>
  );
}

export default Admin