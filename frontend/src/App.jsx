import { useState, useEffect } from 'react'
import {Outlet, createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Uploads from './components/Uploads'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import { useAuth } from '../contexts/AuthContext'


// Create a Layout component
function Layout({ activeTab, setActiveTab }) {
  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Outlet /> {/* This renders the child routes */}
    </>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const {
    setAccount
  } = useAuth()
  useEffect(() => {
    const user = localStorage.getItem("User")
    if(user) setAccount(user);
  
  }, [])
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout activeTab={activeTab} setActiveTab={setActiveTab} />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/uploads" element={<Uploads activeTab={activeTab} setActiveTab={setActiveTab}/>} />
      </Route>
    )
  ) 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App