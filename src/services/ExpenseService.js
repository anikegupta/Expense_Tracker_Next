import { getAccessTokenFromLocalStorage } from "./LocaStorageSrevice";

export const getExpenses = async (minPrice = "", maxPrice = "", fromDate = "", toDate = "") => {
  const token = getAccessTokenFromLocalStorage();
  const response = await fetch(`/api/expenses?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      status: response.status,
      response: { data: errorData }
    };
  }

  return response.json();
};

export const getSortedExpenses = async (fromDate = "", toDate = "") => {
  const token = getAccessTokenFromLocalStorage();
  const response = await fetch(`/api/expenses?fromDate=${fromDate}&toDate=${toDate}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      status: response.status,
      response: { data: errorData }
    };
  }

  return response.json();
};

export const createExpense = async (expenseData) => {
  const token = getAccessTokenFromLocalStorage();
  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      status: response.status,
      response: { data: errorData }
    };
  }

  return response.json();
};

export const deleteExpenses = async (expenseId) => {
  const token = getAccessTokenFromLocalStorage();
  const response = await fetch(`/api/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      status: response.status,
      response: { data: errorData }
    };
  }

  return response.json();
};

export const updateExpense = async (expenseId, expenseData) => {
  const token = getAccessTokenFromLocalStorage();
  const response = await fetch(`/api/expenses/${expenseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw {
      status: response.status,
      response: { data: errorData }
    };
  }

  return response.json();
};