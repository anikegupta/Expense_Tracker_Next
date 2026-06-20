import { getAccessTokenFromLocalStorage } from "./LocaStorageSrevice";

const buildExpenseQuery = ({ minPrice = "", maxPrice = "", fromDate = "", toDate = "" } = {}) => {
  const params = new URLSearchParams();
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  return params.toString() ? `?${params.toString()}` : '';
};

export const getExpenses = async (minPrice = "", maxPrice = "", fromDate = "", toDate = "") => {
  const token = getAccessTokenFromLocalStorage();
  const query = buildExpenseQuery({ minPrice, maxPrice, fromDate, toDate });
  const response = await fetch(`/api/expenses${query}`, {
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

export const getHiddenExpenses = async (minPrice = "", maxPrice = "", fromDate = "", toDate = "") => {
  const token = getAccessTokenFromLocalStorage();
  const query = buildExpenseQuery({ minPrice, maxPrice, fromDate, toDate });
  const response = await fetch(`/api/expenses/hidden${query}`, {
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
  const query = buildExpenseQuery({ fromDate, toDate });
  const response = await fetch(`/api/expenses${query}`, {
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