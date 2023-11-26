import React, { useState } from 'react';
import { Container, Input, Button, FormControl, FormLabel } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import API_ENDPOINT from '../../config';
import MainLayout from '../layouts/MainLayout';

const CertificateGenerator = () => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [certificateUrl, setCertificateUrl] = useState(null);

  const handleGenerateCertificate = async () => {
    try {
      setLoading(true);
  
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
  
      const response = await fetch(`${API_ENDPOINT}/categories/generateCertificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: fullName, categoryId: id }),
      });
  
      if (response.ok) {
        const filename = 'certificate.pdf';
  
        const blob = new Blob([await response.arrayBuffer()], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
  
        setCertificateUrl(url);
  
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        setFullName('');
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      setError('An error occurred while generating the certificate');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <MainLayout>
    <Container maxWidth="400px" mx="auto" my="unset" p={10}>
      <FormControl>
        <FormLabel htmlFor="fullName">Full Name</FormLabel>
        <Input
          type="text"
          id="fullName"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </FormControl>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Button
        onClick={handleGenerateCertificate}
        isLoading={loading}
        rounded={'none'}
        w={'full'}
        mt={8}
        size={'lg'}
        py={'7'}
        textTransform={'uppercase'}
        _hover={{
          transform: 'translateY(2px)',
          boxShadow: 'lg',
        }}
        colorScheme='green'
      >
        Generate Certificate
      </Button>

      {certificateUrl && (
        <Button
          as="a"
          href={certificateUrl}
          download="certificate.pdf"
          mt={4}
          rounded={'none'}
          w={'full'}
          size={'lg'}
          py={'7'}
          textTransform={'uppercase'}
          _hover={{
            transform: 'translateY(2px)',
            boxShadow: 'lg',
          }}
          colorScheme='green'
        >
          Download Certificate
        </Button>
      )}
    </Container>
    </MainLayout>
  );
};

export default CertificateGenerator;
