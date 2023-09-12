import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CardActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetailsPage() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [originalData, setOriginalData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0); // Initialize with the index of the "All" category
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to the login page if not logged in
      navigate('/login');
      return;
    }

    // Fetch product categories and products
    fetchCategories();
    fetchProductDetails();

    // Check the user's role to determine if they are an admin
    const userRoles = JSON.parse(localStorage.getItem('userRoles'));
    setIsAdmin(userRoles && userRoles.includes('ADMIN'));
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/products/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.log('Failed to fetch categories');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const categoryParam = selectedCategory ? `category=${selectedCategory}&` : '';
      const sortParam = sortOption !== 'default' ? `sort=${sortOption}` : '';

      const response = await fetch(`http://localhost:8080/api/products?${categoryParam}${sortParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json', // Include the bearer token in the headers
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOriginalData(data);
        setData(data);
      } else {
        console.log('Failed to fetch product details');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleCategoryChange = (event, newCategoryIndex) => {
    // Determine the selected category based on the index
    const newCategory = newCategoryIndex === 0 ? '' : categories[newCategoryIndex - 1]; // Subtract 1 to account for the "All" category

    const newData =
      newCategory === ''
        ? originalData
        : originalData.filter((item) => item.category === newCategory);

    setCategoryFilter(newCategory);
    setSelectedCategory(newCategory); // Set the selected category
    setSelectedCategoryIndex(newCategoryIndex); // Set the selected category index

    // Apply sorting to the filtered data
    const sortedData = sortData(newData, sortOption);
    setData(sortedData);
  };

  const sortData = (data, keyString) => {
    const temp = [...data];
    if (keyString !== 'default') {
      // Update the sorting logic based on the selected option
      temp.sort((a, b) => {
        if (keyString === 'priceHighToLow') {
          return b.price - a.price;
        } else if (keyString === 'priceLowToHigh') {
          return a.price - b.price;
        }
        return 0; // Default case
      });
    }
    return temp;
  };

  const handleSortChange = (event) => {
    const keyString = event.target.value;

    // Apply sorting to the filtered data
    const sortedData = sortData(data, keyString);
    setData(sortedData);
    setSortOption(keyString);
  };

  const handleBuyButtonClick = (productId) => {
    navigate(`/CreateOrderPage/${productId}`);
  };

  const handleEditButtonClick = (productId) => {
    navigate(`/ModifyProduct/${productId}`);
  };

  const handleDeleteButtonClick = async (productId) => {
    // Display a confirm dialog before deleting
    const isConfirmed = window.confirm('Are you sure you want to delete this product?');

    if (!isConfirmed) {
      return; // Do nothing if not confirmed
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Product deleted successfully, update the UI
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);

        // Display a toast message
        toast.success('Product deleted successfully', {
          position: 'top-right',
          autoClose: 3000, // 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.log('Failed to delete product');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center">
        <ToggleButtonGroup
          value={selectedCategoryIndex}
          exclusive
          onChange={handleCategoryChange}
          aria-label="Category"
        >
          <ToggleButton value={0} aria-label="All">
            All
          </ToggleButton>
          {categories.map((category, index) => (
            <ToggleButton
              key={category}
              value={index + 1} // Add 1 to index to match the category
              aria-label={category}
              style={{
                backgroundColor:
                  selectedCategoryIndex === index + 1 ? 'lightblue' : 'inherit', // Apply different background color for selected category
              }}
            >
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <FormControl variant="outlined" style={{ width: '17%' }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          label="Sort By"
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="priceHighToLow">Price High to Low</MenuItem>
          <MenuItem value="priceLowToHigh">Price Low to High</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </FormControl>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {data.map(product => (
          <Card key={product.id} style={{ width: '30%', marginBottom: '20px', position: 'relative', height: '100%' }}>
            <CardMedia component="img" height="300" image={product.imageUrl || 'alternate-text-for-accessibility'} alt={product.name} />
            <CardContent>
              <Typography variant="h5">{product.name}</Typography>
              <Typography>{product.description}</Typography>
              <Typography variant="h6">{`Price: Rs ${product.price.toFixed(2)}`}</Typography> {/* Display the price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                {isAdmin && (
                  <div style={{ display: 'inline-block' }}>
                    <IconButton onClick={() => handleEditButtonClick(product.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteButtonClick(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )}
              </div>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => handleBuyButtonClick(product.id)}>Buy</Button>
            </CardActions>
          </Card>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default ProductDetailsPage;
