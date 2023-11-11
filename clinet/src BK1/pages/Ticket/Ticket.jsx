import React from 'react'
import {useContext ,  useState, useEffect } from "react";
import moment from 'moment';


// UI LIBRARY
import Avatar  from "react-nice-avatar";
import {theme , Spin} from "antd";
// ICONS
import {IoIosArrowForward} from "react-icons/io";
import {MdOutlineFiberNew} from "react-icons/md";
// PATH FILE
import {PageContext} from "../../PageContext";
import {UserContext} from "../../UserContext";
import { TicketConntext } from '../../TicketContext';
import UserList from "../../Components/UserList/UserList";
import AddTik from './AddTik'
import { FaSadCry } from 'react-icons/fa';


export default function Ticket() {
    const {hidesidebar , darkmode  } = useContext(PageContext);
    const {listdepartment , user ,usersall ,socket} = useContext(UserContext);
    const {ticketlist ,  setTicketlist } = useContext(TicketConntext);
    const [addTik , setAddtik] = useState(false)
    const [themes , setThemes] = useState('')


    // const newSocket = io.connect('http://localhost:3333', {
    //     query: `username=${user.firstname}&userId=${user.id}&dept=${user.department}`,
    // });
    //   setSocket(newSocket);
   
    // console.log(ticketlist.some(item => item.id === 44))
    // console.log(usersall.filter(i => i.user_account === 22)?.map(user => user.firstname)[0])
    useEffect(()=>{
        const { darkAlgorithm , defaultAlgorithm} = theme;
        if(darkmode){
          
          setThemes({algorithm: [darkAlgorithm]})
        }else{
          setThemes({algorithm: [defaultAlgorithm]})
        }
      },[darkmode])



     if(socket){
        socket.on('receiveTickets', (data)=>{
            console.log(typeof data.id)
             if(!ticketlist.some(item => item.id === data.id)){
                setTicketlist((prev)=> [data , ...prev  ])
             }
        })
     }
    //  console.log(ticketlist.map(o => o.id))
    //  console.log(ticketlist.some(item => item.id === 551))





  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-0">

        <div className={`flex h-[calc(100vh-6rem-0.5rem)] w-[85%] lg:w-[18%] bg-white rounded-l-lg`}>
            <div className='flex flex-col w-full h-full border-r'>
                <div className='min-h-[80px] w-full flex items-center justify-between px-8  border-b'>
                     <div className=' flex items-center gap-2'>
                         <span className='font-semibold text-xl'>Ticket</span>
                     <IoIosArrowForward className='rotate-90'/>
                     </div>
                     <button onClick={()=>setAddtik(!addTik)} className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl'>+</button>
                 </div>
                 <div className='flex flex-col overflow-auto'>
                         {ticketlist && ticketlist?.map((item)=>(
                <div key={item.id} className=' cursor-pointer mt-2 mx-1 rounded-lg py-2 px-2 flex flex-col items-center relative hover:bg-gray-color duration-300'>
                    <span className='absolute right-2 text-sm top-2'>{moment(item.create_date).format('DD/MM/YY : HH:mm')}</span>
                    <span className='w-full mt-6 font-semibold '>#{item.tik_subject}</span>
                     <div className='flex w-full justify-between text-sm'>
                         <span>{item.tik_no}</span>
                         {user?.department === 'IT' || user?.department === 'PE' ? (
                            
                        <div className={`absolute flex gap-2 items-center right-2 bottom-2 text-sm`}>
                            <Avatar className="w-5 h-5  " {...JSON.parse(usersall && usersall.filter(i => i.user_account === item.create_by)?.map(user => user.avatar)[0])}/>
                            <span>{usersall && usersall.filter(i => i.user_account === item.create_by)?.map(user => user.firstname)[0]}</span>
                        </div>
                         ) : (
                            <div className={`absolute flex gap-2 items-center right-2 bottom-2 text-sm`}>To {item.tik_to}</div>
                         )}
                     </div>
                     <div className={`${user?.department === 'IT' || user?.department === 'PE' ? 'absolute' : 'hidden'}  animate-bounce right-0 top-[40%] bg-primary rounded-md w-7 h-5 flex justify-center items-center text-white`}><MdOutlineFiberNew className='w-6 h-6'/></div>

                 </div>
                         ))}
                 </div>

            </div>
            
        </div>
        <div className={`flex flex-col bg-white duration-500 ${hidesidebar ? 'w-[calc(100vw-33.3%)] lg:w-[calc(100vw-38.5%)]' : 'w-[calc(100vw-33.3%)] lg:w-[calc(100vw-50.7%)]'} rounded-r-lg`}>
        <div className='min-h-[80px] w-full flex items-center justify-between px-8  border-b  '>
                     <div className=' flex items-center gap-2'>
                         <span className='font-semibold text-xl'>Ticket</span>
                
                     </div>
                     <button onClick={()=>setAddtik(!addTik)} className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl'>+</button>
            </div>
            <div className='flex items-center h-full justify-center'>
            <Spin spinning={false}>
                s
            </Spin>
            </div>
        </div>

        {/* RIGHT ZONE */}
        <AddTik open={addTik} setopen={setAddtik} themes={themes} listdepartment={listdepartment} setTicketlist={setTicketlist} socket={socket}/>
        <UserList/>
        </div>
  )
}



        // {/* LEFT ZONE */}
        // <div className={`${hidesidebar ? 'ml-[110px] w-[81%]' : 'ml-[110px] lg:ml-68.5 w-[72.5%]'}   flex flex-col lg:flex-row fixed top-[135px] left-0 lg:top-[6rem] bottom-2   bg-background dark:bg-dark-second text-text dark:text-dark-text-color rounded-md overflow-auto duration-500`}>
        //     <div className='absolute top-[80px] w-full border-b-2 dark:border-dark-background'></div>
        //     <div className='absolute left-[20%] h-full border-r-2 dark:border-dark-background'></div>


        //     {/* TICKET LIST */}
        //     <div className='flex flex-col w-[20%]'>
        //         {/* HEADER  */}
        //         <div className='h-[80px] w-full flex items-center justify-between px-8 '>
        //             <div className=' flex items-center gap-2'>
        //                 <span className='font-semibold text-xl'>Ticket</span>
        //             <IoIosArrowForward className='rotate-90'/>
        //             </div>
        //             <button onClick={()=>setAddtik(!addTik)} className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl'>+</button>
        //         </div>

        //         {/* LIST */}
        //         {ticketlist?.map((item)=>(
        //             <div key={item.id} className='cursor-pointer mt-2 mx-1 rounded-lg py-2 px-2 flex flex-col items-center relative hover:bg-gray-color duration-300'>
        //             <span className='absolute right-2 text-sm top-2'>{moment(item.create_date).format('DD/MM/YY : HH:mm')}</span>
        //             <span className='w-full mt-4 font-semibold'>#{item.tik_subject}</span>
        //             <div className='flex w-full justify-between text-sm'>
        //                 <span>{item.tik_no}</span>
        //                 <span>To {item.tik_to}</span>
        //             </div>
        //             <div className={`${user?.department === 'IT' || user?.department === 'PE' ? 'absolute' : 'hidden'}  animate-bounce right-0 top-[40%] bg-primary rounded-md w-7 h-5 flex justify-center items-center text-white`}><MdOutlineFiberNew className='w-6 h-6'/></div>
        //         </div>
        //                 ))}
                 

        //     </div>

        //     <AddTik open={addTik} setopen={setAddtik} themes={themes} listdepartment={listdepartment} setTicketlsit={setTicketlsit}/>
        //     {/* <AddTik/> */}


        // </div>