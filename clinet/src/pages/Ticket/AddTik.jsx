import React from 'react'
import { Fragment,  useState, useEffect , useContext  , useRef } from "react";
import axios from 'axios';


// UI LIBRARY
import { Dialog, Transition , Menu  } from "@headlessui/react";
import { Spin, Select, Switch , ConfigProvider , theme } from "antd";

// ICON
import {HiOutlineTicket , HiOutlineClipboardList , HiOutlineChatAlt} from 'react-icons/hi'
import { BsCheck} from "react-icons/bs";


// FILE PATH
import AddTikDetail from './AddTikDetail';
export default function Ticket({user, open, setopen ,themes , listdepartment , setTicketlist , socket}) {

// DATA API 
const [dept , setDept] = useState('')
const [style , setStyle] = useState('')
const [subject , setSubject] = useState('')
const [description , setDescription] = useState('')
const [codedevice , setCodedevice] = useState(null)

// CONTROLER
const [nextpage , setNextpage] = useState(1)
const [select_doc , setSelect_doc] = useState('')
const [loading , setLoading] = useState(false)
const [assets , setAsstes] = useState(null)


    function HandleSave(){
        if(subject.trim() && dept){
            axios.post('/ticket/newTicket' , {subject , description , dept , codedevice , style , select_doc})
            .then(({data})=>{
              socket.emit('newTickets' , data);
              setTicketlist((prev)=> [...data , ...prev  ])
              setSubject('')
              setDescription('')
              setDept('')
              setStyle('')
              setCodedevice(null)
              setopen(false)
            }).catch((err)=>{
              console.log(`'this error ${err}'`)
            })
        }
    }

    useEffect(()=>{
      if(select_doc === 'repair'){
        setCodedevice('')
        setLoading(true)
        console.log(dept)
        if(dept){
          axios.post('/ticket/assets',{dept}).then(({data})=>{
            setLoading(false)
            setAsstes(data)
          }).catch((err)=>{
            setLoading(false)
            
          })
        }
      }
    },[dept])
  return (
   <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={setopen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black backdrop-blur-[5px] bg-opacity-50 " />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center   text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={`w-full  ${nextpage >1 ? 'max-w-2xl' : 'max-w-sm'} transform overflow-auto rounded-2xl bg-background dark:bg-dark-background  p-6 text-left align-middle shadow-xl transition-all `}>
                  <Spin spinning={loading}>
                    <Dialog.Title
                      as="h3"
                      className="text-xl flex items-center font-semibold leading-6 text-text dark:text-dark-text-color"
                    ><HiOutlineTicket className="w-14 h-14 p-2  text-text dark:text-dark-text-color " />New Ticket  

                    </Dialog.Title>
                    {/* Header */}
                    <div className={`flex my-2 mx-1 mt-4 ${nextpage >10 ? 'px-1 lg:px-20' : 'px-1'} item-center w-full justify-between `}>
                      <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 ${nextpage === 1 ? 'text-primary border-primary border-2':'border border-slate-400 text-slate-400'} ${nextpage > 1 && 'bg-success border-success'}  dark:text-dark-text-color flex items-center justify-center rounded-full text-xl font-semibold `}>
                        {nextpage > 1 ? <BsCheck className="w-8 h-8 text-white font-bold"/> : '1'}
                      </div>
                        <div className={`${nextpage === 1 ? 'font-bold' : 'font-medium'}  text-sm  text-text dark:text-dark-text-color`}>เลือกหมวดหมู่</div>
                      </div>
                      <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 ${nextpage === 2 ? 'text-primary border-primary border-2':'border border-slate-400 text-slate-400'}  ${nextpage > 2 && 'bg-success border-success'} dark:text-dark-text-color flex items-center justify-center rounded-full text-xl font-semibold `}>
                      {nextpage > 2 ? <BsCheck className="w-8 h-8 text-white font-bold"/> : '2'}
                      </div>
                      <div className={`${nextpage === 2 ? 'font-bold' : 'font-medium'}  text-sm  text-text dark:text-dark-text-color`}>รายละเอียด</div>
                      </div>
                    </div>
                    {/* END HEADER */}

                    {/* GRID */}
                    <div className={`${nextpage >1 ? 'h-0 opacity-0 overflow-auto hidden' : 'h-auto opacity-100 grid'} grid grid-cols-2 gap-2 mt-4 text-text dark:text-dark-text-color`}>
                      <div onClick={()=>setSelect_doc('repair')}
                      className={`cursor-pointer bg-slate-200 dark:bg-dark-second rounded-xl p-2 h-28 ${select_doc === 'repair' ? 'ring-2 ring-primary dark:ring-dark-primary drop-shadow-2xl' : 'opacity-40'} relative `}>
                        <div className='flex flex-col justify-between items-center text-center h-full '>
                        <HiOutlineClipboardList className="mt-2 w-14 h-14 p-2 bg-background dark:bg-dark-background text-text dark:text-dark-text-color  rounded-full  " />
                        <h3 className="font-bold px-2 ">ใบแจ้งซ่อม</h3>
                        </div>
                      </div>
                      <div onClick={()=>setSelect_doc('problem')}
                      className={`cursor-pointer bg-slate-200 dark:bg-dark-second rounded-xl p-2 h-28 ${select_doc === 'problem' ? 'ring-2 ring-primary dark:ring-dark-primary drop-shadow-2xl' : 'opacity-40'} relative `}>
                      <div className='flex flex-col justify-between items-center text-center h-full '>
                        <HiOutlineChatAlt className="mt-2 w-14 h-14 p-2 bg-background dark:bg-dark-background text-text dark:text-dark-text-color  rounded-full  " />
                        <h3 className="font-bold px-2 ">แจ้งปัญหา</h3>
                        </div>
                      </div>
                    </div>
                    {/* END GRID */}
                      {nextpage === 2 && <AddTikDetail themes={themes} dept={dept} style={style} setStyle={setStyle} setDept={setDept} subject={subject} setSubject={setSubject} description={description} setDescription={setDescription} codedevice={codedevice} setCodedevice={setCodedevice} select_doc={select_doc} listdepartment={listdepartment} assets={assets}/>}

                    {/* BUTTON */}
                    <div className='w-full  flex justify-end gap-2 items-center mt-4'>
                    <button
                      type="button"
                      className={` inline-flex justify-center rounded-md  border border-transparent  px-4 py-2 text-sm font-medium hover:text-error dark:hover:text-error dark:text-white`}
                      onClick={()=> nextpage >1  ? setNextpage(prev => prev -1) : setopen(false)} 
                    >
                      {nextpage > 1 ? 'กลับ' : 'ยกเลิก'}
                    </button>
                    <button
                      type="button"
                      className={` ${select_doc ? 'hover:bg-blue-300' : 'cursor-not-allowed'}  ${nextpage === 1 ? 'inline-flex' : 'hidden' } justify-center rounded-md  border border-transparent text-white bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                     onClick={() => setNextpage(prevPage => prevPage + 1)}
                    >
                        ถัดไป
                    </button>
                    <button
                      type="button"
                      className={` ${subject.trim() && dept ? 'hover:bg-blue-300' : 'cursor-not-allowed'} ${nextpage >1 ? 'inline-flex' : 'hidden' }  justify-center rounded-md  border border-transparent text-white bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                      onClick={() => HandleSave()}
                    >
                        บันทึก
                    </button>
                    </div>
                   
                      </Spin>
                </Dialog.Panel>
              </Transition.Child>
            </div>

          </div>
        </Dialog>
      </Transition>

    
   </>
  )
}



{/* <div className="border rounded-md py-4 px-4 dark:border-dark-second mt-4">
<div className={`grid grid-cols-2 gap-8 items-center  max-h-hh  text-text dark:text-dark-text-color`}>
    {inputlist.map((item ,index)=>(
    <Fragment key={index}>
    <div  className={` flex-col mt-2 flex`}>
    <h1 className={`font-semibold text-lg  `}>{item.subject} {item.important && (<span className="text-error ml-4">*</span>)} </h1>
    <span>{item.description}</span>
    </div> 

    {item.type === 'input' ? (
        inputbox(subject,setSubject)
    ):(
        <>
        {item.type === 'area' ? (
            areabox(description , setDescription)
            ):(
        <ConfigProvider theme={themes}>
        <Select 
        value={dept}
        onChange={(ev)=>setDept(ev)}
        placeholder="เลือกผู้ใช้"
        options={listdepartment.filter(i => i.department === 'IT' || i.department === 'PE').map((item)=> ({
                label:item.department,
                value:item.department
        }))}
        />
        </ConfigProvider>
        )}
        </>
    )}


    </Fragment>
    
    ))}
</div>
</div> */}