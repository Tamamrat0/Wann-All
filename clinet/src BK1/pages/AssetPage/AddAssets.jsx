import { Fragment, useState, useEffect , useContext , React , useRef } from "react";

import moment from 'moment';
// API
import axios from "axios";


// COMPONENT LIBRARY
import { Spin, Tooltip, Switch , ConfigProvider , theme } from "antd";
import { Dialog, Transition , Menu  } from "@headlessui/react";


// FILE PATH
import {PageContext} from "../../PageContext.jsx";
import {AdminContext} from "../../AdminContext.jsx";
import ModalConfirm from "../../Components/ModalConfirm.jsx"
import AddSecond from "./AddSecond.jsx";


// ICON
import { PiComputerTower , PiEngine } from "react-icons/pi";
import { BsPrinter , BsArrowRightShort , BsUniversalAccessCircle , BsCpu , BsThreeDotsVertical , BsCheck} from "react-icons/bs";
import { BiCamera , BiPhoneCall} from "react-icons/bi";
import { IoIosGitNetwork } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { LiaMicrosoft } from "react-icons/lia";
import { TbIcons } from "react-icons/tb";
import { ImLab } from "react-icons/im";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { LiaSave , LiaToolsSolid } from "react-icons/lia";




export default function AddAssets({ open, setopen ,categories, setCategories}) {

  // DATA API
  const [selecttype, setSelecttype] = useState(null);
  const [datacategory, setDatacategory] = useState(null); 
  const {assetsall , setAssetsall} = useContext(AdminContext);

  // DATA NEW CATEGORY
  const [namenewcategory , setNamenewcategory] = useState('')
  
  // CONTROLER
  const [themes , setThemes] = useState('')
  const {darkmode} = useContext(PageContext);
  const [errorstatus , setErrorstatus] = useState(null)
  const [nextpage , setNextpage] = useState(1)

  // CONTROLER NEW CATEGORY
  const [newbtn, setNewbtn] = useState(false);
  const [iconselected, setIconselected] = useState(null);  

  // ON OPEN MENU  EDITE CATEGORY 
  const [editcategory , setEditcategory] = useState(null)
  const [iditem , setIditem] = useState(null)


  //ON DELETE CATEGORY
  const [sendconfirmdelete , setSendconfirmdelete] = useState(false)
  const [responseconfirm , setResponseconfirm] = useState(false)

  // ON FIX CATEGORY
  const [onupdatecate , setOnupdatecate] = useState(false)

  // SECOND PAGE
  const [code , setCode] = useState('')
  const [type , setType] = useState('')
  const [name , setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [receive, setReceive] = useState('')
  const [detail , setDetail] = useState('')
  const [spec , setSpec] = useState('')
  const [ip , setIp] = useState('')
  const [mac , setMac] = useState('')
  const [supplier, setSupplier] = useState('')
  const [warrantyday , setWarranyday] = useState('')
  const [owner , setOwner] = useState('')
  const [remark, setRemark] = useState('')

  useEffect(()=>{
    const { darkAlgorithm , defaultAlgorithm} = theme;
    if(darkmode){
      
      setThemes({algorithm: [darkAlgorithm]})
    }else{
      setThemes({algorithm: [defaultAlgorithm]})
    }
  },[darkmode])


  const iconselect = [
    {name:"cpu", icon: BsCpu},
    {name:"moniter", icon: HiOutlineComputerDesktop},
    {name:"ups", icon: PiComputerTower},
    {name:"printer", icon: BsPrinter},
    {name:"net", icon: IoIosGitNetwork},
    {name:"software", icon: LiaMicrosoft},
    {name:"tools", icon: LiaToolsSolid},
    {name:"engine", icon: PiEngine},
    {name:"camera", icon: BiCamera},
    {name:"phone", icon: BiPhoneCall},
    {name:"lab", icon: ImLab},
    {name:"accessory", icon: BsUniversalAccessCircle},
  ]

// console.log(code,type,name,quantity,detail,spec,ip,mac,supplier,warrantyday,owner,remark)
// สำหรับแสดงผลข้อมูลจาก Database
  useEffect(()=>{
      setDatacategory(categories?.map(item => {
        const correspondingIcon = iconselect.find(type => type.name === item.icon);
        return {
          ...item,
          icon_name : item.icon,
          icon: correspondingIcon ? correspondingIcon.icon : null // ถ้าไม่พบ icon ที่ตรงกันให้เป็น null หรือค่าอื่นที่คุณต้องการ
        };
      }));

    },[categories])

  useEffect(()=>{
    if(responseconfirm){
      setResponseconfirm(false)
      axios.post('/assets/deletecategory',{iditem}).then(({data})=>{
        setCategories(categories.filter((item)=> item.id !== iditem))
        setOnupdatecate(false)
      })
    }
  },[responseconfirm])

  useEffect(()=>{
    nextpage === 0 && setopen(false)
  },[nextpage])
 
  // console.log(categories.filter((item)=> item.id !== 2))
  function converticon(name){
    setIconselected(iconselect.find(type => type.name === name))
  }

  function openmenuaddcate() {
    setNewbtn(!newbtn)
    setIconselected(null)
    setNamenewcategory('')
  }

  function handleAddCategory(){
    if(iconselected && namenewcategory){
      axios.post('/assets/newcategory',
      {
        name : namenewcategory,
        icon : iconselected.name
      }
      ).then(({data})=>{
        setCategories([...categories , ...data])
        setErrorstatus(null)
        setIconselected(null)
        setNamenewcategory('')
        setNewbtn(false)
        setSelecttype(null)
      }).catch((err)=>{
        setErrorstatus(err.response.status)
      })
    }
  }
  
  function handleDeleteCategory(item){
    setSendconfirmdelete(true)
    setIditem(item)
  }
  
  function handleOpenmenuUpdate(item){
    setNewbtn(false)
    setOnupdatecate(true)
    setNamenewcategory(item.cate_name)
    setIditem(item.id)
    setIconselected(iconselect.find(type => type.name === item.icon_name))
    
  }

  function handleUpdatecate(){
    const check = (categories?.find((item)=>item.id === iditem))
    // console.log(check)
    // console.log(iconselected)
    if(check.cate_name !== namenewcategory || check.icon !== iconselected.name){
      axios.post('/assets/updatecate', {iditem, icon:iconselected.name , name:namenewcategory}).then(({data})=>{

        setCategories(categories?.map(items => {
          const update = data.find(item => item.id === items.id)
          return update ? update : items
        }))
        setSelecttype(null)
        setOnupdatecate(false)
      })
    }
  }

  function handleAddassets(){
    console.log(ip.trim() ? ip.trim() : 'no')
    // console.log(spec)
    if(code && type && name && quantity && quantity >0 && receive && !assetsall.some(name => name.item_no.trim().toLowerCase() === code.trim().toLowerCase())) {
      const quantityint = parseInt(quantity)
      axios.post('/assets/addassets' , {
        cate_id:selecttype.id ,  code:code.trim() ,  type , name:name.trim() , quantity:quantityint , receive , detail:detail.trim() , spec , ip:ip.trim() , mac:mac.trim()
         , supplier:supplier.trim() , warrantyday , owner , remark:remark.trim()
      }).then(({data})=>{
        console.log(data)
        //setAssetsall(response.data.map(items => ({ ...items, key: JSON.stringify(items.id)})))
        const datakey = (data.map(item => 
          {
            const warrantyEndDate = moment(item.receive_date).clone().add(item.warranty_day, 'days');
            return {
              ... item , 
              warranty_status: warrantyEndDate.format('DD/MM/YYYY'),
              key: JSON.stringify(item.id)
            }
          }))
        setAssetsall([...assetsall , ...datakey])
        setopen(false)
      }).catch((err)=>{

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
                <Dialog.Panel className={`w-full   ${nextpage >1 ? 'max-w-7xl' : 'max-w-md'} transform overflow-auto rounded-2xl bg-background dark:bg-dark-background  p-6 text-left align-middle shadow-xl transition-all `}>
                  <Spin spinning={false}>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-text dark:text-dark-text-color"
                    >เพิ่มทรัพย์สิน
                    </Dialog.Title>
                    {/* Header */}
                    <div className={`flex my-2 mx-1 mt-8 ${nextpage >1 ? 'px-1 lg:px-20' : 'px-1'} item-center w-full justify-between `}>
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
                      {/* <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 ${nextpage === 3 ? 'text-primary border-primary border-2':'border border-slate-400 text-slate-400'}  ${nextpage > 3 && 'bg-success border-success'} dark:text-dark-text-color flex items-center justify-center rounded-full text-xl font-semibold `}>
                      {nextpage >3 ? <BsCheck className="w-8 h-8 text-white font-bold"/> : '3'}
                      </div>
                      <div className={`${nextpage === 3 ? 'font-bold' : 'font-medium'}  text-sm  text-text dark:text-dark-text-color`}>สรุป</div>
                      </div> */}
                    </div>

                    {/* Grid */}
                    <div className={`${nextpage >1 ? 'h-0 opacity-0 overflow-auto hidden' : 'h-auto opacity-100 grid'} w-full  grid-cols-3 gap-2 mt-4 relative text-text dark:text-dark-text-color `}>

                      {datacategory && datacategory.map((items , index) => (
                        <div
                          key={items.cate_name}
                          // ref={[index]}
                          className={` bg-slate-200 dark:bg-dark-second  rounded-xl p-2 h-28 relative 
                          ${selecttype?.id === items.id ? "ring-2 ring-primary dark:ring-dark-primary drop-shadow-2xl": " opacity-40"}`}
                          onClick={() => setSelecttype(items)}>

                          <div className="flex flex-col justify-between items-center text-center h-full">
                            {items.icon && (
                              <items.icon className="mt-2 w-14 h-14 bg-background dark:bg-dark-background text-text dark:text-dark-text-color  p-2 rounded-full  " />
                            )}
                          
                            <h3 className="font-bold px-2 ">{items.cate_name}</h3>
                          </div>
                          <Menu>
                          <Menu.Button className="absolute right-0 top-1 px-1 py-2" onClick={()=>setEditcategory(items.cate_name)} ><BsThreeDotsVertical  className="h-4 w-4"/></Menu.Button>
                          <Menu.Items className={`${ editcategory == items.cate_name ? 'opacity-100 h-auto flex flex-col' : 'hidden h-0 overflow-hidden '} duration-500 absolute top-7 right-0 px-1 py-2  bg-background dark:bg-dark-background rounded-lg shadow-lg`}>
                          <Menu.Item className="text-text dark:text-dark-text-color">
                            <ul className="text-text dark:text-dark-text-color"  >
                              <li className="py-1 px-3 hover:bg-third dark:hover:bg-dark-second ">
                                <a href="#" onClick={()=>handleOpenmenuUpdate(items)}>แก้ไข</a>
                              </li>
                              <li className="py-1 px-3 hover:bg-third dark:hover:bg-dark-second">
                                <a href="#" onClick={() =>handleDeleteCategory(items.id)}>ลบ</a>
                              </li>
                            </ul>
                          </Menu.Item>
                          </Menu.Items>
                          </Menu>
                        </div>
                        ))}
                      </div>
                      <div className={`${nextpage >1  ? 'h-0 opacity-0 overflow-auto hidden' : 'h-auto opacity-100'} mt-6 px-4 duration-500`}>
                        <button className={`${onupdatecate && 'hidden'} text-primary font-semibold text-sm flex items-center gap-2`} onClick={()=>openmenuaddcate()}><GoPlus className={`${newbtn && 'rotate-45'} duration-500 h-4 w-4`}/>เพิ่มประเภท</button>
                        <button className={`${onupdatecate ? 'flex' : 'hidden'}  text-primary font-semibold text-sm  items-center gap-2`} onClick={()=>{setOnupdatecate(false)}}><GoPlus className={`${onupdatecate && 'rotate-45'} duration-500 h-4 w-4`}/>แก้ไข</button>
                        {/* <ComponentName /> */}
                        <div className={`duration-300   ${newbtn || onupdatecate ? 'flex mt-2': 'opacity-0 h-0 overflow-hidden'}   `}>

                          <div className="flex items-center justify-between w-full text-text dark:text-dark-text-color">
                          <div className="font-semibold relative">
                          <span>ตั้งชื่อประเภท </span>
                          <input type="text" value={namenewcategory} onChange={(ev)=>setNamenewcategory(ev.target.value)}
                          className={`ml-2 pl-2 text-sm focus:shadow-md lg:w-24  flex-auto rounded-md border border-solid font-semibold
                          border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-2 pr-3
                          text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none focus:transition-shadow
                          ${errorstatus === 400  ?   'focus:border-error dark:focus:border-dark-error ' : 'focus:border-primary dark:focus:border-dark-primary '}`}
                          />
                          <span className={`${errorstatus === 400 ? 'opacity-100' : 'opacity-0'} absolute inset-x-2/4 -bottom-6 w-full text-error`}>ชื่อนี้มีอยู่แล้ว</span>
                          </div>
                           <div className="flex items-center gap-2 font-semibold relative">
                            <span>เลือกไอคอน</span>

                            <Menu>
                            <Menu.Button className={`flex items-center justify-center w-10 h-10 rounded-full duration-300 text-text dark:text-dark-text-color bg-slate-200  dark:bg-dark-second ${iconselected && 'ring-2 ring-primary dark:ring-dark-primary'}`}>
                              {iconselected ? ( <iconselected.icon className="w-5 h-5  "/>) : (<TbIcons className="w-5 h-5"/>)}</Menu.Button>
                              <Menu.Items className={` grid grid-cols-2 gap-4 opacity-95 h-auto drop-shadow-xl px-4 py-4 duration-300 absolute   bg-slate-200 dark:bg-dark-second   -right-20 -bottom-10 rounded-md  `}>
                                <Menu.Item>
                                  <>
                                { iconselect.map((item , index)=>(
                                  <item.icon key={index} onClick={()=>converticon(item.name)}
                                  className={`w-8 h-8 cursor-pointer text-text dark:text-dark-text-color p-1 
                                  ${iconselected?.name === item.name && 'ring-2 ring-primary '}  rounded-full duration-300 hover:scale-125`}/> 
                                  ))}
                                  </>
                                </Menu.Item>
                              </Menu.Items>
                            
                            </Menu>

                           </div>
                           <Tooltip title={iconselected && namenewcategory ? 'บันทึก' : 'กรุณากรอกข้อมูลให้ครบ'}>
                           <button 
                           className={`w-10 h-10 ${iconselected && namenewcategory ? 'bg-primary  text-white' : 'bg-slate-200 dark:bg-dark-third text-text cursor-not-allowed'} ${onupdatecate && 'hidden h-0 overflow-auto'} duration-300 rounded-full  dark:text-dark-text-color flex items-center justify-center  `} onClick={handleAddCategory}><LiaSave className="w-7 h-7"/>
                           </button>
                           </Tooltip>
                           <Tooltip title={iconselected && namenewcategory ? 'อัปเดต' : 'กรุณากรอกข้อมูลให้ครบ'}>
                           <button 
                           className={`w-10 h-10 ${iconselected && namenewcategory ? 'bg-warning  text-white' : 'bg-slate-200 dark:bg-dark-third text-text cursor-not-allowed'} ${newbtn && 'hidden h-0 overflow-auto'} duration-300 rounded-full  dark:text-dark-text-color flex items-center justify-center  `} onClick={handleUpdatecate}><LiaSave className="w-7 h-7"/>
                           </button>
                           </Tooltip>
                          </div>

                        </div>
                      </div>
                      {nextpage === 2  && (<AddSecond selecttype={selecttype} code = {code} setCode = {setCode} type = {type} setType = {setType} name = {name} setName = {setName} 
                      quantity = {quantity} setQuantity = {setQuantity} receive={receive} setReceive={setReceive} detail = {detail} setDetail = {setDetail} spec = {spec} setSpec = {setSpec} ip = {ip} setIp = {setIp} mac = {mac} setMac = {setMac}
                      supplier = {supplier} setSupplier = {setSupplier} warrantyday = {warrantyday} setWarranyday = {setWarranyday} owner = {owner} setOwner = {setOwner}
                      remark = {remark} setRemark = {setRemark} themes = {themes}/>)}
                      {/* {nextpage === 3  && (<AddThird selecttype={selecttype}/>)} */}

                    <div className={`mt-6  justify-end duration-500 ${ newbtn || onupdatecate ?  'opacity-0 h-0 overflow-hidden ' : 'flex' }`}>
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-text dark:text-dark-text-color hover:text-error hover:dark:text-dark-error "
                        // onClick={() => setopen(false)}
                        onClick={()=> {setNextpage(nextpage-1)}}
                      >
                        {nextpage > 1 ? 'กลับ' : 'ยกเลิก'}
                      </button>
                      {nextpage > 1 ? (
                      <button
                      type="button"
                      className={` ${code && type && name && quantity && quantity >0 && receive &&  !assetsall.some(name => name.item_no.trim().toLowerCase() === code.trim().toLowerCase()) ? 'hover:bg-blue-300 ' : 'cursor-not-allowed'} inline-flex justify-center rounded-md  border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                      onClick={() => handleAddassets()}
                    >
                      <span className="flex items-center w-full justify-end gap-2 text-white">
                      
                      บันทึก
                      <BsArrowRightShort className="text-white w-5 h-5 "/>
                      </span>
                    </button>
                      ):(
                        <button
                        type="button"
                        className={` ${selecttype ? 'hover:bg-blue-300' : 'cursor-not-allowed '} inline-flex justify-center rounded-md  border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        onClick={() => selecttype && nextpage < 2 && setNextpage(prevPage => prevPage + 1) }
                      >
                        <span className="flex items-center w-full justify-end gap-2 text-white">
                        
                        ถัดไป
                        <BsArrowRightShort className="text-white w-5 h-5 "/>
                        </span>
                      </button>
                      )}

                    </div>
                  </Spin>
                </Dialog.Panel>
              </Transition.Child>
            </div>
            {sendconfirmdelete && (
              <ModalConfirm 
              open = {sendconfirmdelete}
              onClose = {setSendconfirmdelete}
              header='ยืนยันการลบข้อมูล'  
              detail='คุณต้องการลบข้อมูลนี้ใช่หรือไม่ ? <br/> หากยืนยันข้อมูลจะหายไปและไม่สามารถกู้คืนได้.' 
              onChange={setResponseconfirm}  
              status='delete' 
              />
              )}
          </div>
        </Dialog>
      </Transition>

    </>
  );
}
