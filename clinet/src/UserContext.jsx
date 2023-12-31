import { createContext, useEffect, useState } from "react";
import {message } from 'antd';
import axios from 'axios';
import io from 'socket.io-client';

export const UserContext  = createContext({});

export function UserContextProvider({children}){
    const [user,setUser] = useState(null);
    const [usersall,setUsersall] = useState(null);
    let [useronline,setUseronline] = useState([]);
    const [listdepartment, setListepartment] = useState([]);
    const [listposition, setListPosition] = useState([]);
    const [assets , setAssets] = useState(null) 
    const [notifylogin,setNotifylogin] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    let [socket,setSocket] = useState(null);
    
    // let socket = null
    
    useEffect(()=>{
      // console.log(user)
    if(user){
      const newSocket = io.connect('http://localhost:3333', {
        query: `username=${user.firstname}&userId=${user.id}&dept=${user.department}`,
    });
      setSocket(newSocket);
    }

    },[user ])

    if(socket){
      console.log(socket)
      socket.on('userOnline', (userId) => {
         setUseronline(userId.map(item => item.id));
 
      });

      socket.on('userOffline', (userId) => {
        setUseronline(userId.map(item => item.id));
      });
    }


    useEffect(() => {

      const getuser = async () => {
        try{
          const response = await axios.get('/users/auth')
          setUser(response.data)
        }catch(err){
          setUser(null);
        }
      }

      const getdep = async () => {
        try{
          const response = await axios.get('/auth/department')
          setListepartment(response.data.department);
          setListPosition(response.data.position);
        }catch(err){
          
        }
      }

      const getUsersAll = async () => {
        try{

          const response = await axios.get('/users/usersacc')
          setUsersall(response.data);
        }catch(err){

        }
      }

      const getAssetS = async () =>{
        try{
          const response = await axios.post('/assets/ticketAsset' , {dept:user.department})
          setAssets(response.data)
        }catch(err){
        }
      }

        if (!user) {
          getuser()
        }

        if(listdepartment.length === 0 || listposition.length === 0){
          getdep()
        }

        if (!usersall && user) {
          getUsersAll()
        }

        if(user && !assets){
          getAssetS()
        }
        
      }, [user]);

    return( 
        <UserContext.Provider value={{user , setUser , notifylogin, setNotifylogin ,messageApi , contextHolder , socket , listdepartment , listposition ,usersall ,useronline}}>
            {children}
        </UserContext.Provider>

    )
}
