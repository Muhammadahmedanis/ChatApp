import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/axios.js';
import toast from 'react-hot-toast';

export const signupUser = createAsyncThunk("auth/signup", async (userData, { rejectWithValue } ) => {
    try {
        const response = await axiosInstance.post("auth/signup", userData);
        toast.success(response?.data?.message);
        sessionStorage.setItem("user", JSON.stringify({ userName: response.data.data.userName, id: response.data.data._id }));
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return rejectWithValue(error.response?.data?.message);
    }
})



export const signinUser = createAsyncThunk("auth/signin", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`auth/signin`, userData);
        toast.success(response.data?.message);
        sessionStorage.setItem("user", JSON.stringify({ userName: response.data.data.userName, id:  response.data.data._id }));
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return rejectWithValue(error.response?.data?.message);
    }
});



export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("auth/logout");
        toast.success(response.data?.message);
        sessionStorage.removeItem("user");
        return null;
    } catch (error) {
        const message = error?.response?.data?.message || error.message;
        toast.error(message);
        return rejectWithValue(message);
    }
});




export const updateUserProfile = createAsyncThunk("auth/updateProfile", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put(`user/updateProfile`, userData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        toast.success(response.data?.message);
        // Update local storage with the new username
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        sessionStorage.setItem("user", JSON.stringify({ ...storedUser, userName: response?.data?.data?.userName }));

        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return rejectWithValue(error.response?.data?.message);
    }
});




export const me = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("auth/me");
        // toast.success(response.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch user");
        return rejectWithValue(error.response?.data?.message);
    }
});



export const searchUserName = createAsyncThunk("auth/search", async (query, { rejectWithValue}) => {
    try {
        const response = await axiosInstance.get(`auth/search?query=${query}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
})




// Auth Slice
const authSlice = createSlice({
    name: "Auth",
    initialState: {
        user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null,
        isLoading: false,
        error: null,
        userProfile: null,
        searchResults: [],
    },
    reducers: {
        clearSearchResult: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signinUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(signinUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = { ...state.user, userName: action.payload.data.userName };
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(me.pending, (state) => {
                state.error = null;
            })
            .addCase(me.fulfilled, (state, action) => {
                state.userProfile = action.payload;
            })
            .addCase(me.rejected, (state, action) => {
                state.error = action.payload;
            })
            // .addCase(searchUser.pending, (state) => {
            //     state.isLoading = true;
            // })
            .addCase(searchUserName.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload?.data || [];  // 👈 Store results
            })
            .addCase(searchUserName.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
});

export const { clearSearchResult } = authSlice.actions;
export default authSlice.reducer;