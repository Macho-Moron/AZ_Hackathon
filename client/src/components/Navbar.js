import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Text-to-Learn
          </Link>
        </Typography>

        {/* Links available to everyone */}
        <Button color="inherit" component={Link} to="/">Home</Button>

        {/* Links available only when logged in */}
        {isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/create">Create Course</Button>
            <Button color="inherit" component={Link} to="/courses">My Courses</Button>
          </>
        )}

        {/* Conditional Login/Logout Button */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={user.picture} alt={user.name} sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography sx={{ mr: 2 }}>{user.name}</Typography>
            <Button 
              color="inherit" 
              variant="outlined"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Button 
            color="inherit" 
            variant="outlined"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;