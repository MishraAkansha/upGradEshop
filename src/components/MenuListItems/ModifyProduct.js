import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddProductPage.css'; // Import your CSS file

function ModifyProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: '', // Initialize with empty values
    name: '',
    description: '',
    price: '',
    availableItems: '',
    imageUrl: '',
    category: '',
    manufacturer: '',
  });

  useEffect(() => {
    // Fetch the product details based on the `id` parameter
    fetchProductDetails(id);
  }, [id]);

  const fetchProductDetails = async (productId) => {
    try {
      // Make an API call to fetch product details based on `productId`
      const token = localStorage.getItem('token'); // Get the token from local storage
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const productDetails = await response.json();
        setProduct(productDetails);
      } else {
        console.log('Failed to fetch product details');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSaveButtonClick = async () => {
    try {
      // Make an API call to update the product details based on the `id`
      const token = localStorage.getItem('token'); // Get the token from local storage
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'PUT', // Use PUT for updating the product
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product), // Send the updated product data
      });

      if (response.ok) {
        // Product updated successfully
        toast.success('Product modified successfully', {
          position: 'top-right',
          autoClose: 3000, // 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/products'); // Redirect to the products page after updating
      } else {
        console.log('Failed to update product');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Container>
      <div className="add-product-container">
        <h2 className="add-product-heading">Modify Product</h2>
        <form>
          <div className="form-group">
            <TextField
              name="name"
              label="Name"
              value={product.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <TextField
              name="description"
              label="Description"
              value={product.description}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <TextField
              name="price"
              label="Price"
              value={product.price}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <TextField
              name="availableItems"
              label="Available Items"
              value={product.availableItems}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <TextField
              name="imageUrl"
              label="Image URL"
              value={product.imageUrl}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <TextField
              name="category"
              label="Category"
              value={product.category}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <TextField
              name="manufacturer"
              label="Manufacturer"
              value={product.manufacturer}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </div>
          <Button variant="contained" onClick={handleSaveButtonClick} fullWidth>
            Modify
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default ModifyProduct;
