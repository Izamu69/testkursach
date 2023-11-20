import React, { useEffect, useState } from 'react';
import { Container, Table, Thead, Tbody, Tr, Th, Td, Link } from '@chakra-ui/react';
import API_ENDPOINT from '../../config';

const Stats = () => {
  const [userStats, setUserStats] = useState([]);
  const [courseTitles, setCourseTitles] = useState({});

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

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Course Title</Th>
            <Th>Result</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userStats.map((stat) => (
            <Tr key={stat.id}>
              <Td fontWeight="extrabold" fontSize="x-large">
                {courseTitles[stat.cid] || 'Loading...'}
              </Td>
              <Td>
                <span style={{ color: stat.result >= 50 ? 'green' : 'red' }}>
                  {stat.result}% ({stat.result >= 50 ? 'Completed' : 'Failed'})
                </span>
              </Td>
              <Td> <Link href={`/course/${stat.cid}`}>Retry</Link> </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Stats;
