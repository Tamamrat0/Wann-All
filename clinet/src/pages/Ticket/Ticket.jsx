import React from 'react'
import {useContext ,  useState, useEffect } from "react";
import moment from 'moment';
import { useParams } from 'react-router-dom';

// UI LIBRARY
import Avatar  from "react-nice-avatar";
import {theme , Spin} from "antd";

// ICONS
import {IoIosArrowForward , IoIosClose} from "react-icons/io";
import {MdOutlineFiberNew} from "react-icons/md";
import {LuSearch} from "react-icons/lu";
import axios from 'axios';


// PATH FILE
import { Navigate, redirect } from "react-router-dom";
import { Link } from 'react-router-dom';
import {PageContext} from "../../PageContext";
import {UserContext} from "../../UserContext";
import { TicketConntext } from '../../TicketContext';
import UserList from "../../Components/UserList/UserList";
import AddTik from './AddTik'
import { FaSadCry } from 'react-icons/fa';
import Chat from './Chat';


export default function Ticket() {
    const {hidesidebar , darkmode  } = useContext(PageContext);
    const {listdepartment , user ,usersall ,socket} = useContext(UserContext);
    const {ticketlist ,  setTicketlist } = useContext(TicketConntext);
    const [addTik , setAddtik] = useState(false)
    const [themes , setThemes] = useState('')
    const [subdata , setSubdata] = useState(null)
    const [slicedata , setSlicedata] = useState(10)
    let [textsearch , setTextsearch] = useState('')
    let [results , setResults] = useState(null)
    const [assets , setAsstes] = useState(null)


    if (!user) {
       
        return <Navigate  to="/" />;
    }

    useEffect(()=>{
        const { darkAlgorithm , defaultAlgorithm} = theme;
        if(darkmode){
          
          setThemes({algorithm: [darkAlgorithm]})
        }else{
          setThemes({algorithm: [defaultAlgorithm]})
        }

        if(!assets && user){
            axios.post('/ticket/assets',{dept:user.department}).then(({data})=>{
                setAsstes(data)
              }).catch((err)=>{
                
              })
        }
      },[darkmode])



     if(socket){
        socket.on('receiveTickets', (data)=>{
            setSubdata(data)
        })
     }


useEffect(()=>{
    if(subdata){
        setTicketlist((prev)=> [subdata , ...prev  ])
        setSubdata(null)
    }
},[subdata])

const { id } = useParams();

function handleSearch(text){
    setTextsearch(text)
    if(textsearch.trim()){
        setResults(ticketlist.filter(item => item.tik_no.toLowerCase().includes(text) || item.tik_no.includes(text) || item.tik_subject.toLowerCase().includes(text)))
    }
}

useEffect(()=>{
    if(!textsearch){
        setResults(null)
    }
},[textsearch])


  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-0">

        <div className={`flex h-[calc(100vh-6rem-0.5rem)] w-[100%] lg:w-[18%] bg-white rounded-l-lg`}>
            <div className='flex flex-col w-full h-full border-r'>
                <div className='min-h-[80px] w-full flex items-center justify-between px-8  border-b shadow-md'>
                     <div className=' flex items-center gap-2'>
                         <span className='font-semibold text-xl'>Ticket</span>
                     <IoIosArrowForward className='rotate-90'/>
                     </div>
                     <button onClick={()=>setAddtik(!addTik)} className={`w-10 h-10 bg-primary rounded-full  items-center justify-center text-white text-xl ${user?.department === 'IT' || user?.department === 'PE' ? 'hidden' : 'flex'}`}>+</button>
                 </div>
                 <div className='flex flex-col overflow-auto scrollbar-hide'>
                    <div className='mt-2 mx-2 relative'>
                    <input
                    type='text'
                     value={textsearch}
                     onChange={(ev)=> handleSearch(ev.target.value) }
                    placeholder='ค้นหา ข้อความ'
                    className={` w-full px-8 text-sm focus:shadow-md h-8  flex-auto rounded-md border border-solid font-semibold 
                    border-gray-color dark:border-text-color bg-gray-color dark:bg-dark-second 
                    text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                    />
                    <div className='absolute top-2 left-2'><LuSearch/></div>
                    <div className={` top-[7px] right-2 ${textsearch ? 'absolute' : 'hidden'}`}><IoIosClose className='w-5 h-5 cursor-pointer' onClick={()=>setTextsearch('')}/></div>
                    </div>
                
                {(ticketlist && results  ? results : ticketlist?.slice(0, slicedata)).map((item)=>(
                // {ticketlist && ticketlist?.slice(0, slicedata).map((item)=>(
                <Link to={`/ticket/${item.id}`} key={item.id} 
                className={`${item.id === parseInt(id) ? 'bg-blue-200' : ''}  cursor-pointer mt-2 mx-1 rounded-lg py-2 px-2 flex flex-col items-center relative hover:bg-gray-color duration-300 `}>
                    <span className='absolute right-2 text-sm top-2'>{moment.utc(item.create_date).format('DD/MM/YY : HH:mm')}</span>
                    <span className='w-full mt-6 font-semibold '>#{item.tik_subject}</span>
                     <div className='flex w-full justify-between text-sm'>
                         <span>{item.tik_no}</span>
                         {user?.department === 'IT' || user?.department === 'PE' ? (
                            
                        <div className={`absolute flex gap-2 items-center right-2 bottom-2 text-sm`}>
                            <Avatar className="w-5 h-5  " {...JSON.parse(usersall && usersall.filter(i => i.user_account === item.create_by)?.map(user => user.avatar)[0])}/>
                            <span>{usersall && usersall.filter(i => i.user_account === item.create_by)?.map(user => user.firstname)[0]}</span>
                        </div>
                         ) : (
                            <div className={`absolute flex gap-2 items-center right-2 bottom-2 text-sm`}>ส่งถึง {item.tik_to}</div>
                         )}
                     </div>

                     <div className={`${user?.department === 'IT' || user?.department === 'PE' ? 'absolute' : 'hidden'}  ${item.already_read && !!user && JSON.parse(item.already_read).includes(user?.user_account) ? 'hidden' : ''} animate-bounce right-0 top-[40%] bg-primary rounded-md w-7 h-5 flex justify-center items-center text-white`}><MdOutlineFiberNew className='w-6 h-6'/></div>

                 </Link>
                         ))}
                         <div className={`flex items-center justify-center py-4 text-primary font-semibold ${results ? 'hidden' : ''}`}><a href="#" onClick={()=>setSlicedata((prev)=>prev+5)}>โหลดข้อมูลเพิ่มเติม</a></div>
                     
                 </div>

            </div>
            
        </div>
{/* CHAT HERE */}
<Chat assetsselect={assets} themes={themes}/>
        {/* RIGHT ZONE */}
        {addTik && (
        <AddTik user={user} open={addTik} setopen={setAddtik} themes={themes} listdepartment={listdepartment} setTicketlist={setTicketlist} socket={socket}/>
        )}
        <UserList/>
        </div>
  )
}

