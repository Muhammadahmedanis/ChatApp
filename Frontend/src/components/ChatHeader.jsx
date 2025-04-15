import React from 'react'
import { IoClose } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/slices/messageSlice';
import { clearSearchResult } from '../redux/slices/authSlice';
import { useSocket } from '../socketClient/socketContext';

function ChatHeader({ data }) {
  const dispatch = useDispatch();

  const { onlineUsers } = useSocket() || {};

  const handleClose = () => {
    dispatch(setSelectedUser([]));
    dispatch(clearSearchResult());
  };


  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={data?.profilePic || "/avatar.png"} alt={data?.userName} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{data?.userName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers?.includes(data?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button className='cursor-pointer' onClick={handleClose}>
          <IoClose />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader