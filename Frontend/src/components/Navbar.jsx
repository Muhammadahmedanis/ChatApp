import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineSettings } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { SiGnuprivacyguard } from "react-icons/si";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async() => {
    const resultAction = await dispatch(logoutUser());
    if(logoutUser?.fulfilled?.match(resultAction)){
      navigate('/login');
    }
  }
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
     <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FiMessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}>
              <MdOutlineSettings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {JSON.parse(sessionStorage.getItem('user')) && 
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <LuUser className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="gap-2 btn btn-sm" onClick={logout}>
                  <LuLogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar