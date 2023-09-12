import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupForm from './components/MenuListItems/signup';
import LoginForm from './components/MenuListItems/login';
import Navbar from './components/navigation/Navbar';
import Products from './components/MenuListItems/products';
import CreateOrderPage from './components/MenuListItems/CreateOrderPage';
import ShippingAddressStep from './components/MenuListItems/ShippingAddressStep';
import ReviewAndConfirmStep from './components/MenuListItems/ReviewAndConfirmStep';
import ProductDetailsPage from './components/MenuListItems/ProductDetailsPage';
import AddProductPage from './components/MenuListItems/AddProductPage';
import ModifyProduct from './components/MenuListItems/ModifyProduct';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="/CreateOrderPage/:id" element={<CreateOrderPage />} />
        <Route path="/ShippingAddressStep" element={<ShippingAddressStep />} />
        <Route path="/ReviewAndConfirmStep" element={<ReviewAndConfirmStep />} />
        <Route path="/CreateOrderPage" element={<CreateOrderPage />} />
        <Route path="/ProductDetailsPage/:id" element={<ProductDetailsPage />} />
        <Route path="/AddProductPage" element={<AddProductPage />} />
        <Route path="/ModifyProduct/:id" element={<ModifyProduct />} />
      </Routes>
    
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
}

export default App;

