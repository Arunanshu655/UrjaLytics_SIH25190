import React, { useEffect, useState } from 'react';
import { Zap, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

import { auth } from '../firebase';

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // useEffect(() => {
  //   console.log(auth)
  // }, [])

  const navigate = useNavigate();
  
  const {
    account,
    setAccount
  } = useAuth()

  // const handleSignIn = () => {
  //   setError('');
  //   setSuccess('');
    
  //   if (!email || !password) {
  //     setError('Please fill in all fields');
  //     return;
  //   }

  //   if (!/\S+@\S+\.\S+/.test(email)) {
  //     setError('Please enter a valid email address');
  //     return;
  //   }
    
  //   setSuccess('Sign in successful! Redirecting...');
  //   console.log('Sign In:', { email, password, rememberMe });
  // };

  // const handleSignUp = () => {
  //   setError('');
  //   setSuccess('');
    
  //   if (!name || !email || !password || !confirmPassword) {
  //     setError('Please fill in all fields');
  //     return;
  //   }

  //   if (!/\S+@\S+\.\S+/.test(email)) {
  //     setError('Please enter a valid email address');
  //     return;
  //   }

  //   if (password.length < 8) {
  //     setError('Password must be at least 8 characters long');
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setError('Passwords do not match');
  //     return;
  //   }
    
  //   setSuccess('Account created successfully! Please sign in.');
  //   console.log('Sign Up:', { name, email, password });
  //   setTimeout(() => {
  //     setIsSignIn(true);
  //     setSuccess('');
  //     setPassword('');
  //     setConfirmPassword('');
  //   }, 2000);
  // };

const handleSignUp = async () => {
  // console.log(email)
  //   console.log(password)
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });
    
    console.log(user)
    setAccount(user)
    toast.success(`Welcome, ${name}! Your account was created.`);
    console.log("User signed up:", user);
    localStorage.setItem("User",user)
    navigate("/uploads")
  } catch (error) {
    toast.error(`Sign-up failed: ${error.message}`);
    console.error("Error signing up:", error.message);
  }
};

const handleSignIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user)
    setAccount(user)
    toast.success(`Welcome back, ${user.displayName || 'User'}!`);
    console.log("User signed in:", user);
    localStorage.setItem("User",user)
    navigate("/uploads")
  } catch (error) {
    toast.error(`Sign-in failed: ${error.message}`);
    console.error("Error signing in:", error.message);
  }
};

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Sign In/Sign Up Form */}
      <div className="flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Toggle Tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  isSignIn 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  !isSignIn 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignIn ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isSignIn 
                  ? 'Sign in to access your dashboard' 
                  : 'Join us to start analyzing transformer data'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Name Field (Sign Up Only) */}
              {!isSignIn && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {!isSignIn && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me (Sign In Only) */}
              {isSignIn && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    onClick={() => console.log('Forgot password clicked')}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={isSignIn ? handleSignIn : handleSignUp}
                className="w-full py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                {isSignIn ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={toggleMode}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Secure Login</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">24/7 Access</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Data Protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;