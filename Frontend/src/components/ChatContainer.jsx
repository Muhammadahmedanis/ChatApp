import React, { useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkelton from './MessageSkelton'
import { useDispatch, useSelector } from 'react-redux';
import { deleteConversation, editConversation, otherConversation } from '../redux/slices/messageSlice';
import { FiEdit3 } from 'react-icons/fi';
import { MdOutlineDeleteOutline } from "react-icons/md";

function ChatContainer() {
 const { selectedUser, selectedConversation } = useSelector(state => state?.message);
 const dispatch = useDispatch();

 const[editingId, setEditingId] = useState(null);
 const[editText, setEditText] = useState("");
  
 useEffect(() => {
  if (selectedUser?._id) {
    dispatch(otherConversation(selectedUser?._id));
  }
}, [dispatch, selectedUser?._id]);
// console.log(selectedConversation);

const handleEdit = (msg) => {
  setEditingId(msg._id);
  setEditText(msg.text);
};

const handleEditSave = async (msgId) => {
  if (editText.trim()) {
    dispatch(editConversation({ id: msgId, text: editText }));
    setEditingId(null);
    setEditText("");
  }
};

const handleDelete = async (msgId) => {
  dispatch(deleteConversation(msgId));
};

console.log(selectedConversation);

if (!selectedUser) return null;
  
  if(selectedConversation) return(
    <div className='flex w-full justify-between flex-col overflow-auto'>
      <ChatHeader data={selectedUser} />
      {!selectedConversation ? (
        <MessageSkelton />
      ) : (
        selectedConversation.map((msg) => {
          const isOwnMessage = msg.sender !== selectedUser._id; // own messages
          return (
<div
  key={msg._id}
  className={`my-4 px-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
>
  <div className="flex items-end gap-2 max-w-md group relative">

    {/* Avatar (only for incoming messages) */}
    {!isOwnMessage && (
      <div className="chat-image avatar self-end">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt="User Avatar"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    )}

    {/* Message Content Container */}
    <div className="chat-bubble max-w-xs p-3 relative">
      {editingId === msg._id ? (
        <div>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="input input-sm w-full mb-2"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEditSave(msg._id)}
              className="btn btn-xs btn-success"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="btn btn-xs btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="break-words">{msg.text}</p>
          {msg?.img && (
            <img
              src={msg.img}
              alt="Message"
              className="mt-2 rounded-md w-40 h-32 object-cover border border-zinc-700"
            />
          )}
        </>
      )}
    </div>

    {/* Action Buttons (always inside parent, hover on group keeps visible) */}
    {isOwnMessage && !editingId && (
      <div className="absolute top-0 right-0 -translate-y-6 hidden group-hover:flex gap-2 p-1 rounded z-10">
        <FiEdit3
                size={18}
                className="cursor-pointer hover:text-green-500"
                onClick={() => handleEdit(msg)}
              />
              <MdOutlineDeleteOutline
                size={18}
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleDelete(msg._id)}
              />
            </div>
          )}
        </div>
      </div>

          
          );
        })
      )}
      <MessageInput />
    </div>
  )
}

export default ChatContainer