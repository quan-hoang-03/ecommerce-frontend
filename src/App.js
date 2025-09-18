import './App.css';
import Cart from './customer/components/Cart/Cart.jsx';
import Checkout from './customer/components/Checkout/Checkout.jsx';
import Footer from './customer/components/Footer/Footer.jsx';
import Navigation from './customer/components/Navigation/Navigation.jsx';
import Order from './customer/components/Order/Order.jsx';
import Product from './customer/components/Product/Product.jsx';
import ProductDetails from './customer/components/ProductDetails/ProductDetails.jsx';
import HomePage from './customer/pages/HomePage/HomePage.jsx';
function App() {
  return (
    <div className="">
      <Navigation />
      <div>
        {/* <HomePage /> */}
        {/* <Product/> */}
        {/* <ProductDetails/> */}
        {/* <Cart /> */}
        {/* <Checkout /> */}
        <Order />
      </div>
        <Footer />
    </div>
  );
}

export default App;
