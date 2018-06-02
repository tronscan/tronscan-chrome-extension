export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_PK = 'SET_PK';
export const LOGOUT = 'LOGOUT';

export const setPrivateKey = (privateKey) => ({
  type: SET_PK,
  privateKey,
});

export const setAccount = (account) => ({
  type: SET_ACCOUNT,
  account,
});

export const logout = () => ({
  type: LOGOUT,
});
