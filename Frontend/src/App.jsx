import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from './routes/Home';
import Signup from './routes/Signup';
import Login from './routes/Login';
import Setting from './routes/Setting';
import Profile from './routes/Profile';
import Layout from './loyout/Loyout';
import { Toaster } from 'react-hot-toast';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={ <Layout /> }>
        <Route index element={<Home /> } />
        <Route path='/signup' element={ <Signup /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/settings' element={ <Setting /> } />
        <Route path='/profile' element={ <Profile /> } />
      </Route>
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
