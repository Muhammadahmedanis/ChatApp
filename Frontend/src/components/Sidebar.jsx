import React, { useEffect, useState } from 'react'
import SidebarSkelton from './SidebarSkelton';
import { LuUser } from "react-icons/lu";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { getConversation, setSelectedUser } from '../redux/slices/messageSlice';
import { GoDotFill } from "react-icons/go";

function Sidebar() {
    const onlineUsers = [];
    const dispatch = useDispatch();
    const { conversations, isLoading, selectedUser } = useSelector(state => state?.message);
    const { user } = useSelector(state => state?.auth);
    // console.log(selectedUser);
    // console.log(conversations);
    
    useEffect(() => {
      dispatch(getConversation());
    }, [])

    if (isLoading) return <SidebarSkelton />

  return (
   <aside className='h-full w-20 lg:w-72 border-r border-base-200 flex flex-col transition-all duration-200'>
    <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-2'>
            <LuUser className='size-6' />
            <span className='font-medium hidden lg:block'>Contacts</span>
        </div>
    </div>

  <div className='overflow-y-auto w-full pb-3'>
  {conversations?.length > 0 ? (
    conversations.map((convo) => {
      // console.log(convo);
      const participant = convo?.participants?.[0];
      return (
        <button
          key={convo._id}
          onClick={() =>{ 
            dispatch(setSelectedUser({...participant, userId: user?.id}))
          }}
          className={`
            w-full p-2.5 flex items-center gap-3 cursor-pointer
            hover:bg-base-300 transition-colors
            ${selectedUser?._id === participant?._id ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}>
          <div className="relative mx-auto lg:mx-0">
            <img
              src={participant?.profilePic || "/avatar.png"}
              alt={participant?.userName || "User"}
              className="size-12 object-cover rounded-full"
            />
            {onlineUsers.includes(participant?._id) ? <GoDotFill className='absolute top-7 text-green-600 right-0' size={22} /> : ""}
            {onlineUsers.includes(participant?._id) && (
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
              />
            )}
          </div>
          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{participant?.userName}</div>
            <div className="text-sm text-zinc-400 flex">
              {/* You could show online status or last message here */}
              {convo?.lastMessage?.sender == user?.id  ? <IoCheckmarkDoneOutline size={20} />  : ''}
              {convo?.lastMessage?.text?.length > 15 ? convo?.lastMessage?.text?.substring(0, 15) + '...' : convo?.lastMessage?.text}
                </div>
              </div>
            </button>
          );
        })
      ) : (
        <div className="text-center text-zinc-500 py-4">No conversations found</div>
      )}
      </div>

   </aside>
  )
}

export default Sidebar