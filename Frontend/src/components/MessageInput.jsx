import React, { useRef, useState } from 'react'
import { useActionState } from 'react';
import toast from 'react-hot-toast';
import { LuImage, LuSend } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import { sendMsg } from '../redux/slices/messageSlice';
import { BiLoaderCircle } from "react-icons/bi";

function MessageInput() {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const dispatch = useDispatch();
  const { isLoading, selectedUser } = useSelector(state => state?.message)
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file!")
        return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const[data, submitAction, isPending] = useActionState(async (previouState, formData) => {
  const message = formData.get("message");
  if (!message.trim() && !imageFile) return;

  const newFormData = new FormData();
  newFormData.append("text", message);
  newFormData.append("recipientId", selectedUser?.userId);
  if (imageFile) {
    newFormData.append("img", imageFile); 
  }
  dispatch(sendMsg(newFormData));
  removeImage();
  })

  return (
    <div className='p-4 w-full'>
        {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <IoMdClose className="size-3 cursor-pointer" />
            </button>
          </div>
        </div>
      )}

       <form action={submitAction} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            name='message'
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
            ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}>
            <LuImage size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          >
          {isLoading ? <BiLoaderCircle className="size-7 animate-spin" /> : <LuSend size={22} />}
        </button>
      </form>
    </div>
  )
}

export default MessageInput