import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  numberplate: "",
  driversName: "",
  contact: null,
  address: "",
  available: false,
  password: "",
  id: null,
};

const loginURL = "http://localhost:8000/api/ambulances/login";
const registerURL = "http://localhost:8000/api/ambulances/register";

export const signup = createAsyncThunk(
  "driverAuth/signup",
  async (
    { numberplate, driversName, contact, address, available, password },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(registerURL, {
        numberplate,
        driversName,
        contact,
        address,
        available,
        password,
      });
      console.log(res.data.response);
      localStorage.setItem("token", res.data.response.ambulance.token);
      return res.data.response;
    } catch (e) {
      console.log(e.response);
      return rejectWithValue(e.response.data.msg);
    }
  }
);

export const login = createAsyncThunk(
  "driverAuth/login",
  async ({ email, password, usertype }, { rejectWithValue }) => {
    try {
      const res = await axios.post(loginURL, {
        email,
        password,
        usertype,
      });
      console.log(res.data.response);
      localStorage.setItem("token", res.data.response.ambulance.token);
      return res.data.response;
    } catch (err) {
      console.log(err.response.data);
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const driverAuthSlice = createSlice({
  name: "driverAuth",
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        numberplate: "",
        driversName: "",
        contact: null,
        address: "",
        available: false,
        password: "",
        id: null,
      });
    },
  },
  extraReducers: {
    // [login.pending]: (state, action) => {
    //   Object.assign(state, {
    //     loading: true,
    //     error: null,
    //     isLoggedIn: false,
    //     firstName: "",
    //     lastName: "",
    //     email: "",
    //     usertype: "",
    //   });
    // },
    // [login.fulfilled]: (state, action) => {
    //   console.log(action.payload);
    //   Object.assign(state, {
    //     loading: false,
    //     error: null,
    //     isLoggedIn: true,
    //     firstName: action.payload.user.firstname,
    //     lastName: action.payload.user.lastname,
    //     email: action.payload.user.email,
    //     usertype: action.payload.user.usertype,
    //   });
    // },
    // [login.rejected]: (state, action) => {
    //   Object.assign(state, {
    //     loading: false,
    //     error: action.payload,
    //     isLoggedIn: false,
    //     firstName: "",
    //     lastName: "",
    //     email: "",
    //     usertype: "",
    //   });
    // },
    [signup.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        numberplate: "",
        driversName: "",
        contact: null,
        address: "",
        available: false,
        password: "",
        id: null,
      });
    },
    [signup.fulfilled]: (state, action) => {
      const ambulance = action.payload.ambulance;
      Object.assign(state, {
        loading: false,
        error: null,
        numberplate: ambulance.numberplate,
        driversName: ambulance.driversName,
        contact: ambulance.contact,
        address: ambulance.address,
        available: ambulance.available,
        password: ambulance.password,
        id: ambulance._id,
      });
    },
    [signup.rejected]: (state, action) => {
      console.log(action);
      Object.assign(state, {
        loading: false,
        error: null,
        numberplate: "",
        driversName: "",
        contact: null,
        address: "",
        available: false,
        password: "",
        id: null,
      });
    },
  },
});

export default driverAuthSlice.reducer;
export const isUserLoggedIn = (state) => state.driverAuth.isLoggedIn;
export const getName = (state) => state.driverAuth.driversName;
export const getEmail = (state) => state.driverAuth.email;
export const { logoutUser } = driverAuthSlice.actions;
export const getUserType = (state) => state.driverAuth.usertype;
