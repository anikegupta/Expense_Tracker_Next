export const SESSION_TIME = 15 * 60 * 1000;

export const setHiddenPinSession = () => {
  localStorage.setItem(
    "hiddenExpenseVerifiedUntil",
    (Date.now() + SESSION_TIME).toString()
  );
};

export const clearHiddenPinSession = () => {
  localStorage.removeItem("hiddenExpenseVerifiedUntil");
};

export const isHiddenPinSessionValid = () => {
  const expiry = localStorage.getItem("hiddenExpenseVerifiedUntil");

  if (!expiry) return false;

  if (Number(expiry) <= Date.now()) {
    localStorage.removeItem("hiddenExpenseVerifiedUntil");
    return false;
  }

  return true;
};