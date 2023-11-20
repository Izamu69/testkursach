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

const Register = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleRegister = async () => {
    try {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setErrors({
          email: !formData.email ? 'Email is required' : '',
          password: !formData.password ? 'Password is required' : '',
          confirmPassword: !formData.confirmPassword ? 'Confirm Password is required' : '',
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrors({
          confirmPassword: 'Passwords do not match',
        });
        return;
      }

      const response = await axios.post(`${API_ENDPOINT}/users/register`, formData);
      console.log(response.data);

      if (response.data.message === 'User registered successfully') {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <Stack>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading>Create a new account</Heading>
              <Text>
                Already have an account? <Link color='green.500' href="/login">Sign in</Link>
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
                <PasswordField pass="confirmPassword" data="Confirm " onChange={handleInputChange} />
                {errors.confirmPassword && <Text color="red.500">{errors.confirmPassword}</Text>}
              </Stack>
              <DarkMode />
              <Stack spacing="6">
                <Button colorScheme='green' onClick={handleRegister}>Sign up</Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Stack>
  );
};

export default Register;
