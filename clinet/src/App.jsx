
import axios from 'axios';
import './App.css'
import Dashboard from './pages/Dashboard/Dashboard'
import Users from './pages/UsersPage/Users'
import {  BrowserRouter ,Route ,Routes , useLocation } from "react-router-dom";
import { UserContextProvider  } from "./UserContext";
import { PageContextProvider  } from "./PageContext";
import { AdminContextProvider  } from "./AdminContext";
import { TicketContextProvider  } from "./TicketContext";
import Ticket from './pages/Ticket/Ticket';
import Profile from './pages/ProfilePage/Profile';
import Permission from './pages/PermissionPage/Permission';
import Layout from './Components/Layout';
import Asset from './pages/AssetPage/Asset'




function App() {
  axios.defaults.baseURL = 'http://localhost:3333';
  axios.defaults.withCredentials  = true;
  

  return (
    <UserContextProvider >
    <PageContextProvider >
    <AdminContextProvider >
    <TicketContextProvider >
    <BrowserRouter>
    <Routes> 
      <Route path='/' element={<Layout/>}>
        <Route index element={<Dashboard />} />
        
        <Route path="/ticket" element = {<Ticket />}/> 
        <Route path="/users" element = {<Users />}/> 
        <Route path="/profile" element = {<Profile/>}/> 
        <Route path="/permission" element = {<Permission />}/> 
        <Route path="/assets" element = {<Asset />}/> 
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="*" element = {<Dashboard/>}/> 
      </Route>
    </Routes>
  </BrowserRouter>
  </TicketContextProvider>
  </AdminContextProvider>
  </PageContextProvider>
  </UserContextProvider>
  )
}

export default App
