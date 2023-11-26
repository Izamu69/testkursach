import axios from 'axios';
import API_ENDPOINT from '../../config';
async function checkCoursesAndStatistics(categoryId, userId) {  try {
    // Step 1: Get courses by category    
    const getCoursesResponse = await axios.get(`${API_ENDPOINT}/categories/getByCategory/${categoryId}`);
    const courses = getCoursesResponse.data.message;
    if (!courses || courses.length === 0) {      console.log('No courses found for the given category.');
      return false;    }
    // Step 2: Extract course IDs
    const courseIds = courses.map(course => course.id);
    // Step 3: Check if test content is empty for each course    
    const validCourseIds = [];
    for (const courseId of courseIds) {      const isTestContentEmptyResponse = await axios.get(`${API_ENDPOINT}/tests/isEmpty/${courseId}`);
      const isEmpty = isTestContentEmptyResponse.data.isEmpty;
      if (!isEmpty) {        validCourseIds.push(courseId);
      }    }
    if (validCourseIds.length === 0) {
      console.log('All courses have empty test content.');      return false;
    }
    // Step 4: Get statistics by user ID    
    const getStatisticsResponse = await axios.get(`${API_ENDPOINT}/statistics/getStatistic/${userId}`);
    const userStatistics = getStatisticsResponse.data.message;
    // Step 5: Check if each valid test ID is present in the statistics and has a result greater than 50    
    for (const courseId of validCourseIds) {
      const isCourseValid = userStatistics.some(statistic => statistic.cid === courseId && statistic.result > 50);
      if (!isCourseValid) {        console.log(`Course with ID ${courseId} does not meet the criteria.`);
        return false;      }
    }
    // If all conditions are met, return true    
    return true;
  } catch (error) {    console.error(error);
    return false;  }
}

export default checkCoursesAndStatistics;