import './App.css';
import Footer from './customer/components/Footer/Footer.jsx';
import Navigation from './customer/components/Navigation/Navigation.jsx';
import Product from './customer/components/Product/Product.jsx';
import HomePage from './customer/pages/HomePage/HomePage.jsx';
function App() {
  return (
    <div className="">
      <Navigation />
      <div>
        {/* <HomePage /> */}
        <Product/>
      </div>
        <Footer />
    </div>
  );
}

export default App;
