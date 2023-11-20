import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Container, Link, Text, Badge } from '@chakra-ui/react';
import API_ENDPOINT from '../../config';

const NewCourses = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_ENDPOINT}/courses/all`)
      .then((res) => res.json())
      .then((res) => {
        const sortedData = res.message.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const newestCourses = sortedData.slice(0, 3);
  
        setData(newestCourses);
      });
  }, []);

  return (
    <Container maxWidth="1200px" mx="auto" my="unset" p={10}>
      <SimpleGrid columns={[1, 2, 3]} spacing="15px">
        {data &&
          data.map((course) => (
            <Box position="relative" key={course.id}>
              <Box fontSize="sm" position="absolute" right="5px" margin="5px" zIndex="1">
                <Badge rounded="full" p="2px 8px" colorScheme="green">
                  New
                </Badge>
              </Box>
              <Link href={`/course/${course.id}`}>
                <Box
                  borderWidth="1px"
                  shadow="md"
                  rounded="lg"
                  overflow="hidden"
                  position="relative"
                >
                  <Box p="6">
                    <Box d="flex" alignItems="baseline">
                      <Box
                        fontWeight="semibold"
                        as="h2"
                        letterSpacing="wide"
                        textTransform="uppercase"
                        ml="2"
                      >
                        {course.title}
                      </Box>
                    </Box>
                    <Text
                      mt="1"
                      fontWeight="semibold"
                      lineHeight="tight"
                      color="gray.600"
                      fontSize="sm"
                      noOfLines={3}
                    >
                      {course.content.description}
                    </Text>
                  </Box>
                </Box>
              </Link>
            </Box>
          ))}
      </SimpleGrid>
    </Container>
  );
};

export default NewCourses;