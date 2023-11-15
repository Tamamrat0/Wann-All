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
import { IoClose , IoCheckmarkSharp  } from "react-icons/io5";
import { BiCircle  } from "react-icons/bi";

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
     const [solvedetail , setSolvedetail] = useState('')
     const [cause , setCause] = useState('')
     const [parts , setPart] = useState('')
     const [af_solvedetail , setAf_Solvedetail] = useState('')
     const [af_cause , setAf_cause] = useState('')
     const [af_parts , setAf_part] = useState('')


    //  DATA MESSAGES 
    const [message , setMessage] = useState(null)
    const [statusname , setStatusname] = useState('')
    const [onupdate , setOnupdate] = useState('')
    const [official , setOfficial] = useState('')


    // APPROVED STATUS
    const [approved , setApproved] = useState(null)
    const [appdetail , setAppdetail] = useState('')
    const [selectapp , setSelectapp] = useState(null)

    //COUNT  TIME
    const [elapsedTime, setElapsedTime] = useState(moment.duration());

    let days = elapsedTime.days();
    let hours = elapsedTime.hours();
    let minutes = elapsedTime.minutes();
    let seconds = elapsedTime.seconds();
  

    const forminput =  [
        {lable:'เลขที่ใบงาน' , description: 'เลือกลักษณะที่เกี่ยวข้องกับงานนี้', typeinput:'input' , value:code , onchange:setCode , ms_type:'all'},
        {lable:'ลักษณะงาน' , description: 'เลือกลักษณะที่เกี่ยวข้องกับงานนี้', typeinput:'radio' , value:type , onchange:setType , ms_type:'repair'},
        {lable:'เรื่อง / อาการ' , description: 'กรอกเรื่องหลักของการติดต่อ', typeinput:'input' , value:subject , onchange:setSubject , ms_type:'all'},
        {lable:'รายละเอียด' , description: 'กรอกรายละเอียดเพิ่มเติมเกี่ยวกับเรื่องที่ต้องการติดต่อ', typeinput:'area' , value:desc , onchange:SetDesc , ms_type:'all'},
        {lable:'ชื่อเครื่องจักร / อุปกรณ์' , description: 'เลือกเครื่องจักร หรือ อุปกรณ์ที่มีปัญหา (หากทราบ)', typeinput:'selectassets' , value:assets , onchange:setAssets , ms_type:'repair'},
    ]

    const formresponse = [
        {lable:'สาเหตุ *' , description: 'เลือกลักษณะที่เกี่ยวข้องกับงานนี้', typeinput:'area' , value:cause , onchange:setCause , af_value:af_cause , af_onchange:setAf_cause },
        {lable:'รายละเอียดการแก้ไข' , description: 'เลือกลักษณะที่เกี่ยวข้องกับงานนี้', typeinput:'area' , value:solvedetail , onchange:setSolvedetail , af_value:af_solvedetail , af_onchange:setAf_Solvedetail },
        {lable:'อะไหล่ / จำนวน' , description: 'กรอกเรื่องหลักของการติดต่อ', typeinput:'area' , value:parts , onchange:setPart , af_value:af_parts , af_onchange:setAf_part },
    ]

useEffect(()=>{
        if(id){
            setDatachat(ticketlist.filter(item => item.id === parseInt(id)).map(i => {
                const user = usersall.filter(f => f.user_account === i.create_by)[0]
                return{...i, avatar:user.avatar , username:user.firstname , dept:user.department , pos:user.position}
            })[0])
        }

        if(id){
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
    setSelectapp(null)
    setAppdetail('')
    setApproved(null)



},[id , ticketlist])

useEffect(()=>{

    if(datachat){
        setCode(datachat.tik_no)
        setType(datachat.tik_typejob)
        setSubject(datachat.tik_subject)
        SetDesc(datachat.tik_description)
        setAssets(datachat.tik_assets)
        if(datachat?.tik_cause){
            setCause(datachat?.tik_cause ? datachat?.tik_cause : '')
            setSolvedetail(datachat?.tik_solvedetail ? datachat?.tik_solvedetail : '')
            setPart(datachat?.tik_parts ? datachat?.tik_parts : '')
        }else{
            setCause('')
            setSolvedetail('')
            setPart('')

        }

    }

    if(datachat){
        axios.post('/message/chat' ,{tik_id:datachat.id , sender:datachat.create_by}).then(({data})=>{
            setMessage(data)
            setCode(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_no)
            setType(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_typejob)
            setSubject(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_subject)
            SetDesc(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_description)
            setAssets(JSON.parse(data.filter(item => item.ms_type === 'detail' )[0].text).tik_assets)
            setAf_cause(JSON.parse(data.filter(item => item.ms_type === 'summary' )[0].text).tik_cause)
            setAf_Solvedetail(JSON.parse(data.filter(item => item.ms_type === 'summary' )[0].text).tik_solvedetail)
            setAf_part(JSON.parse(data.filter(item => item.ms_type === 'summary' )[0].text).tik_parts)

        }).catch((err)=>{

        })


        if(datachat.status === 'open'){
            setStatusname('รอการรับเรื่อง')
        }else if (datachat.status === 'inprocess' || datachat.status === 'summary'){
            setStatusname('กำลังดำเนินการ')
        }else if (datachat.status === 'close'){
            setStatusname('ปิดงาน')
        }

    }

    if(datachat){
        if(datachat.recipient_by){
            setOfficial(usersall?.filter(item => item.user_account === datachat.recipient_by)[0])
        }
    }

    if(datachat?.recipient_date && (datachat?.status === 'inprocess' || datachat.status === 'summary')){
        const startTime = moment.utc(datachat?.recipient_date).format('YYYY-MM-DD HH:mm:ss');
        const updateElapsedTime = () => {
            const duration = moment.duration(moment().diff(startTime));
            setElapsedTime(duration);
        };

        updateElapsedTime(); // เรียกฟังก์ชันครั้งแรกเพื่อเป็นการเริ่มต้นการนับเวลา
        
        const interval = setInterval(updateElapsedTime, 1000); // นับเวลาทุกๆ 1 วินาที
        
        return () => clearInterval(interval); // cleanup เมื่อ component unmount

    }




},[datachat])
console.log(datachat)
    function inputbox( value , onchange , dis){
        return(
            <div className="relative">
                <input
                type='text'
                value={value}
                disabled={dis}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={`${dis && 'cursor-not-allowed'} w-full px-4 text-sm focus:shadow-md h-8  flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                />
            </div>
        )
    }
    function areabox(value , onchange , dis){
        return(
            <div className="relative">
                <textarea
                type='text'
                value={value}
                disabled={dis}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={`${dis && 'cursor-not-allowed'} px-4 py-2 w-[100%] text-sm focus:shadow-md h-20 flex-auto rounded-md border border-solid font-semibold
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
    function HandleinProcess(){
        const t_id = datachat.id
        axios.post('/message/inprocess' ,{t_id , sender:datachat.tik_to , receiver:datachat.create_by}).then(({data})=>{
            console.log(data)
            // setDatachat({...datachat , ...data[0]})
            setTicketlist(ticketlist.map(item => (item.id === data[0].id ? { ...item, ...data[0] } : item)))
            // setOfficial(usersall?.filter(item => item.user_account === data[0].closing_by))
        }).catch((err)=>{

        })
    }


    function handlechangetype(){
        if(datachat?.doc_type === 'problem'){
            setDatachat({ ...datachat, doc_type: 'repair' });
        }else{
            setDatachat({ ...datachat, doc_type: 'problem' });
        }
    }
    function handleUpdatetype(){
        setOnupdate(true)
    }
    function handleApproved(){
        if(selectapp==='yes'){
            setApproved(true)

            axios.post('/ticket/approved' ,{selectapp , t_id:id , sender:datachat.tik_to , receiver:datachat.create_by }).then(({data})=>{
                console.log(data)
                // setDatachat({...datachat , ...data[0]})
                setTicketlist(ticketlist.map(item => (item.id === data[0].id ? { ...item, ...data[0] } : item)))
            }).catch((err)=>{

            })
        }else if(selectapp === 'no' && appdetail.trim()){
            setApproved(false)

            axios.post('/ticket/approved' ,{selectapp , t_id:id , appdetail , sender:datachat.tik_to , receiver:datachat.create_by }).then(({data})=>{
                console.log(data)
                // setDatachat({...datachat , ...data[0]})
                setTicketlist(ticketlist.map(item => (item.id === data[0].id ? { ...item, ...data[0] } : item)))
            }).catch((err)=>{

            })
        }
    }
    function handleCauseSave(){
        if(cause.trim()){
            axios.post('/ticket/summary' , {t_id:id , cause , parts , solvedetail}).then(({data})=>{
                setTicketlist(ticketlist.map(item => (item.id === data[0].id ? { ...item, ...data[0] } : item)))
            }).then((err)=>{

            })
        }
    }
    function handleCauseSend(){
        if(datachat?.tik_cause && datachat?.tik_approved){
            axios.post('/message/summary' , {t_id:id , sender:datachat.tik_to , receiver:datachat.create_by}).then(({data})=>{
                setTicketlist(ticketlist.map(item => (item.id === data[0].id ? { ...item, ...data[0] } : item)))
            }).then((err)=>{

            })
        }
    }

  return (
        <div className={`flex flex-col h-[calc(100vh-6rem-0.5rem)]  duration- bg-background dark:bg-dark-second text-text dark:text-dark-text-color ${hidesidebar ? 'w-[calc(100vw-33.3%)] lg:w-[calc(100vw-38.5%)]' : 'w-[calc(100vw-37%)] lg:w-[calc(100vw-50.7%)]'} rounded-r-lg`}>

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
                    <span className={`${datachat?.status === 'open' ? 'flex' : 'hidden'}`}>กำลังรอเจ้าหน้าที่รับเรื่อง...</span>
                    <div className={`${datachat?.status === 'open' ? 'hidden' : 'flex'} flex-col items-start gap-1`}>
                    <span className='text-sm'>เจ้าหน้าที่</span>
                    <div className='flex gap-2'>
                        {official && (<Avatar className="w-10 h-10  " {...JSON.parse(official?.avatar)}/>)}
                        <div className='flex flex-col text-sm'>
                        <span>{official?.firstname}</span>
                        <span>{`${official?.department} : ${official?.position}`}</span>
                        </div>
                    </div>
                    </div>
                        </>
                    )}
                  

            </div>
            <div className='flex flex-col h-[85%] justify-start relative overflow-y-auto  overflow-x-auto'>
                
                {/* <div className=' w-60 h-60  rounded-full flex  justify-center items-center relative'>
                <div className='w-60 h-60  border-2  rounded-full flex justify-center items-center shadow-lg animate-spin shadow-cyan-500/50 dark:dark:bg-dark-second relative'>
                    <div className='absolute w-64 h-64  border-2 border-solid rounded-full  '></div>
                </div>
                <img className=' w-40 h-40 absolute ' src="../src/assets/open.gif"  alt="loading..." />
                </div> */}


                {/* <div className=' w-full  top-[300px] left-0 right-0 bottom-2 flex flex-col absolute '> */}
                <div className=' top-5 left-0 w-full right-0 bottom-2 flex flex-col gap-2  py-4'>
                {message?.map((ms , index)=>{
                    return(
                        <Fragment key={index}>
                        <div className={`h-max  flex ${(parseInt(ms.sender) === user.user_account || ms.sender === user.department) ? 'justify-end mr-4' : 'justify-start ml-4'}  `}>
                    
                        <div className={`${(parseInt(ms.sender) === user.user_account || ms.sender === user.department) ? 'hidden' : 'flex'} `}>{official && <Avatar className="w-8 h-8 shadow-2xl mr-4" {...JSON.parse(official?.avatar)}/> }</div>
                        
                        
                        {/* MESSAGE TYPE  DETAIL BOX  */}
                        <div className={`${ms.ms_type === 'detail' ? 'flex' : 'hidden'} flex relative flex-col items-end  h-max  mx-2 `}>
                        <div className={`  relative flex-col items-center gap-2 px-4 py-4 rounded-lg h-max w-max bg-gray-color dark:bg-dark-background shadow-md `}>
                            <div className='flex justify-center items-center my-2'>
                            <span className='font-semibold text-xl'>{`${datachat?.doc_type === 'problem' ? 'แจ้งปัญหา' : 'ใบแจ้งซ่อม'}`}</span>
                            </div>
                            <div className='grid grid-cols-1  gap-2  w-full  '>
                            
                            {datachat && forminput?.map((item, index) => {
                                if(datachat.doc_type === item.ms_type || item.ms_type === 'all'){
                                    return (
                                        <Fragment key={index}>
                                    <div  className={`flex-col mt-2 flex`}>
                                        <h1 className={`font-semibold`}>
                                        {item.lable} 
                                        </h1>
                                      
                                    </div>
                                    {item.typeinput === 'input' && inputbox(item.value, item.onchange , true)}
                                    {item.typeinput === 'area' && areabox(item.value, item.onchange , true)}
                                    {item.typeinput === 'radio' && radioinput(item.value, item.onchange )}
                                    {item.typeinput === 'selectassets' && selectassetinput(item.value, item.onchange)}
                                        </Fragment>
                                    );
                                    }
                              
                                })}
                            </div>
                        </div>
                            <div className={`${ms.ms_type === 'detail' ? 'flex' : 'hidden'} text-sm mt-1 `}> {moment.utc(datachat.create_date).format('DD/MM/YYYY : HH:mm')}</div>
                            {/* 
                            {(user?.department === 'IT' || user?.department === 'PE') && (datachat?.status === 'inprocess') && (ms.ms_type === 'detail') && (
                                <div className=' w-full flex items-center justify-between mt-6 px-2'>
                                    <a href="#" onClick={()=>handlechangetype()} className='font-semibold text-primary flex items-center gap-2 '><TbRotateDot className='hover:rotate-180 duration-500'/>เปลี่ยนเป็น {`${datachat?.doc_type !== 'problem' ? 'ใบแจ้งปัญหา' : 'ใบแจ้งซ่อม'}`}</a>
                                    <button
                                        type="button"
                                        disabled={datachat?.doc_type === 'problem' ? '' : ''}
                                        className={` hover:bg-blue-300 inline-flex  justify-center rounded-md  border border-transparent text-white bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                                        // onClick={() => HandleSave()}
                                        >
                                            บันทึก
                                    </button>
                                </div>
                            )} */}
                        </div>
                        {/* <div className={`${parseInt(ms.sender) !== user.user_account ? 'hidden' : 'flex'} `}><Avatar className="w-8 h-8 shadow-2xl ml-2 " {...JSON.parse(datachat?.avatar)}/></div> */}
                        {/* ----------------- */}

                        {/* SUMMARY TYPE  DETAIL BOX  */}
                        <div className={`${ms.ms_type === 'summary' ? 'flex' : 'hidden'} flex relative flex-col items-end  h-max  mx-2 `}>
                        <div className={`  relative flex-col items-center gap-2 px-4 py-4 rounded-lg h-max w-max bg-gray-color dark:bg-dark-background shadow-md `}>
                            <div className='flex justify-center items-center my-2'>
                            <span className='font-semibold text-xl'>สรุปผล</span>
                            </div>
                            <div className='grid grid-cols-1  gap-2  w-full  '>
                            {datachat && formresponse?.map((item, index) => {
 
                                    return (
                                        <Fragment key={index}>
                                    <div  className={`flex-col mt-2 flex`}>
                                        <h1 className={`font-semibold`}>
                                        {item.lable} 
                                        </h1>
                                      
                                    </div>
                                    {item.typeinput === 'area' && areabox(item.af_value, item.af_onchange , true)}
                                        </Fragment>
                                    );
                                    }
                              
                                )}
                            </div>
                        </div>
                            <div className={`${ms.ms_type === 'summary' ? 'flex' : 'hidden'} text-sm mt-1 `}> {moment.utc(datachat.create_date).format('DD/MM/YYYY : HH:mm')}</div>
                        </div>
                        {/* ----------------- */}


                        {/* STATUS TEXT */}
                        <div className={`${ms.ms_type === 'status' ? 'flex' : 'hidden'}  relative flex-col items-end   h-max w-max`}>
                            <div className='bg-gray-color dark:bg-dark-background px-4 py-2 rounded-lg shadow-md'>
                            <span>{ms.text}</span>
                            </div>
                            <div className='text-sm mt-1'>{moment.utc(ms.create_date).format('DD/MM/YYYY : HH:mm')}</div>
                        </div>
                        {/* ----------------- */}

                    </div>

                    </Fragment>
                     )
                })}


                {/* CAUSE  TEXT*/}
                 <div className={`${(datachat?.status === 'inprocess' && (user?.department === 'IT' || user?.department === 'PE')) ? 'mb-20 flex flex-col' : 'hidden'} items-center mr-4 `}>
                    <div className='shadow-md flex flex-col items-center gap-2 px-4 py-2 rounded-lg h-max w-max bg-gray-color dark:bg-dark-background relative'>
                    <span className='font-semibold text-xl my-2'>{`สรุปผล`}</span>
                    <div className='grid grid-cols-1 gap-2  w-full '>
                        {formresponse.map((item , index)=>{
                            return (
                            <Fragment key={index}>
                        <div  className={`flex-col flex items-start justify-start`}>
                            <h1 className={`font-semibold `}>
                            {item.lable} 
                            </h1>
                            
                        </div>
                        {item.typeinput === 'area' && areabox(item.value, item.onchange , false)}

                            </Fragment>
                        );
                        })}
                    </div>
                    <div className='absolute right-0 -bottom-12'>
                    <button
                        type="button"
                        className={`${cause.trim() ? 'hover:bg-blue-300  bg-primary dark:bg-dark-primary' : 'bg-gray-300 cursor-not-allowed'} duration-300 inline-flex  justify-center rounded-md  border border-transparent text-white px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        onClick={() => handleCauseSave()}
                        >
                            บันทึก
                    </button>
                    <button
                        type="button"
                        className={`${(datachat?.tik_cause && datachat?.tik_approved) ? 'hover:bg-blue-300  bg-primary dark:bg-dark-primary' : 'bg-gray-300 cursor-not-allowed'} mx-2 duration-300 inline-flex  justify-center rounded-md  border border-transparent text-white px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        onClick={() => handleCauseSend()}
                        >
                            ส่ง
                    </button>
                    </div>
                    <div className='absolute -left-28 top-20  flex flex-col gap-20'>
                        <div className='flex flex-col items-center gap-2 '>
                        <div className={`${datachat?.tik_cause ? 'bg-green-300 text-success border-success' : ''} p-1 h-10 w-10 rounded-full border-2 items-center flex justify-center font-semibold`}>{datachat?.tik_cause ? <IoCheckmarkSharp/> : <BiCircle className='animate-ping' />}</div>
                            <span className='text-sm font-semibold'>{`${datachat?.tik_cause ? 'กรอกข้อมูลแล้ว' : 'กรอกข้อมูล'}`}</span>
                        </div>
                        <div className='border rotate-90'></div>
                        <div className='flex flex-col items-center gap-2'>
                            <div className={`${datachat?.tik_approved ? 'bg-green-300 text-success border-success' : ''} p-1 h-10 w-10 rounded-full border-2 items-center flex justify-center font-semibold`}>{datachat?.tik_approved ? <IoCheckmarkSharp/> : <BiCircle className='animate-ping' />}</div>
                            <span className='text-sm font-semibold'>{`${datachat?.tik_approved ? 'Approve แล้ว' : 'รอการ Approve'}`}</span>
                        </div>
                    </div>
                    </div>
                </div>
                {/* ----------------- */}


                {/* APPROVED */}
                <div className={`${(datachat?.status === 'inprocess' && (user?.department === 'IT' || user?.department === 'PE') && (user?.position_id <=3)  && (!datachat?.tik_approved)) ? 'mb-10 flex ' : 'hidden'} justify-center items-center mr-4 gap-2 `}>
                <div className=' flex flex-col items-start gap-2 px-4 py-2 rounded-lg h-max w-max bg-gray-color dark:bg-dark-background relative shadow-md'>
                    <div className='font-semibold flex gap-4 items-center'>
                        <span>อนุมัติดำเนินการหรือไม่</span>
                        <div className='flex gap-2'>
                            <div
                            onClick={()=>setSelectapp('yes')} 
                            className={`${selectapp === 'yes' ? 'bg-green-300' : 'hover:bg-green-300'} w-8 h-8 rounded-full border-2 border-success flex items-center justify-center text-success  duration-300 cursor-pointer`}><IoCheckmarkSharp /></div>
                            <div
                            onClick={()=>setSelectapp('no')} 
                            className={`${selectapp === 'no' ? 'bg-red-300' : 'hover:bg-red-300'} w-8 h-8 rounded-full border-2 border-error flex items-center justify-center text-error  duration-300 cursor-pointer`}><IoClose/></div>
                        </div>
                    </div>

                    <div className={`${(selectapp === 'no' && selectapp) ? 'flex flex-col w-full' : 'opacity-0 h-0 hidden'} `}>
                        <span className='text-sm px-4 font-medium'>สาเหตุที่ไม่อนุมัติ *</span>
                        <input
                        type='text'
                        value={appdetail}
                        // disabled={dis}
                        onChange={(ev)=> setAppdetail(ev.target.value)}
                        className={` px-4 py-2 w-full text-sm focus:shadow-md h-8 flex-auto rounded-md border border-solid font-semibold
                        border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                        text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                        />
                        <span className='text-sm px-4 py-1'>ไม่ผ่านการอนุมัติ หมายถึงการปิดงาน</span>
                    </div>

                </div>
                <button
                        type="button"
                        className={`${(selectapp) ? (selectapp === 'no' && appdetail.trim() ? 'hover:bg-blue-300 bg-primary ' : selectapp === 'yes' ? 'hover:bg-blue-300 bg-primary ' : 'bg-gray-300 dark:bg-gray-300 cursor-not-allowed') : 'bg-gray-300 dark:bg-gray-300 cursor-not-allowed'} h-max justify-center rounded-md  border border-transparent text-white  dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300`}
                        // className={`${(selectapp) ? 'hover:bg-blue-300 bg-primary' : 'bg-gray-300 cursor-not-allowed'} h-max justify-center rounded-md  border border-transparent text-white  dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        onClick={() => handleApproved()}
                        >
                            บันทึก
                </button>
                </div>
                {/* ----------------- */}


                </div>


            </div>
            <div style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }} className={` z-10  flex justify-between px-4 py-2 items-center border-t dark:border-dark-second `}>

                {datachat?.recipient_by ? (
                    datachat?.status === 'close' ?(
                        <span className=" text-sm font-semibold">เวลาที่ใช้ไป : {()=>{
                            const recipientTime = moment(datachat?.recipient)
                            const elapsedTimes = moment.duration(moment().diff(recipientTime));

                            return elapsedTimes
                        }}</span>
                    ) : (
                        <span className=" text-sm font-semibold">จับเวลา : {days > 0 ? `${days}day ${hours}h ${minutes}m ${seconds}s` : `${hours}h ${minutes}m ${seconds}s`}</span>
                    )
                    ):(
                        <span className=" text-sm font-semibold">จับเวลา : 0</span>
                    )}

                    <span className={`font-semibold`}>{`สถานะ : ${statusname}`}</span>
                    {(user?.department === 'IT' || user?.department === 'PE') && (datachat?.status === 'open') &&  (
                        <button
                        type="button"
                        className={` hover:bg-blue-300 inline-flex  justify-center rounded-md  border border-transparent text-white bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        onClick={() => HandleinProcess()}
                        >
                            รับเรื่อง
                    </button>
                    )}

                    {(user?.department === 'IT' || user?.department === 'PE') && (datachat?.status === 'inprocess' || datachat?.status === 'summary') &&  (
                        <button
                        type="button"
                        className={`${datachat?.tik_approved ? 'hover:bg-blue-300  bg-primary dark:bg-dark-primary' : 'bg-gray-300 cursor-not-allowed'}   inline-flex  justify-center rounded-md  border border-transparent text-white  px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        // onClick={() => HandleinProcess()}
                        >
                            ปิดงาน
                    </button>
                    )}

             
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

