// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const loginData = localStorage.getItem('userData');
    if (loginData) {
      const parsed = JSON.parse(loginData);
      return parsed.accessToken;
    }
  }
  return null;
};

// Create user
export const createUser = async (userObject) => {
  const response = await fetch(`/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userObject),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};

// Get profile
export const getUserProfile = async () => {
  const token = getAuthToken();
  
  const res = await fetch(`/api/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to get user profile');
  }
  
  return res.json();
};

// Update profile (only provided fields)
export const updateUserProfile = async (data) => {
  const token = getAuthToken();
  
  const res = await fetch(`/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error('Failed to update user profile');
  }
  
  return res.json();
};

export const deleteAvatar = async () => {
  const token = getAuthToken();
  
  const res = await fetch(`/api/user/avatar`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete avatar');
  }
  
  return res.json();
};