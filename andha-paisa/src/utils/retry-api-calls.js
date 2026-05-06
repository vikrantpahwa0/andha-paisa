// utils/apiClient.js
import { refreshAccessToken, logout } from '../store/slices/auth-slice';

let refreshPromise = null;

export const fetchWithAuth = async (url, options, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;

  const getToken = () => getState().auth?.accessToken || localStorage.getItem('accessToken');

  const makeRequest = (token) => fetch(`${import.meta.env.VITE_BE_URL}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers, Authorization: `Bearer ${token}` },
  });

  let token = getToken();
  let response = await makeRequest(token);

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = dispatch(refreshAccessToken()).unwrap()
        .catch(err => { throw err; })
        .finally(() => { refreshPromise = null; });
    }
    try {
      await refreshPromise;
      token = getToken();
      response = await makeRequest(token);
    } catch {
      dispatch(logout());   
      return rejectWithValue('Session expired. Please login again.');
    }
  }
  return response;
};