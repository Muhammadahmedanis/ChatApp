import React from 'react'
import { useSelector } from 'react-redux'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet
} from 'react-router-dom'

import Home from './routes/Home'
import Signup from './routes/Signup'
import Login from './routes/Login'
import Setting from './routes/Setting'
import Profile from './routes/Profile'
import Layout from './loyout/Loyout'
import { Toaster } from 'react-hot-toast'

const AuthRoute = () => {
  const { userProfile } = useSelector((state) => state.auth);
  console.log("AuthRoute check:", userProfile);
  return !userProfile ? <Outlet /> : <Navigate to="/" />;
};

const PrivateRoute = () => {
  const { userProfile } = useSelector((state) => state.auth);
  console.log("AuthRoute check:", userProfile);
  return userProfile ? <Outlet /> : <Navigate to="/login" />;
};


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route index element={  <Home /> } />
            <Route path="settings" element={<Setting />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  )
}

export default App
