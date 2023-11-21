import React, { useEffect, useState } from 'react';
import { Container, Table, Thead, Tbody, Tr, Th, Td, Link, Button, Stack } from '@chakra-ui/react';
import API_ENDPOINT from '../../config';

const Stats = () => {
  const [userStats, setUserStats] = useState([]);
  const [courseTitles, setCourseTitles] = useState({});
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`${API_ENDPOINT}/statistics/getStatistic/${userId}`)
      .then((response) => response.json())
      .then((data) => setUserStats(data.message))
      .catch((error) => console.error('Error fetching user statistics:', error));
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
      const courseInfoPromises = userStats.map(async (stat) => {
        const courseTitle = await fetchCourseInfo(stat.cid);
        setCourseTitles((prevTitles) => ({
          ...prevTitles,
          [stat.cid]: courseTitle,
        }));
      });

      await Promise.all(courseInfoPromises);
    };

    fetchAllCourseInfo();
  }, [userStats]);

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const totalTests = userStats.length;
  const completedTests = userStats.filter((stat) => stat.result >= 50).length;
  const failedTests = userStats.filter((stat) => stat.result < 50).length;

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Stack direction={['column', 'row']} spacing='24px'>
        <Button onClick={() => handleFilter('all')} variant="link" colorScheme='black' size='lg'>
          Total Tests: {totalTests}
        </Button>
        <Button onClick={() => handleFilter('completed')} variant="link" colorScheme='green' size='lg'>
          Completed Tests: {completedTests}
        </Button>
        <Button onClick={() => handleFilter('failed')} variant="link" colorScheme='red' size='lg'>
          Failed Tests: {failedTests}
        </Button>
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Course Title</Th>
            <Th>Result</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userStats
            .filter((stat) => {
              if (filter === 'all') return true;
              return filter === 'completed' ? stat.result >= 50 : stat.result < 50;
            })
            .map((stat) => (
              <Tr key={stat.id}>
                <Td fontWeight="extrabold" fontSize="x-large">
                  <Link href={`/course/${stat.cid}`}>{courseTitles[stat.cid] || 'Loading...'}</Link>
                </Td>
                <Td>
                  <span style={{ color: stat.result >= 50 ? 'green' : 'red' }}>
                    {stat.result}% ({stat.result >= 50 ? 'Completed' : 'Failed'})
                  </span>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Stats;
