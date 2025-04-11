import React, { useState } from 'react'
import { FiCamera } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { FaRegEnvelope } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { me } from '../redux/slices/authSlice';
import { useEffect } from 'react';
import moment from 'moment';

function Profile() {
  let isUpdatingProfile;
  const dispatch = useDispatch();
  const[selectedImg, setSelectedImage] = useState(null);
  const { userProfile } = useSelector(state => state.auth);
  // console.log(userProfile?.data);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);      
      console.log(base64Image);
    }
  }

  return (
    <div className="pt-16">
    <div className="max-w-xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-2">
        <div className="text-center">
          <h1 className="text-2xl font-semibold ">Profile</h1>
          {/* <p className="mt-2">Your profile information</p> */}
        </div>

        {/* avatar upload section */}

        <div className="flex flex-col mb-4 items-center gap-4">
          <div className="relative">
            <img
              src={userProfile?.data?.profilePic || selectedImg || "/avatar.png" || "authUser.profilePic"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
            >
              <FiCamera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="text-[15px] font-semibold text-zinc-400 flex items-center gap-2">
              <LuUser className="w-5 h-5" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userProfile?.data?.userName}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-[15px] font-semibold text-zinc-400 flex items-center gap-2">
              <FaRegEnvelope className="w-5 h-5" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userProfile?.data?.email}</p>
          </div>
        </div>

        <div className="bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium  mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>
              {
                userProfile?.data?.createdAt
                  ? moment(userProfile.data.createdAt).format('DD MMMM YYYY')
                  : 'No date available'
              }</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Profile