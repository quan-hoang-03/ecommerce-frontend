import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../customer/pages/HomePage/HomePage'
import Cart from '../customer/components/Cart/Cart';
import Navigation from '../customer/components/Navigation/Navigation';
import Footer from '../customer/components/Footer/Footer';
import Product from '../customer/components/Product/Product';
import ProductDetails from '../customer/components/ProductDetails/ProductDetails';
import Checkout from '../customer/components/Checkout/Checkout';
import OrderDetails from '../customer/components/Order/OrderDetails';
import OrdersPage from '../customer/components/Order/Order';
import UserProfile from '../customer/components/UserProfile/UserProfile';
import CustomerChat from '../customer/components/Chat/CustomerChat';

const CustomerRoutes = () => {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <Routes>
        <Route path='/login' element={<HomePage />}></Route>
        <Route path='/register' element={<HomePage />}></Route>

        
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/:lavelOne/:lavelTwo/:lavelThree" element={<Product />}></Route>
        <Route path="/product/:productId" element={<ProductDetails />}></Route>
        <Route path="/checkout" element={<Checkout />} ></Route>
        <Route path="/account/profile" element={<UserProfile />} ></Route>
        <Route path="/account/order" element={<OrdersPage />} ></Route>
        <Route path="/account/order/:orderId" element={<OrderDetails />} ></Route>
      </Routes>
      <div>
        <Footer />
      </div>
      <CustomerChat />
    </div>
  );
}

export default CustomerRoutes