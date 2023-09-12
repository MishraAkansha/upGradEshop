import React from 'react';
import { AppBar, Box, IconButton, Toolbar, Link, Button, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: 0,
  flex: 1,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const location = useLocation();

  // Check if the user is logged in (i.e., authentication token exists in local storage)
  const isAuthenticated = !!localStorage.getItem('token');

  // Check if the user has the ADMIN role
  const userRoles = JSON.parse(localStorage.getItem('userRoles'));
  const isAdmin = userRoles && userRoles.includes('ADMIN');

  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem('token');

    // Redirect to the login page
    window.location.href = '/login';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <ShoppingCartIcon />
          </IconButton>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Link
                component={RouterLink}
                to="/products"
                color="inherit"
                underline="none"
              >
                upGrad E-Shop
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Grid>
            <Grid item xs={12} sm={6} md={4} align="right">
              {isAuthenticated ? (
                // User is authenticated, show Logout button
                <>
                  <Link component={RouterLink} to="/products" color="inherit" underline="always">
                    Home
                  </Link>
                  {isAdmin && (
                    <Link component={RouterLink} to="/AddProductPage" color="inherit" underline="always" sx={{ marginLeft: 5 }}>
                      Add Product
                    </Link>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    sx={{ borderRadius: '10px', backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                // User is not authenticated, show Login and Sign Up links with space
                <>
                  <Link component={RouterLink} to="/login" color="inherit" underline="always">
                    Login
                  </Link>
                  <span style={{ marginRight: '10px' }}></span>
                  <Link component={RouterLink} to="/signup" color="inherit" underline="always">
                    Sign Up
                  </Link>
                </>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
