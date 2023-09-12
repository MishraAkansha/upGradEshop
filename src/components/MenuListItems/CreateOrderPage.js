import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Container, Typography, Grid, AppBar, Toolbar } from '@material-ui/core';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductDetailsPage from './ProductDetailsPage';
import ShippingDetailsPage from './ShippingAddressStep';
import ReviewAndConfirmStep from './ReviewAndConfirmStep';

function CreateOrderPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    productId,
    quantity,
    selectedAddressId: initialAddressId,
    productName,
    category,
    price,
  } = location.state || {};

  useEffect(() => {
    if (initialAddressId) {
      fetchAddressDetails(initialAddressId);
    }

    if (activeStep === 1) {
      navigate(`/CreateOrderPage/${productId}`);
    }
  }, [initialAddressId, activeStep, navigate, productId]);

  useEffect(() => {
    if (productId && activeStep === 1) {
      navigate(`/CreateOrderPage/${productId}`);
    }
  }, [productId, activeStep, navigate]);

  useEffect(() => {
    // Retrieve product details from localStorage
    const storedProductDetails = localStorage.getItem('productDetails');
    if (storedProductDetails) {
      setProductDetails(JSON.parse(storedProductDetails));
    }
  }, []);

  const fetchAddressDetails = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/addresses/${addressId}`, {
        headers: {
          'x-auth-token': token,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const addressDetails = await response.json();
        setSelectedAddressDetails(addressDetails);
      } else {
        console.log('Failed to fetch address details');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      // If you're on the first step, navigate to the products page
      navigate('/products');
    } else if (activeStep === 2) {
      // If you're on the second step, navigate to the ProductDetailsPage
      navigate(`/products`);
    } else {
      // Otherwise, just go back one step
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const steps = ['Product Details', 'Shipping Details', 'Review and Confirm'];

  return (
    <Container>
      <AppBar position="static" color="primary"> {/* Set the color attribute to "primary" */}
        
      </AppBar>
      <Typography>Order</Typography>
      <Stepper activeStep={activeStep - 1} style={{ padding: '10px' }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <div>
          {activeStep === 1 ? (
            <ProductDetailsPage
              productId={productId}
              onPlaceOrder={() => handleNext()}
              setProductDetails={setProductDetails}
            />
          ) : activeStep === 2 ? (
            <ShippingDetailsPage
              selectedAddressDetails={selectedAddressDetails}
              onAddressSelection={(addressDetails) => setSelectedAddressDetails(addressDetails)}
              onBack={handleBack}
              onNext={handleNext}
            />
          ) : (
            <ReviewAndConfirmStep
              selectedAddressDetails={selectedAddressDetails}
              productName={productName}
              category={category}
              price={price}
              quantity={quantity}
              productId={productId}
            />
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button enabled={activeStep === 1} onClick={handleBack}>
                Back
              </Button>
            </Grid>
            {activeStep !== 3 && (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </Container>
  );
}

export default CreateOrderPage;
