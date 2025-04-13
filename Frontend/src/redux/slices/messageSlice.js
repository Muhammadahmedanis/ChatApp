import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/axios";
import toast from "react-hot-toast";


export const sendMsg = createAsyncThunk("msg/send", async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("msg/send", formData
        // , {
        //     headers:{
        //         'Content-Type': 'multipart/form-data',
        //     },
        // }
    );
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return rejectWithValue(error.response?.data?.message);
    }
});



export const getConversation = createAsyncThunk("msg/conversations", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("msg/conversations");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return rejectWithValue(error.response?.data?.message); 
    }
});





export const otherConversation = createAsyncThunk( "msg/otherUserId", async (otherUserId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`msg/${otherUserId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get conversation");
        return rejectWithValue(error.response?.data?.message);
    }
});
  


// Message slice
const messageSlice = createSlice({
    name: "message",
    initialState: {
        conversations: [],
        selectedConversation: null,
        isLoading: false,
        error: null,
        messageStatus: null,
        selectedUser: [],
    },
    reducers: {
        clearSelectedConversation: (state) => {
            state.selectedConversation = null;
        },
        clearMessageStatus: (state) => {
            state.messageStatus = null;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send message
            .addCase(sendMsg.pending, (state) => {
                state.isLoading = true;
                state.messageStatus = null;
            })
            .addCase(sendMsg.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messageStatus = "Message sent successfully";
                if (state.selectedConversation) {
                    state.selectedConversation.push(action.payload?.data);
                } else {
                    state.selectedConversation = [action.payload?.data];
                }
            })
            .addCase(sendMsg.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get conversations
            .addCase(getConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversations = action.payload?.data || [];
            })
            .addCase(getConversation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get single conversation with other user
            .addCase(otherConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(otherConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedConversation = action.payload?.data || null;
            })
            .addCase(otherConversation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});


// Export actions & reducer
export const { clearSelectedConversation, clearMessageStatus, setSelectedUser } = messageSlice.actions;
export default messageSlice.reducer;