import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";

const token = localStorage.getItem("jwt");

const registerRequest=()=>{
    return{
        type:"REGISTER_REQUEST"
    }
}
const registerSuccess=(user)=>{
    return{
        type:"REGISTER_SUCCESS",
        payload:user
    }
}
const registerFail=(error)=>{
    return {
      type: "REGISTER_FAILURE",
      payload: error,
    };
}

export const register=userData=>async (dispatch)=>{
    dispatch(registerRequest());
    try{
        const response = await axios.post(`${API_BASE_URL}/auth/signup`,userData);
        const user = response.data;
        if(user.jwt){
            localStorage.setItem("jwt",user.jwt);
        }
        dispatch(registerSuccess(user.jwt));
    }catch(e){
        dispatch(registerFail(e.message));
    }
}

const loginRequest = () => {
  return {
    type: "LOGIN_REQUEST",
  };
};
const loginSuccess = (user) => {
  return {
    type: "LOGIN_REQUEST",
    payload: user,
  };
};
const loginFail = (error) => {
  return {
    type: "LOGIN_FAILURE",
    payload: error,
  };
};

export const login= userData=>async (dispatch)=>{
    dispatch(loginRequest());
    try{
        const response = await axios.post(`${API_BASE_URL}/auth/signin`,userData);
        const user = response.data;
        if(user.jwt){
            localStorage.setItem("jwt",user.jwt);
        }
        dispatch(loginSuccess(user.jwt));
    }catch(e){
        dispatch(loginFail(e.message));
    }
}

const getUserRequest = () => {
  return {
    type: "GET_USER_REQUEST",
  };
};
const getUserSuccess = (user) => {
  return {
    type: "GET_USER_SUCCESS",
    payload: user,
  };
};
const getUserFail = (error) => {
  return {
    type: "GET_USER_FAILURE",
    payload: error,
  };
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch(getUserRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`,{
        headers:{
            Authorization:`Bearer ${jwt}`
        }
    });
    const user = response.data;
    console.log(user,"dataa");
    dispatch(getUserSuccess(user));
  } catch (e) {
    dispatch(getUserFail(e.message));
  }
};

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: "LOGOUT", payload: null });
    localStorage.clear();
  };
};

