export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3030/api/v1";

export const getErrorMessage = (err, fallback = "Request failed") => {
  return err.response?.data?.message || err.response?.data?.error || fallback;
};
