import axios from 'axios';

export const getLeetcodeSubmissions = async (username: string): Promise<number> => {
  const targetDate = new Date('2024-07-22');
  targetDate.setDate(targetDate.getDate() - 1); // Subtract 1 day from current date

  // If you need the date as a string in YYYY-MM-DD format
  const formattedYesterday = targetDate.toISOString().split('T')[0];

  console.log('formattedYesterday: ', formattedYesterday); 
  try {
    // Convert the targetDate to a Unix timestamp
    const targetDateObj = new Date('2024-07-22');
    const targetTimestamp = convertDateToLeetCodeTimestamp('2024-07-22');
    console.log('Leetcode TImestamps: ', targetTimestamp)
    
    // Fetch user stats from the API
    const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
    console.log(response.data)
    const { submissionCalendar } = response.data;

    // Check if the timestamp exists in the submissionCalendar
    const submissions = submissionCalendar[targetTimestamp];

    // Return the number of submissions for the given date (or 0 if no submissions)
    return submissions || 0;
  } catch (error) {
    console.error('Error fetching data from LeetCode:', error);
    throw new Error('Failed to fetch submissions');
  }
};


const convertDateToLeetCodeTimestamp = (dateString: string): number => {
  // Parse the date string into a Date object (assumes YYYY-MM-DD format)
  const date = new Date(dateString);

  // Set time to midnight UTC
  date.setUTCHours(0 - 8, 0, 0, 0);

  // Convert to seconds since Unix epoch
  const timestamp = Math.floor(date.getTime() / 1000);

  return timestamp;
};