import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Container, Link, Text, Badge, Select } from '@chakra-ui/react';
import API_ENDPOINT from '../../config';

const CourseCards = ({ searchTerm, selectedCategoryId, userStats, percentage }) => {
  const [data, setData] = useState(null);
  const [filterOption, setFilterOption] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/courses/getByCategory/${selectedCategoryId}`);
        const res = await response.json();

        if (response.ok) {
          console.log('Courses response:', res.message);

          const filteredData = res.message.filter((course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
          );

          console.log('filteredData:', filteredData);

          const updatedData = filteredData.map((course) => ({
            ...course,
            isCompleted: userStats.some((stat) => stat.cid === course.id && stat.result >= 50),
            hasFailed: userStats.some((stat) => stat.cid === course.id && stat.result < 50),
          }));

          setData(updatedData);
        } else {
          setError(`${res.message}`);
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching data');
      }
    };

    if (selectedCategoryId) {
      fetchData();
    }
  }, [searchTerm, selectedCategoryId, userStats, percentage]);

  const filteredCourses = data
    ? data.filter((course) => {
        switch (filterOption) {
          case 'completed':
            return course.isCompleted;
          case 'failed':
            return course.hasFailed;
          case 'notDone':
            return !course.isCompleted && !course.hasFailed;
          default:
            return true;
        }
      })
    : [];

  return (
    <Container maxWidth="1200px" mx="auto" my="unset" p={10}>
      {error && <p>Error: {error}</p>}
      <Select
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
        mb={4}
        maxWidth="200px"
      >
        <option value="all">All Courses</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
        <option value="notDone">Not Done</option>
      </Select>
      <SimpleGrid columns={[1, 2, 3]} spacing="15px">
        {filteredCourses.map((course) => (
          <Box position="relative" key={course.id}>
            {course.isCompleted && (
              <Box fontSize="sm" position="absolute" right="5px" margin="5px" zIndex="1">
                <Badge rounded="full" p="2px 8px" colorScheme="green">
                  Completed
                </Badge>
              </Box>
            )}
            {course.hasFailed && (
              <Box fontSize="sm" position="absolute" right="5px" margin="5px" zIndex="1">
                <Badge rounded="full" p="2px 8px" colorScheme="red">
                  Failed
                </Badge>
              </Box>
            )}
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

export default CourseCards;
