import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User2 } from 'lucide-react';
import logo from '../assets/project-logo.svg';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { account, setAccount } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAccount(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed!");
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Logo"
              className="shadow-xl shadow-blue-500 h-12 rounded-[80px] w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
            />
            <div>
              <Link to="/">
                <h1 className="text-3xl font-bold">
                  <span className="text-4xl font-extrabold">Urja</span>
                  <span className="text-4xl text-sky-500">Lytics</span>
                </h1>
              </Link>
              <p className="text-blue-200 text-sm">Intelligent FRA Diagnostic Platform</p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6 text-sm">
            
            {account ? (
              <>
                <User2 className="w-6 h-6" />
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Sign In
                </button>
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
