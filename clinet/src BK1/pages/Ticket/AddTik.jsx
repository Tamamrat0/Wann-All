import React from 'react'
import { Fragment,  useState, useEffect , useContext  , useRef } from "react";
import { Dialog, Transition , Menu  } from "@headlessui/react";
import { Spin, Select, Switch , ConfigProvider , theme } from "antd";
import axios from 'axios';



export default function Ticket({ open, setopen ,themes , listdepartment , setTicketlist , socket}) {

const [subject , setSubject] = useState('')
const [description , setDescription] = useState('')
const [dept , setDept] = useState('')

    const inputlist = [
        {subject:'เรื่อง', description: 'กรอกเรื่องหลักของการติดต่อ' , important:true , type:'input'} ,
        {subject:'รายละเอียด', description: 'กรอกรายละเอียดเพิ่มเติมเกี่ยวกับเรื่องที่ต้องการติดต่อ' , important:false , type:'area' },
        {subject:'ส่งถึง', description: 'เลือกหน่วยงานที่ต้องการส่งต่อ' , important:true , type:'select' },
    ]

    function inputbox( value = null, onchange = null ){
        return(
            <div className="relative">
                <input
                type='text'
                value={value}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={` w-full px-4 text-sm focus:shadow-md h-8  flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                />
            </div>
        )
    }

    function areabox(value = null, onchange = null ){
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

    function HandleSave(){
        if(subject.trim() && dept){
          console.log('click')
          console.log(subject)
          console.log(description)
          console.log(dept)
            axios.post('/ticket/newTicket' , {subject , description , dept})
            .then(({data})=>{
              socket.emit('newTickets' , data);
              setTicketlist((prev)=> [...data , ...prev  ])
              setSubject('')
              setDescription('')
              setDept('')
              setopen(false)
            }).catch((err)=>{
              console.log(`'this error ${err}'`)
            })
        }
    }

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
                <Dialog.Panel className={`w-full  max-w-sm transform overflow-auto rounded-2xl bg-background dark:bg-dark-background  p-6 text-left align-middle shadow-xl transition-all `}>
                  <Spin spinning={false}>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-text dark:text-dark-text-color"
                    >New Ticket
                    </Dialog.Title>
                    {/* Header */}
                    <div className="border rounded-md py-4 px-4 dark:border-dark-second mt-4">
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
                    </div>
                    {/* BUTTON */}
                    <div className='w-full  flex justify-end gap-2 items-center mt-4'>
                    <button
                      type="button"
                      className={` inline-flex justify-center rounded-md  border border-transparent  px-4 py-2 text-sm font-medium hover:text-error `}
                    onClick={() => setopen(!open)}
                    >
                        ยกเลิก
                    </button>
                    <button
                      type="button"
                      className={` ${subject.trim() && dept ? 'hover:bg-blue-300' : 'cursor-not-allowed'}  inline-flex justify-center rounded-md  border border-transparent text-white bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
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
