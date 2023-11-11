import React from 'react'
import {useContext ,  useState, useEffect , Fragment } from "react";
import moment from 'moment';
import { useParams } from 'react-router-dom';


// UI LIBRARY
import Avatar  from "react-nice-avatar";
import {ConfigProvider , Select , Spin} from "antd";
// ICONS
import {TbClick} from "react-icons/tb";
import {TbRotateDot} from "react-icons/tb";
// PATH FILE
import {PageContext} from "../../PageContext";
import {UserContext} from "../../UserContext";
import { TicketConntext } from '../../TicketContext';
import UserList from "../../Components/UserList/UserList";
import AddTik from './AddTik'
import { FaSadCry } from 'react-icons/fa';
import axios from 'axios';


export default function Chat({assetsselect , themes}) {
    const { id } = useParams();
    const {hidesidebar , darkmode  } = useContext(PageContext);
    const {usersall , useronline , user} = useContext(UserContext);
    const {ticketlist ,  setTicketlist } = useContext(TicketConntext);
    let [datachat , setDatachat] = useState(null)


    // DATA UPDATE
    const [code , setCode] = useState('')
    const [type , setType] = useState('')
    const [subject , setSubject] = useState('')
    const [desc , SetDesc] = useState('')
    const [assets , setAssets] = useState('')


    // DATA RESULTS FROM SERVICE
     const [solvedetail , setSolvedetail] = useState(null)
     const [cause , setCause] = useState(null)
     const [parts , setPart] = useState(null)


    //  DATA MESSAGES 
    const [message , setMessage] = useState(null)
    const [statusname , setStatusname] = useState('')
    

    const forminput =  [
        {lable:'เลขที่ใบงาน' , description: 'เลือกลักษณะที่เกี่ยวข้องกับงานนี้', typeinput:'input' , value:code , onchange:setCode , ms_type:'all'},
        {lable:'ลักษณะงาน' , description: 'เลือกลักษณะที่เกี่ยวข้องกับงานนี้', typeinput:'radio' , value:type , onchange:setType , ms_type:'repair'},
        {lable:'เรื่อง / อาการ' , description: 'กรอกเรื่องหลักของการติดต่อ', typeinput:'input' , value:subject , onchange:setSubject , ms_type:'all'},
        {lable:'รายละเอียด' , description: 'กรอกรายละเอียดเพิ่มเติมเกี่ยวกับเรื่องที่ต้องการติดต่อ', typeinput:'area' , value:desc , onchange:SetDesc , ms_type:'all'},
        {lable:'ชื่อเครื่องจักร / อุปกรณ์' , description: 'เลือกเครื่องจักร หรือ อุปกรณ์ที่มีปัญหา (หากทราบ)', typeinput:'selectassets' , value:assets , onchange:setAssets , ms_type:'repair'},
    ]

    useEffect(()=>{
        if(id){
            setDatachat(ticketlist.filter(item => item.id === parseInt(id)).map(i => {
                const user = usersall.filter(f => f.user_account === i.create_by)[0]
                return{...i, avatar:user.avatar , username:user.firstname , dept:user.department , pos:user.position}
            })[0])
        }

        if(id ){
            const check_read = ticketlist.length > 0 && parseInt(id)  ?  JSON.parse(ticketlist.filter(item => item.id === parseInt(id))[0].already_read) : null
            if(!!check_read){
                if(!(!!user && ticketlist.length > 0 && check_read.includes(user.user_account))){
                    axios.post('/ticket/read' , {idticket:id}).then(({data})=>{
                        const updatedata = ticketlist.map(item => {
                            if(item.id === data[0].id){
                                return data[0];
                            }
                            return item;
                        })
                        setTicketlist(updatedata);
                    })
                }
            }else{
                axios.post('/ticket/read' , {idticket:id}).then(({data})=>{console.log(data[0].id)
                    
                    const updatedata = ticketlist.map(item => {
                        if(item.id === data[0].id){
                            return data[0];
                        }
                        return item;
                    })
                    setTicketlist(updatedata);

                        })
                        
        }

    }
    
},[id ])

useEffect(()=>{

    if(datachat){
        setCode(datachat.tik_no)
        setType(datachat.tik_typejob)
        setSubject(datachat.tik_subject)
        SetDesc(datachat.tik_description)
        setAssets(datachat.tik_assets)
    }

    if(datachat){
        axios.post('/message/chat' ,{tik_id:datachat.id , sender:datachat.create_by}).then(({data})=>{
            setMessage(data)
            console.log(data);
            // console.log(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text));
            setCode(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_no)
            setType(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_typejob)
            setSubject(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_subject)
            SetDesc(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_description)
            setAssets(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_assets)
        }).catch((err)=>{

        })


        if(datachat.status === 'open'){
            setStatusname('รอการรับเรื่อง')
        }else if (datachat.status === 'processing'){
            setStatusname('กำลังดำเนินการ')
        }else if (datachat.status === 'closing'){
            setStatusname('ปิดงาน')
        }

    }
},[datachat])

    console.log(datachat)
    console.log(message)
    function inputbox( value , onchange ){
        return(
            <div className="relative">
                <input
                type='text'
                value={value}
                disabled={true}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={` cursor-not-allowed w-full px-4 text-sm focus:shadow-md h-8  flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                />
            </div>
        )
    }

    function areabox(value , onchange ){
        return(
            <div className="relative">
                <textarea
                type='text'
                value={value}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={`px-4 py-2 w-[100%] text-sm focus:shadow-md h-24 flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                />
            </div>
        )
    }
    function radioinput(value , onchange ){
        return(
        <div className='flex w-full justify-around gap-2'>
        <label className='cursor-pointer flex items-center gap-2 '>
        <input
        className='w-4 h-4 cursor-pointer '
          type="radio"
          value="ซ่อม"
          checked={value === 'ซ่อม'}
          onChange={(ev) => onchange(ev.target.value)}
        />
        ซ่อม
      </label>

      <label className='cursor-pointer flex items-center gap-2'>
        <input
        className='w-4 h-4 cursor-pointer '
          type="radio"
          value="ปรับปรุง"
          checked={value === 'ปรับปรุง'}
          onChange={(ev) => onchange(ev.target.value)}
        />
        ปรับปรุง
      </label>

      <label className='cursor-pointer flex items-center gap-2'>
        <input
        className='w-4 h-4 cursor-pointer '
          type="radio"
          value="สร้าง"
          checked={value === 'สร้าง'}
          onChange={(ev) => onchange(ev.target.value)}
        />
        สร้าง
      </label>

      <label className='cursor-pointer flex items-center gap-2'>
        <input
        className='w-4 h-4 cursor-pointer '
          type="radio"
          value="ติดตั้ง"
          checked={value === 'ติดตั้ง'}
          onChange={(ev) => onchange(ev.target.value)}
        />
        ติดตั้ง
      </label>
            </div>
        )
    }
    function selectassetinput(){
        return(
            <ConfigProvider theme={themes}>
            <Select 
            value={assets}
            onChange={(ev)=>setAssets(ev)}
            placeholder="เลือก เครื่องจักร / อุปกรณ์"
            options={assetsselect?.map((item)=> ({
                    label:`${item.item_no} | ${item.item_name}`,
                    value:item.id
            }))}
            />
            </ConfigProvider>
        )
    }


  return (
    // <div className={`flex h-[calc(100vh-6rem-0.5rem)] w-[100%] lg:w-[18%] bg-white rounded-l-lg`}>

        <div className={`flex flex-col h-[calc(100vh-6rem-0.5rem)]  duration- bg-background dark:bg-dark-second text-text dark:text-dark-text-color ${hidesidebar ? 'w-[calc(100vw-33.3%)] lg:w-[calc(100vw-38.5%)]' : 'w-[calc(100vw-37%)] lg:w-[calc(100vw-50.7%)]'} rounded-r-lg`}>
        {/* <div className={`flex flex-col h-[calc(100vh-6rem-0.5rem)] bg-white duration-500 text-text dark:text-dark-text-color ${hidesidebar ? 'w-[calc(100vw-33.3%)] lg:w-[calc(100vw-38.5%)]' : 'w-[calc(100vw-33.3%)] lg:w-[calc(100vw-50.7%)]'} rounded-r-lg`}> */}
       {/* <div className={`flex h-[calc(100vh-6rem-0.5rem)] w-[85%] lg:w-[18%] bg-white rounded-l-lg`}> */}

        {id ? (
        <>
        <div className='min-h-[80px] w-full flex items-center justify-between px-8  border-b dark:border-dark-second shadow-md z-10  '>
                     <div className=' flex items-center gap-2'>
                         <span className='font-semibold text-xl'>{datachat?.tik_subject}</span>
                     </div>
                    {user?.department === 'IT' || user?.department === 'PE' ? (
                    <>
                    <div className={`flex flex-col items-start gap-1`}>
                    <span className='text-sm'>ผู้ติดต่อ</span>
                    <div className='flex gap-2'>
                        {datachat && (<Avatar className="w-10 h-10  " {...JSON.parse(datachat?.avatar)}/>)}
                        <div className='flex flex-col text-sm'>
                        <span>{datachat?.username}</span>
                        <span>{`${datachat?.dept} : ${datachat?.pos}`}</span>
                        </div>
                    </div>
                    </div></>
                    ):(
                        <>
                    <span className={`${datachat?.status === 'open' ? 'flex' : 'hiden'}`}>กำลังรอเจ้าหน้าที่รับเรื่อง...</span>
                    <div className={`${datachat?.status === 'open' ? 'hidden' : 'flex'} flex-col items-start gap-1`}>
                    <span className='text-sm'>เจ้าหน้าที่</span>
                    <div className='flex gap-2'>
                        {datachat && (<Avatar className="w-10 h-10  " {...JSON.parse(datachat?.avatar)}/>)}
                        <div className='flex flex-col text-sm'>
                        <span>{datachat?.username}</span>
                        <span>{`${datachat?.dept} : ${datachat?.pos}`}</span>
                        </div>
                    </div>
                    </div>
                        </>
                    )}
                  

            </div>
            <div className='flex flex-col items-center  h-[85%] justify-start py-7 w-full relative overflow-y-auto overflow-x-auto'>
                
                <div className=' w-60 h-60  rounded-full flex  justify-center items-center relative'>
                <div className='w-60 h-60  border-2  rounded-full flex justify-center items-center shadow-lg animate-spin shadow-cyan-500/50 dark:dark:bg-dark-second relative'>
                    <div className='absolute w-64 h-64  border-2 border-solid rounded-full  '></div>
                </div>
                <img className=' w-40 h-40 absolute ' src="../src/assets/open.gif"  alt="loading..." />
                </div>


                <div className=' w-full  top-[300px] left-0 right-0 bottom-2 flex flex-col absolute '>
                {message?.map((ms)=>{
                    return(
                        <Fragment key={ms.id}>
                        <div className={`w-full h-max flex gap-2 ${parseInt(ms.sender) === user.user_account ? 'justify-end' : 'justify-start'} `}>
                            <div className={`${parseInt(ms.sender) === user.user_account ? 'hidden' : 'flex'} `}><Avatar className="w-8 h-8 shadow-2xl ml-2 " {...JSON.parse(datachat?.avatar)}/></div>
                        {/* MESSAGE TYPE  DETAIL BOX  */}
                        <div>
                        <div className={`${ms.ms_type === 'detail' ? 'flex' : 'hidden'}  flex-col items-center gap-2 px-4 py-2 rounded-lg h-max w-max bg-gray-color dark:bg-dark-background`}>
                            <span className='font-semibold'>{`${datachat?.doc_type === 'problem' ? 'แจ้งปัญหา' : 'ใบแจ้งซ่อม'}`}</span>
                            <div className='grid grid-cols-2 gap-2  w-full '>
                            
                            {datachat && forminput?.map((item, index) => {
                                if(datachat.doc_type === item.ms_type || item.ms_type === 'all'){
                                    return (
                                        <Fragment key={index}>
                                    <div  className={`flex-col mt-2 flex`}>
                                        <h1 className={`font-semibold text-lg`}>
                                        {item.lable} 
                                        </h1>
                                      
                                    </div>
                                    {item.typeinput === 'input' && inputbox(item.value, item.onchange)}
                                    {item.typeinput === 'area' && areabox(item.value, item.onchange)}
                                    {item.typeinput === 'radio' && radioinput(item.value, item.onchange)}
                                    {item.typeinput === 'selectassets' && selectassetinput(item.value, item.onchange)}

                                        </Fragment>
                                    );
                                    }
                              
                                })}
                            </div>
                            </div>
                                <div className=' w-full flex items-center justify-between my-2 px-2'>
                                    <a href="#" className='font-semibold text-primary flex items-center gap-2'><TbRotateDot/>เปลี่ยนเป็น ใบแจ้งปัญหา</a>
                                    <button
                                        type="button"
                                        className={` hover:bg-blue-300 inline-flex  justify-center rounded-md  border border-transparent text-white bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                                        // onClick={() => HandleSave()}
                                        >
                                            บันทึก
                                        </button>
                                </div>
                        </div>
                        <div className={`${parseInt(ms.sender) !== user.user_account ? 'hidden' : 'flex'} `}><Avatar className="w-8 h-8 shadow-2xl ml-2 " {...JSON.parse(datachat?.avatar)}/></div>
                        {/* ----------------- */}
                    </div>

                    </Fragment>
                     )
                })}
                </div>

            </div>
            <div style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }} className='z-10  flex justify-around items-center border-t   dark:border-dark-second'>
            <div className=' w-full flex items-center justify-between my-2 px-2'>
                    <a href="#" className='font-semibold text-primary flex items-center gap-2'><TbRotateDot/>เปลี่ยนเป็น ใบแจ้งปัญหา</a>
                    <span className={`font-semibold`}>{`สถานะ : ${statusname}`}</span>
                    <button
                        type="button"
                        className={` hover:bg-blue-300 inline-flex  justify-center rounded-md  border border-transparent text-white bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        // onClick={() => HandleSave()}
                        >
                            รับงาน
                        </button>
                </div>
            </div>
            </>
        ):(
            <div className='w-full h-full flex justify-center items-center gap-2'>
                <TbClick className='w-20 h-20'/>
                <span className='text-2xl'>ไม่ได้เลือกแชท</span>
            </div>
            )}
        </div>
  )
}

