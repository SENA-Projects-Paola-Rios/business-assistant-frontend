import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Layout from './layouts/Layout';
import authService from './services/authService';
import Products from './pages/Products';
import Lots from './pages/Lots';
import Sales from './pages/Sales';
import SaleDetails from './pages/SaleDetails';

function PrivateRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute>
            <Layout>
              <Users />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/categories" element={
          <PrivateRoute>
            <Layout>
              <Categories />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/products" element={
          <PrivateRoute>
            <Layout>
              <Products />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/lots" element={
          <PrivateRoute>
            <Layout>
              <Lots />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/sales" element={
          <PrivateRoute>
            <Layout>
              <Sales />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/sale-details" element={
          <PrivateRoute>
            <Layout>
              <SaleDetails />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/login" element={
          <PrivateRoute>
            <Layout>
              <Login />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
