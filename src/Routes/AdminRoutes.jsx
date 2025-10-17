import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from '../Admin/Admin'
import AdminLogin from '../Admin/AdminLogin';
import PrivateAdminRoute from '../Admin/components/PrivateAdminRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/*"
        element={
          <PrivateAdminRoute>
            <Admin />
          </PrivateAdminRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes