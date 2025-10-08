import {
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
} from "./ActionType";

const initialState = {
  isLoading: false,
  user: null,
  error: null,
  isAuthenticated: false,
  jwt: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        jwt: action.payload,
        isAuthenticated: true,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action.payload,
        isAuthenticated: true,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    case LOGOUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default authReducer;
