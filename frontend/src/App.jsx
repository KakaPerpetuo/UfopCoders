import { Routes, Route } from 'react-router-dom'
import Login from './page/login/Login'
import Landing from './page/landing/Landing'
import Register from './page/register/Register'
import Dashboard from './page/dashboard/Dashboard'
import Profile from './page/profile/Profile'
import EditProfile from './page/profile/EditProfile'
import Discover from './page/discover/Discover'
import CreateProject from './page/createProject/CreateProject'
import './App.css'

export function Home() {
  return <Landing />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/createProject" element={<CreateProject />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/discover" element={<Discover />} />
    </Routes>
  )
}

export default App