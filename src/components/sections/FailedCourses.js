import React, { useEffect, useState } from 'react';
import { Container, SimpleGrid, Box, Badge, Link, Text } from '@chakra-ui/react';
import API_ENDPOINT from '../../config';

const FailedCourses = () => {
  const [failedCourses, setFailedCourses] = useState([]);
  const [courseTitles, setCourseTitles] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchUserStats = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/statistics/getStatistic/${userId}`);
        const data = await response.json();
        const userFailedCourses = data.message.filter((stat) => stat.result < 50);
        const sortedFailedCourses = userFailedCourses.slice(0, 3);
        setFailedCourses(sortedFailedCourses);
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    };

    fetchUserStats();
  }, []);

  const fetchCourseInfo = async (cid) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/courses/get/${cid}`);
      const data = await response.json();
      return data.message.title;
    } catch (error) {
      console.error('Error fetching course info:', error);
      return 'Unknown Course';
    }
  };

  useEffect(() => {
    const fetchAllCourseInfo = async () => {
      const courseInfoPromises = failedCourses.map(async (stat) => {
        const courseTitle = await fetchCourseInfo(stat.cid);
        setCourseTitles((prevTitles) => ({
          ...prevTitles,
          [stat.cid]: courseTitle,
        }));
      });

      await Promise.all(courseInfoPromises);
    };

    fetchAllCourseInfo();
  }, [failedCourses]);

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <SimpleGrid columns={[1, 2, 3]} spacing="15px">
        {failedCourses.map((stat) => (
          <Box key={stat.id}>
            <Box borderWidth="1px" shadow="md" rounded="lg" overflow="hidden" position="relative">
              <Box fontSize="sm" position="absolute" right="5px" top="5px" zIndex="1">
                <Badge rounded="full" p="2px 8px" colorScheme="red">
                  Failed
                </Badge>
              </Box>
              <Link href={`/course/${stat.cid}`}>
                <Box p="6">
                  <Text fontWeight="semibold" as="h2" letterSpacing="wide" textTransform="uppercase">
                    {courseTitles[stat.cid] || 'Loading...'}
                  </Text>
                  <Text mt="1" fontWeight="semibold" lineHeight="tight" color="gray.600" fontSize="sm" noOfLines={3}>
                    {stat.result}% (Failed)
                  </Text>
                </Box>
              </Link>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default FailedCourses;
