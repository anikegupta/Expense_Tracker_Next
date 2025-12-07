import { getAccessTokenFromLocalStorage } from "./LocaStorageSrevice";

export const getDashboardData = async () => {
  try {
    const token = getAccessTokenFromLocalStorage();
    
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch('/api/ai/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message: errorData.message || `HTTP error! status: ${response.status}`,
        response: { data: errorData }
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    throw error;
  }
};