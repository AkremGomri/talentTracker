import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import localforage from 'localforage';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useDispatch } from 'react-redux';
import Iconify from '../../../components/iconify';
import { selectMyRole } from '../../../redux/utils/myProfile';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const handleClick = async () => {
    
    const data = { email, password };
    console.log("email: ",email);
    console.log("password: ",password);
    try{
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, data);
      localforage.setItem('token', response.data.token);
      localforage.setItem('myRole', response.data.role);
      localforage.setItem('userId', response.data.userId);
      localforage.setItem('fullName', response.data.fullName);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.log("errro: ",error);
      if (error.response?.data) {
        alert(error.response.data.message);
        setError(error.response.data.message);
      } else {
        alert("Check your internet connection")
        setError("Check your internet connection");
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" type="email" label="Email address" onClick={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onClick={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
