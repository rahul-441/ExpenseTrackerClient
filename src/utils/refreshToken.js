import axios from "axios";
import { API_BASE_URL } from "./api";

let cachedAccessToken = null;
let tokenExpiresAt = 0;

const getToken = async () => {
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/users/getAccessToken`, {
      refreshToken,
    });
    cachedAccessToken = response?.data?.accessToken || null;
    tokenExpiresAt = now + 50 * 60 * 1000;
    return cachedAccessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    clearCachedToken();
    return null;
  }
};

const clearCachedToken = () => {
  cachedAccessToken = null;
  tokenExpiresAt = 0;
};

const getCookie = (name) => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

const setRefreshTokenCookie = (refreshToken) => {
  const isSecure = window.location.protocol === "https:";
  const maxAge = 28 * 24 * 60 * 60;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax${
    isSecure ? "; Secure" : ""
  }`;
};

const clearRefreshTokenCookie = () => {
  document.cookie = "refreshToken=; Path=/; Max-Age=0; SameSite=Lax";
  clearCachedToken();
};

export {
  getToken,
  getCookie,
  clearCachedToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
