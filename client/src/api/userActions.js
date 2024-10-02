import axios from 'axios';

export const loginAction = async (email, password, headers) => {
  try {
    const { data } = await axios.post(
      `/api/users/login`,
      {
        email,
        password,
      },
      headers
    );
    return [data, null];
  } catch (error) {
    console.log('[loginAction]:', error);
    return [null, error];
  }
};

export const whoAmIAction = async (token) => {
  try {
    const { data } = await axios.get('/api/users/who-am-i', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return [data, null];
  } catch (error) {
    console.log('[whoAmIAction]:', error);
    return [null, error];
  }
};

export const registerUserAction = async (fullName, email, password, headers) => {
  try {
    const { data } = await axios.post(
      `/api/users/register`,
      {
        fullName,
        email,
        password,
      },
      headers
    );
    return [data, null];
  } catch (error) {
    console.log('[registerUserAction]:', error);
    return [null, error];
  }
};
