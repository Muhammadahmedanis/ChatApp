import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/axios";
import toast from "react-hot-toast";


export const sendMsg = createAsyncThunk("msg/send", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("msg/send", userData);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return rejectWithValue(error.response?.data?.message);
    }
});



export const getConversation = createAsyncThunk("msg/conversations", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("msg/conversations", userData);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return rejectWithValue(error.response?.data?.message); 
    }
});





export const otherConversation = createAsyncThunk( "msg/otherUserId", async (otherUserId, { rejectWithValue }) => {
    try {
    const response = await axiosInstance.get(`msg/conversations/${otherUserId}`);
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
        messageStatus: null
    },
    reducers: {
        clearSelectedConversation: (state) => {
            state.selectedConversation = null;
        },
        clearMessageStatus: (state) => {
            state.messageStatus = null;
        }
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
export const { clearSelectedConversation, clearMessageStatus } = messageSlice.actions;
export default messageSlice.reducer;
