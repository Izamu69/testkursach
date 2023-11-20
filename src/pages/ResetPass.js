import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { PasswordField } from '../components/sections/PasswordField';
import Footer from '../components/sections/Footer';

const ResetPass = () => {
  return (
    <Stack>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading>Reset your password</Heading>
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
                <PasswordField data="New" />
                <PasswordField data="Confirm" />
              </Stack>
              <Stack spacing="6">
                <Button colorScheme='green'>Reset password</Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Stack>
  );
};

export default ResetPass;