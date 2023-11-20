import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { PasswordField } from '../components/sections/PasswordField';
import DarkMode from '../components/sections/DarkMode';
import Footer from '../components/sections/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/AuthContext';
import API_ENDPOINT from '../config';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleLogin = async () => {
    try {
      if (!formData.email || !formData.password) {
        setErrors({
          email: !formData.email ? 'Email is required' : '',
          password: !formData.password ? 'Password is required' : '',
        });
        return;
      }

      const response = await axios.post(`${API_ENDPOINT}/users/login`, formData);
      console.log(response.data);

      if (response.data.message === 'User logged in successfully') {
        login();
        localStorage.setItem('userId', response.data.ID);
        localStorage.setItem('isAdmin', response.data.isAdmin);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrors({ email: 'Invalid credentials', password: 'Invalid credentials' });
    }
  };

  return (
    <Stack>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading>Log in to your account</Heading>
              <Text>
                Don't have an account? <Link color='green.500' href="/signup">Sign up</Link>
              </Text>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={{ base: 'transparent', sm: 'bg.surface' }}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input id="email" type="email" onChange={handleInputChange} />
                  {errors.email && <Text color="red.500">{errors.email}</Text>}
                </FormControl>
                <PasswordField pass="password" onChange={handleInputChange} />
                {errors.password && <Text color="red.500">{errors.password}</Text>}
              </Stack>
              <DarkMode />
              <Stack spacing="6">
                <Button colorScheme='green' onClick={handleLogin}>Sign in</Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Stack>
  );
};

export default Login;
