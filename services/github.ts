import axios from 'axios';
import moment from 'moment-timezone';

// Fetch recent GitHub contributions without authentication
export const getRecentContributions = async (username: string): Promise<number> => {
  const GITHUB_API_URL = `https://api.github.com/users/${username}/events`;
  
  const ONE_DAY_AGO_IST = moment().tz('Asia/Kolkata').subtract(24, 'hours');

  try {
    const response = await axios.get(GITHUB_API_URL);
    const events = response.data;

    // Filter events created in the last 24 hours
    const recentEvents = events.filter((event: any) => {
      const eventDate = new Date(event.created_at);
      return eventDate > ONE_DAY_AGO_IST.toDate();
    });

    console.log(`Fetched ${events.length} events. Found ${recentEvents.length} in the last 24 hours.`);
    return recentEvents.length;
  } catch (error: any) {
    console.error('Error fetching GitHub events:', error.response?.data || error.message);
    throw new Error('Failed to fetch GitHub events');
  }
};

// Example usage
// (async () => {
//   const username = 'ayan-mn18'; // Replace with the GitHub username
//   const contributions = await getRecentContributions(username);
//   console.log(`Contributions in the last 24 hours: ${contributions}`);
// })();

