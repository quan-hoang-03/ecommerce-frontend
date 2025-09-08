import './App.css';
import Navigation from './customer/components/Navigation/Navigation.jsx';
import HomePage from './customer/pages/HomePage/HomePage.jsx';
function App() {
  return (
    <div className=''>
      <Navigation />
      <div>
        <HomePage/>
      </div>
    </div>
  );
}

export default App;
