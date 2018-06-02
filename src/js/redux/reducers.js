import {LOGOUT, SET_ACCOUNT, SET_PK} from "./actions";

const initialState = {
  privateKey: null,
  walletOpen: false,
  account: null,
};

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case SET_PK:
      return {
        ...state,
        privateKey: action.privateKey,
        walletOpen: true,
      };

    case SET_ACCOUNT:
      return {
        ...state,
        account: action.account,
      };

    case LOGOUT:
      return {
        ...state,
        account: null,
        walletOpen: false,
        privateKey: null,
      };
  }

  return state;
}
