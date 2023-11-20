import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Container, Link, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import API_ENDPOINT from '../../config';
import ImageDisplay from './ImageDisplay';

const CategoryCards = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINT}/categories/getAllCategories`);
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxWidth="1200px" mx="auto" my="unset" p={10}>
            {loading ? (
                <Spinner size="xl" />
            ) : (
                <SimpleGrid columns={[1, 2, 3]} spacing="15px">
                    {data &&
                        data.map((category) => (
                            <Box position="relative" key={category.id}>
                                <Link href={`/category/${category.id}`}>
                                    <Box
                                        borderWidth="1px"
                                        shadow="md"
                                        rounded="lg"
                                        overflow="hidden"
                                        position="relative"
                                    >
                                        {category.picId && (
                                            <ImageDisplay imageId={category.picId} />
                                        )}
                                        <Box p="6">
                                            <Box d="flex" alignItems="baseline">
                                                <Box
                                                    fontWeight="semibold"
                                                    as="h2"
                                                    letterSpacing="wide"
                                                    textTransform="uppercase"
                                                >
                                                    {category.name}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Link>
                            </Box>
                        ))}
                </SimpleGrid>
            )}
        </Container>
    );
};

export default CategoryCards;
