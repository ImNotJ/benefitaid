export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const formatDate = (date) => {
  // Accept both date input format and MM/DD/YYYY format
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    // Try parsing MM/DD/YYYY
    const parts = date.split('/');
    if (parts.length === 3) {
      const d = new Date(parts[2], parts[0] - 1, parts[1]);
      return !isNaN(d.getTime());
    }
    return false;
  }
  return true;
};

export const validatePassword = (password) => {
  // Example: Password must be at least 8 characters long
  return password.length >= 8;
};