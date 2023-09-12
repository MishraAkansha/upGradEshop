import React, { useEffect, useState } from 'react';
import { Typography, Paper, Grid, makeStyles, Button, Box } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(5), // Adjust the padding as needed
    marginBottom: theme.spacing(2),
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Adjust the width as needed
    gap: theme.spacing(2),
  },
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
}));

function ReviewAndConfirmStep({
  selectedAddressDetails,
  onConfirmOrder,
  productId,
  productName,
  category,
  price,
  quantity,
}) {
  const classes = useStyles();
  const navigate = useNavigate(); // Initialize the navigate function

  // State to store product details retrieved from localStorage
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    // Retrieve product details from localStorage
    const storedProductDetails = localStorage.getItem('productDetails');
    if (storedProductDetails) {
      setProductDetails(JSON.parse(storedProductDetails));
    }
  }, []);

  const handleConfirmOrder = async () => {
    try {
      if (productDetails && selectedAddressDetails) {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:8080/api/orders', {
          method: 'POST',
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            quantity: productDetails.quantity,
            product: productDetails.id,
            address: selectedAddressDetails.id,
          }),
        });
        
        if (response.ok) {
          // Order created successfully, display a toast message
          toast.success('Order created successfully', {
            position: 'top-right',
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Redirect to the products page
          navigate('/products');
        } else {
          console.error('Failed to create the order.');
          console.log(productDetails.id);
          console.log(selectedAddressDetails.id);
          console.log(quantity);
          // You can add additional error handling here, such as displaying an error message to the user.
        }
      } else {
        console.error('Product details or selected address details are missing.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // You can add additional error handling here, such as displaying an error message to the user.
    }
  };

  return (
    <div>
      <h2>Order Details</h2>
      <div className={classes.centeredContainer}>
        <Box className={classes.cardContainer}>
          <Paper className={classes.paper}>
            {productDetails && (
              <>
                <Typography variant="h6">Product:</Typography>
                <Typography>Name: {productDetails.name}</Typography>
                <Typography>Category: {productDetails.category}</Typography>
                <Typography>Price: Rs {productDetails.price}</Typography>
                <Typography>Quantity: {productDetails.quantity}</Typography>
              </>
            )}
          </Paper>

          <Paper className={classes.paper}>
            {selectedAddressDetails && (
              <>
                <Typography variant="h6">Shipping Address:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>Name: {selectedAddressDetails.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Contact Number: {selectedAddressDetails.contactNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>City: {selectedAddressDetails.city}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>State: {selectedAddressDetails.state}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Zip Code: {selectedAddressDetails.zipcode}</Typography>
                  </Grid>
                  {selectedAddressDetails.landmark && (
                    <Grid item xs={12} sm={6}>
                      <Typography>Landmark: {selectedAddressDetails.landmark}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography>Street: {selectedAddressDetails.street}</Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Box>
      </div>

      <Button variant="contained" color="primary" onClick={handleConfirmOrder}>
        Confirm Order
      </Button>
    </div>
  );
}

export default ReviewAndConfirmStep;
