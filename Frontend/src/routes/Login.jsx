import React, { useActionState, useState } from 'react'
import { FiMessageSquare } from "react-icons/fi";
import { GoLock } from "react-icons/go";
import { FaRegEnvelope, FaRegEyeSlash } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { BiLoaderCircle } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { me, signinUser } from '../redux/slices/authSlice';

function Login() {
  const[showPassword, setShowPassword] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(state => state?.auth?.isLoading);
  const[user, submitAction, isPending] = useActionState(async (previousState, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    // Field Validations       
    if (!email) {
        toast.error("Email is required");
        return null;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        toast.error("Invalid email format");
        return null;
    }
    if (!password) {
        toast.error("Password is required");
        return null;
    } else if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return null;
    }
    
    // Api calling
    const payload = { email, password};
    if(payload.email.length && payload.password.length){
      const resultAction = await dispatch(signinUser(payload));
      if(signinUser?.fulfilled?.match(resultAction)){
        await dispatch(me());
        // navigate('/');
      }
    }
  })

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* logo */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <FiMessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
              <p className='text-base-content/60'>Login to your account</p>
            </div>
          </div>
          <form action={submitAction} className='space-y-6'>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRegEnvelope className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="jogndoe@gmail.com"
                  name='email'
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GoLock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  name='password'
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <IoEyeOutline className="size-5 text-base-content/40" />
                  ) : (
                    <FaRegEyeSlash className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
              {isLoading ? (
                <>
                  <BiLoaderCircle className="size-7 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Dont't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern title="Welcome back!"
        subtitle="Login to countinue your conversations and catch up with your message" 
      />

    </div>
  )
}

export default Login