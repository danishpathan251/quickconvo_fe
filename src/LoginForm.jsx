import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, Typography, Box } from '@mui/material';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = ({setMenuSection}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your login logic here
    console.log('Logging in with:', email, password);
    if(password && (password == 8111 || password == 8112)) {
      setMenuSection('chat');

    }else{
      setMenuSection('login')
    }
  };

  return (
    <Box sx={{display:'flex',   alignItems: 'center',
      justifyContent: 'center',height:'75vh'}}> 
    <Box 
      sx={{ 
        maxWidth: 400, 
        width: '100%', 
        margin: 'auto', 
        padding: 3, 
        borderRadius: 2, 
        boxShadow: 3, 
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Enter Your Code 
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {/* Email Field */}
        {/* <Box mb={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}

        {/* Password Field */}
        <Box mb={2}>
          <TextField
            label="Code"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Submit Button */}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </form>
    </Box>
    </Box>
  );
};

export default LoginForm;
