import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { me } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

function Layout() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const userInSession = sessionStorage.getItem("user");
    console.log(userInSession);
    // console.log(user);
    
    if (user || userInSession) {
      dispatch(me());
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Layout;
