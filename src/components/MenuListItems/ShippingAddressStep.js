import React, { useState, useEffect } from 'react';
import './shipping.css';
import { FormControl, InputLabel, MenuItem, Select, Button } from '@material-ui/core';
import axios from 'axios';

function ShippingDetailsPage({ selectedAddressDetails, onAddressSelection, onSaveNewAddress, onNext }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedExistingAddress, setSelectedExistingAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    contactNumber: '',
    city: '',
    landmark: '',
    street: '',
    state: '',
    zipcode: '',
  });

  const [isNextDisabled, setIsNextDisabled] = useState(true); // Initially, disable the "Next" button

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    // Check if all required fields are filled
    const requiredFieldsFilled = Object.values(newAddress).every((value) => value !== '');
    setIsNextDisabled(!requiredFieldsFilled); // Disable "Next" if any required field is empty
  }, [newAddress]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/addresses', {
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        setAddresses(response.data);
      } else {
        console.log('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleExistingAddressSelection = async (event) => {
    const selectedAddressId = event.target.value;
    setSelectedExistingAddress(selectedAddressId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/addresses/${selectedAddressId}`, {
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const addressDetails = response.data;
        setNewAddress(addressDetails);

        // Update the selected address details state
        onAddressSelection(addressDetails);
      } else {
        console.log('Failed to fetch address details');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleNewAddressChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleSaveNewAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/addresses', {
        ...newAddress,
        user: 'USER', // You may need to replace this with the actual user information
      }, {
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        // Extract the address details from the response
        const savedAddress = response.data;

        // Call the onSaveNewAddress function and pass the address details
        onSaveNewAddress(savedAddress);

        // Update the selected address details state
        onAddressSelection(savedAddress);

        // Trigger the onNext function to enable navigation to the next step
        onNext();
      } else {
        console.log('Failed to save a new address');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="shipping-container">
      <h2>Shipping Address</h2>
      <FormControl fullWidth>
        <InputLabel>Select Existing Address</InputLabel>
        <Select value={selectedExistingAddress} onChange={handleExistingAddressSelection}>
          {addresses.map((address) => (
            <MenuItem key={address.id} value={address.id}>
              {address.addressLine}, {address.city}, {address.state}, {address.zipCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={newAddress.name}
          onChange={handleNewAddressChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Contact Number"
          name="contactNumber"
          value={newAddress.contactNumber}
          onChange={handleNewAddressChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="City"
          name="city"
          value={newAddress.city}
          onChange={handleNewAddressChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Landmark"
          name="landmark"
          value={newAddress.landmark}
          onChange={handleNewAddressChange}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Street"
          name="street"
          value={newAddress.street}
          onChange={handleNewAddressChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="State"
          name="state"
          value={newAddress.state}
          onChange={handleNewAddressChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Zip Code"
          name="zipcode"
          value={newAddress.zipcode}
          onChange={handleNewAddressChange}
          required
        />
      </div>
      <div className="button-container">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveNewAddress}
          disabled={isNextDisabled} // Disable "Next" if required fields are not filled
        >
          Save New Address
        </Button>
      </div>
    </div>
  );
}

export default ShippingDetailsPage;
