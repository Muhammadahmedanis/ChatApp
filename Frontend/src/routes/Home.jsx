import React from 'react'
import Sidebar from '../components/Sidebar'
import NoChatSelected from '../components/NoChatSelected'
import ChatContainer from '../components/ChatContainer'
import { useSelector } from 'react-redux';

function Home() {
  const { selectedUser } = useSelector(state => state?.message);
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar />
            {selectedUser?._id ? <ChatContainer /> : <NoChatSelected /> }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home