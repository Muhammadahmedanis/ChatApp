import React, { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkelton from './MessageSkelton'
import { useDispatch, useSelector } from 'react-redux';
import { otherConversation } from '../redux/slices/messageSlice';

function ChatContainer() {
 const { selectedUser, selectedConversation } = useSelector(state => state?.message);
 const dispatch = useDispatch();
  
 useEffect(() => {
  if (selectedUser?._id) {
    dispatch(otherConversation(selectedUser?._id));
  }
}, [dispatch, selectedUser?._id]);
// console.log(selectedConversation);

if (!selectedUser) return null;
  
  if(selectedConversation) return(
    <div className='flex w-full justify-between flex-col overflow-auto'>
      {/* <div className='flex flex-col justify-between'> */}

      <ChatHeader data={selectedUser} />
      { !selectedConversation ? 
        <MessageSkelton /> :
        selectedConversation.map((msg) => (
          <div
          key={msg._id}
          className={`my-2 mx-3 chat ${msg.sender === selectedUser.userId ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="User Avatar"
                  className="rounded-full"
                  />
              </div>
            </div>

            <div className="chat-bubble">
              {msg.text}
            </div>
          </div>
        ))
      }
      <MessageInput />
    {/* </div> */}
    </div>
  )
}

export default ChatContainer