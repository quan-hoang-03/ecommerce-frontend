import { Route, Routes } from 'react-router-dom';
import './App.css';
import CustomerRoutes from './Routes/CustomerRoutes.jsx';
import AdminRoutes from './Routes/AdminRoutes.jsx';
function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
