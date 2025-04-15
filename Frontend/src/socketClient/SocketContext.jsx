import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const { userProfile } = useSelector(state => state?.auth);
  // console.log(user);
      
  useEffect(() => {
    if (!userProfile?.data || !userProfile.data._id) return;

    const socket = io("http://localhost:3000", {
      query: { userId: userProfile?.data?._id },
      withCredentials: true,
    });

    setSocket(socket);
    socket && socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.disconnect();
    
  }, [userProfile?.data?._id]);

  console.log(onlineUsers);
  
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
