import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, CardMedia, Typography, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProduct(data);

        // Store product details in local storage
        localStorage.setItem('productDetails', JSON.stringify({
          id: data.id,
          name: data.name,
          category: data.category,
          quantity: 1, // Initialize with a default quantity of 1
          price: data.price,
        }));

        
        navigate(`/CreateOrderPage/${data.id}`);
      } else {
        console.log('Failed to fetch product details');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Card style={{ width: 'calc(100% /4)', marginTop: '1px', marginBottom: '1px' }}> 
        <CardMedia
          component="img"
          height="260"
          image={product.imageUrl || 'alternate-text-for-accessibility'}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h6">{product.name}</Typography>
          <Typography>Category: {product.category}</Typography>
          <Typography>Price: Rs {product.price}</Typography>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProductDetailsPage;
