import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { API_BASE_URL, getErrorMessage } from '../utils/api';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils/refreshToken';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  UPDATE_SUCCESS,
  UPDATE_FAIL
} from './types';

export const login = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/auth/login`, formData);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    if (res.data.refreshToken) {
      setRefreshTokenCookie(res.data.refreshToken);
    }
  } catch (err) {
    dispatch({ type: LOGIN_FAIL, payload: getErrorMessage(err, 'Login failed') });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/auth/registration`, formData);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: REGISTER_FAIL, payload: getErrorMessage(err, 'Registration failed') });
  }
};

export const UpdateUser = (formData) => async (dispatch) =>{
  try{
    const res = await axiosInstance.put('/users/update', formData)
    dispatch({ type: UPDATE_SUCCESS, payload: res.data });
  }catch(err){
    dispatch({ type: UPDATE_FAIL, payload: getErrorMessage(err, 'Update failed') });
  }
}

export const getUser = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get('/users');
    dispatch({ type: GET_USER_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_USER_FAIL, payload: getErrorMessage(err, 'Unable to fetch user') });
  }
};

export const logout = () => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/users/auth/logout');
    dispatch({ type: LOGOUT_SUCCESS, payload: res.data.message });
    localStorage.removeItem('token');
    clearRefreshTokenCookie();
  } catch (err) {
    clearRefreshTokenCookie();
    dispatch({ type: LOGOUT_FAIL, payload: getErrorMessage(err, 'Logout failed') });
  }
};

export const resetPassword = (formData) => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/users/auth/reset-password', formData);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: RESET_PASSWORD_FAIL, payload: getErrorMessage(err, 'Password reset failed') });
  }
};
