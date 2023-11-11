import { React, useContext, useState, useEffect } from "react";
import {UserContext} from "../../UserContext";
import {AdminContext} from "../../AdminContext";
import axios from "axios";
// UI LIBRARY
import Avatar from "react-nice-avatar";
import { Tooltip, notification, Button } from "antd";

// ICON
import { FcAbout } from "react-icons/fc";
import { BiSolidMessageAltEdit, BiError } from "react-icons/bi";
import { AiFillPlusSquare } from "react-icons/ai";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import { RiCoinsLine, RiDeleteBinLine } from "react-icons/ri";
import {
  BsPlusCircleDotted,
  BsArrowUpCircle,
  BsCheckCircle,
  BsThreeDotsVertical
} from "react-icons/bs";

import {
  ComputerDesktopIcon,
  CheckCircleIcon,
  CpuChipIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { PiComputerTower } from "react-icons/pi";
// PATH FILES
import TableUsers from "./TableUsers";
import SearchBar from "./SearchBar";
import ModalAddUser from "./ModalAddUser";
import ModalAddAsset from "./ModalAddAsset";
import ModalFixAsset from "./ModalFixAsset";
import Skeleton from "./Skeleton";
import ModalFixUser from "./ModalFixUser";


export default function Users() {
  const {socket , listdepartment , listposition , user} = useContext(UserContext);
  const {listpermission , userall , setUserall} = useContext(AdminContext);
  const [api, contextHolder] = notification.useNotification();
  // const [listpermission, setListpermission] = useState([]);
  let [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [hideuser, setHideuser] = useState(true);
  const [noti, setNoti] = useState(null);
  let [modaluser, setModaluser] = useState(false);
  let [modalfixuser, setModalfixuser] = useState(false);
  let [modalasset, setModalasset] = useState(false);
  let [modalfixasset, setModalfixasset] = useState(false);
  let [modalfixassetname, setModalfixassetname] = useState(null);

  //  console.log(selectedRowKeys)
  useEffect(() => {
    if (noti) {
      setTimeout(() => {
        api.open({
          message: (
            <h3 className="font-bold  flex items-center gap-2">
              <FcAbout className="w-8 h-8" /> แจ้งเตือน
            </h3>
          ),
          key: noti.map((item) => item.key),
          description: (
            <>
              <span className="flex gap-2 items-center text-sm font-semibold	">
                {noti[0].icon === 1 ? (
                  <BsCheckCircle className="w-6 h-6 text-green-500 " />
                ) : (
                  <BiError className="w-6 h-6 text-red-500" />
                )}
                {noti[0].description}
              </span>
            </>
          ),
          duration: 7,
        });
      }, 1000);
    }
    setNoti(null);
  }, [noti]);

  useEffect(()=>{
    if(socket){
 
    socket.on('after_edit_user', (data)=>{
       

      setUserall(
        data.map((items) => ({
          ...items,
          key: JSON.stringify(items.id),
        }))
      );

      if(selectedRowKeys){
      console.log('this is recieved socket select row')
      const data_select = data.find((item) => item.id === selectedRowKeys.id);
      
      setSelectedRowKeys(() => ({
        ...data_select,
        key: JSON.stringify(data_select.id),
      }));
    }
    
    
  })
  
}
},[socket])


  useEffect(() => {

      if(socket){

        socket.emit('create_room', {user:user.firstname , room:"userpage"});
        
        return()=>{
          socket.emit('leave_room', {user:user.firstname , room:"userpage"});
        }
      }
  }, []);


  const assetdata = [
    { label: "Computer", code: "it-02", icon: CpuChipIcon },
    { label: "Moniter", code: "mnt-02", icon: ComputerDesktopIcon },
    { label: "Moniter", code: "mnt-03", icon: ComputerDesktopIcon },
    { label: "Ups", code: "ups-02", icon: PiComputerTower },
  ];



  function Handleladduser(ev) {
    ev.preventDefault();
    setModaluser(true);
  }
  function Handlelfixuser(ev) {
    ev.preventDefault();
    setModalfixuser(true);
  }
  function Handleasset(ev) {
    ev.preventDefault();
    setModalasset(true);
  }
  function Handlefixasset(name, code) {
    setModalfixasset(true);
    setModalfixassetname([name, code]);
  }

  return (
    <div className="w-full  flex flex-col">
      <div className="w-full 	">
        {contextHolder}

        {/* TABLE USERS */}
        <section className=" w-full  mt-2" >
          <div className="flex justify-between ">
            <div className="flex flex-col relative text-text dark:text-dark-text-color">
              <span className="delay-300 text-2xl font-semibold tracking-tight  mt-2">
                ALL USERS
              </span>
              <p className="text-base leading-7 ">
                ข้อมูลของผู้ใช้ทั้งหมด
              </p>
              <div className=" absolute flex items-end p-4 ml-2 -right-12 ">
              <Tooltip
                title={`${
                  hideuser ? "เปิด หน้าต่าง User" : "ซ่อน หน้าต่าง User"
                }`}
              >
                <div>
                <BsArrowUpCircle
                  className={`w-6 h-6 cursor-pointer duration-500 ${
                    hideuser ? "rotate-180" : ""
                  }`}
                  onClick={() => setHideuser(() => !hideuser)}
                  />
                  </div>
              </Tooltip>
            </div>
            </div>

            <div className="flex items-center">
              <button
                className=" mt-3  lg:mt-0 bg-primary dark:bg-dark-primary px-4 py-2 rounded-lg border duration-300 hover:bg-blue-300 text-white"
                onClick={Handleladduser}
              >
                เพิ่มผู้ใช้งาน
              </button>
            </div>
            
          </div>
          <div
          className={` bg-background dark:bg-dark-background rounded-xl  w-full flex-col xl:flex-row gap-3 shadow-md
            duration-300 ${
              hideuser
                ? "opacity-0 h-0 overflow-hidden"
                : "p-4 mt-5 flex opacity-100 h-auto"
            }`}>
          {selectedRowKeys ? (
            <>
              {/* AVATAR */}
              <div className="  w-full xl:w-2/12 flex justify-center items-center  ">
                <Avatar
                  className="w-48 h-48 border-4 border-white  "
                  {...JSON.parse(selectedRowKeys?.avatar)}
                />
              </div>

              <div className="border h-68 m-1 "></div>

              {/* USER */}
              <div className="w-full xl:w-5/12  rounded-xl p-4 relative mt-4 flex flex-col   ">
                <div className=" absolute right-5 -top-6  text-text dark:text-dark-text-color font-semibold">
                  ข้อมูลของผู้ใช้
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-left text-text dark:text-dark-text-color ">
                  <div className="w-full flex  items-center justify-between gap-3">
                    <div className="flex justify-end pl-2  w-2/6 font-bold	">
                      Userid
                    </div>
                    <span className="flex w-4/6 px-3 py-2">
                      {selectedRowKeys?.emp_no}
                    </span>
                  </div>
                  <div></div>
                  <div className="w-full flex  items-center justify-between gap-3">
                    <div className="flex justify-end pl-2  w-2/6 font-bold	">
                      ชื่อจริง
                    </div>
                    <span className="flex w-4/6 px-3 py-2">
                      {selectedRowKeys?.firstname}
                    </span>
                  </div>
                  <div className="w-full flex  items-center justify-between gap-3">
                    <div className="flex justify-end pl-2  w-2/6 font-bold	">
                      นามสกุล
                    </div>
                    <span className="flex w-4/6 px-3 py-2">
                      {selectedRowKeys?.lastname}
                    </span>
                  </div>
                  <div className="w-full flex  items-center justify-between gap-3">
                    <div className="flex justify-end pl-2  w-2/6 font-bold	">
                      แผนก
                    </div>
                    <span className="flex w-4/6 px-3 py-2">
                      {selectedRowKeys?.department}
                    </span>
                  </div>
                  <div className="w-full flex  items-center justify-between gap-3">
                    <div className="flex justify-end pl-2  w-2/6 font-bold	">
                      ตำแหน่ง
                    </div>
                    <span className="flex w-4/6 px-3 py-2">
                      {selectedRowKeys?.position}
                    </span>
                  </div>
                  <div className="w-full flex  items-center justify-between gap-3">
                    <div className="flex justify-end pl-2  w-2/6 font-bold	">
                      สิทธิ์การใช้งาน
                    </div>
                    <span className="flex w-4/6 px-3 py-2">{selectedRowKeys?.per_name}</span>
                  </div>
                  <div className="w-full flex  items-center justify-between gap-3">
                    <div className="flex justify-end pl-2  w-2/6 font-bold	">
                      สถานะ
                    </div>
                    <span className="flex w-4/6 px-3 items-center  ">
                      <p className={`w-5 h-5 ${selectedRowKeys?.activate ? 'bg-green-500':'bg-red-500'}  rounded-full duration-500`}></p>
                      <p className={`px-3 py-2`}>{selectedRowKeys?.activate ?'เปิดใช้งาน':'ปิดใช้งาน'}</p>
                    </span>
                  </div>
                </div>
                <div className="w-full h-full p-2 flex  mt-4 justify-end items-center ">
                  <button
                    onClick={Handlelfixuser}
                    className="inline-flex justify-center rounded-md w-2/6 xl:w-1/6 border border-transparent 
                    bg-primary dark:bg-dark-primary  px-4 py-2 text-sm font-medium text-white hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    ตั้งค่าผู้ใช้
                  </button>
                </div>
              </div>

              <div className="border h-68 m-1"></div>

              {/* ASSET INFO */}
              <div className="w-full xl:w-5/12  rounded-xl p-2 relative mt-4 ">
                <div className=" absolute right-5 -top-6 text-text dark:text-dark-text-color  font-semibold">
                  ทรัพย์สินของผู้ใช้
                </div>
                <div className=" grid grid-cols-2 lg:grid-cols-4 gap-2  ">
                  {assetdata.map((items) => (
                    <div
                      key={items.code}
                      className="w-full bg-gray-color dark:bg-dark-second rounded-xl pl-1 pr-2 relative">
                      <div className="flex justify-left items-center text-center rounded-lg whitespace-nowrap overflow-auto h-16 gap-2 px-2">
                        <div className="w-8 h-8 p-1  rounded-full bg-white ">
                          <items.icon className="w-full h-full " />
                        </div>
                        <div className="flex flex-col   ">
                        <span className="text-left  text-text dark:text-dark-text-color font-bold">{items.label}</span>
                        <span className="text-left text-text dark:text-dark-text-color">{items.code}</span>
                        </div>
                      </div>

                      <BsThreeDotsVertical
                        onClick={() => Handlefixasset(items.label, items.code)}
                        className="absolute w-6 h-6 p-1 top-1 -right-1  cursor-pointer dark:text-dark-text-color"
                      />
                    </div>
                  ))}

                  <button
                    className="w-auto   bg-background dark:bg-dark-second rounded-xl p-2 hover:bg-gray-color
              relative border-2 border-dashed border-gray-color flex  justify-center items-center"
                    onClick={Handleasset}
                  >
                    <p className=" text-gray-500 text-6xl  ">+</p>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Skeleton />
          )}
        </div>

          <div className="mt-4">
            <TableUsers
              selectrow={selectedRowKeys}
              setSelectrow={setSelectedRowKeys}
              datausers={userall}
              setDatausers={setUserall}
              seteditmodal={setModalfixuser}
            />
          </div>
        </section>
      </div>
      {modaluser && (
        <ModalAddUser
          open={modaluser}
          setopen={setModaluser}
          datausers={userall}
          setDatausers={setUserall}
          setNoti={setNoti}
          listdepartment={listdepartment}
          listposition={listposition}
          listpermission={listpermission}
          socket={socket}
        />
      )}
      {modalasset && (
        <ModalAddAsset open={modalasset} setopen={setModalasset} />
      )}
      {modalfixasset && (
        <ModalFixAsset
          open={modalfixasset}
          setopen={setModalfixasset}
          name={modalfixassetname[0]}
          code={modalfixassetname[1]}
        />
      )}
      {modalfixuser && (
        <ModalFixUser
          open={modalfixuser}
          setopen={setModalfixuser}
          selectrow={selectedRowKeys}
          setSelectrow={setSelectedRowKeys}
          setNoti={setNoti}
          listdepartment={listdepartment}
          listposition={listposition}
          datausers={userall}
          setDatausers={setUserall}
          listpermission={listpermission}
          socket={socket}
        />
      )}
    </div>
  );
}


// "<div className=" flex flex-col  lg:flex-row justify-between items-center w-full h-auto">
//           <header className="flex">
//             <div className="flex flex-col">
//               <span className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
//                 USER
//               </span>
//               <p className="text-base leading-7 text-gray-600">
//                 ข้อมูลและทรัพย์สินของผู้ใช้งาน
//               </p>
//             </div>
//             {/* {!selectedRowKeys.length ? (null) : ( */}
//             <div className="flex items-end p-4 ml-2 ">
//               <Tooltip
//                 title={`${
//                   hideuser ? "เปิด หน้าต่าง User" : "ซ่อน หน้าต่าง User"
//                 }`}
//               >
//                 <div>
//                 <BsArrowUpCircle
//                   className={`w-6 h-6 cursor-pointer duration-500 ${
//                     hideuser ? "rotate-180" : ""
//                   }`}
//                   onClick={() => setHideuser(() => !hideuser)}
//                   />
//                   </div>
//               </Tooltip>
//             </div>
//             {/* )} */}
//           </header>
//           {/* <div className="flex items-center mt-3 lg:mt-0 w-3/4 lg:w-1/4  ">
//             <SearchBar datausers={userall} setdatauser={setUserall} setSelectrow={setSelectedRowKeys} />
//           </div> */}
//         </div>

//         <div
//           className={`border bg-white rounded-xl  w-full flex-col xl:flex-row gap-3 shadow-md
//             duration-300 ${
//               hideuser
//                 ? "opacity-0 h-0 overflow-hidden"
//                 : "p-4 mt-5 flex opacity-100 h-auto"
//             }`}
//         >
//           {selectedRowKeys ? (
//             <>
//               {/* AVATAR */}
//               <div className="  w-full xl:w-2/12 flex justify-center items-center  ">
//                 <Avatar
//                   className="w-48 h-48 border-4 border-white  "
//                   {...JSON.parse(selectedRowKeys?.avatar)}
//                 />
//               </div>

//               <div className="border h-68 m-1 "></div>

//               {/* USER */}
//               <div className="w-full xl:w-5/12  rounded-xl p-4 relative mt-4 flex flex-col   ">
//                 <div className=" absolute right-5 -top-6 text-gray-700 font-semibold">
//                   ข้อมูลของผู้ใช้
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-left ">
//                   <div className="w-full flex  items-center justify-between gap-3">
//                     <div className="flex justify-end pl-2  w-2/6 font-bold	">
//                       Userid
//                     </div>
//                     <span className="flex w-4/6 px-3 py-2">
//                       {selectedRowKeys?.emp_no}
//                     </span>
//                   </div>
//                   <div></div>
//                   <div className="w-full flex  items-center justify-between gap-3">
//                     <div className="flex justify-end pl-2  w-2/6 font-bold	">
//                       ชื่อจริง
//                     </div>
//                     <span className="flex w-4/6 px-3 py-2">
//                       {selectedRowKeys?.firstname}
//                     </span>
//                   </div>
//                   <div className="w-full flex  items-center justify-between gap-3">
//                     <div className="flex justify-end pl-2  w-2/6 font-bold	">
//                       นามสกุล
//                     </div>
//                     <span className="flex w-4/6 px-3 py-2">
//                       {selectedRowKeys?.lastname}
//                     </span>
//                   </div>
//                   <div className="w-full flex  items-center justify-between gap-3">
//                     <div className="flex justify-end pl-2  w-2/6 font-bold	">
//                       แผนก
//                     </div>
//                     <span className="flex w-4/6 px-3 py-2">
//                       {selectedRowKeys?.department}
//                     </span>
//                   </div>
//                   <div className="w-full flex  items-center justify-between gap-3">
//                     <div className="flex justify-end pl-2  w-2/6 font-bold	">
//                       ตำแหน่ง
//                     </div>
//                     <span className="flex w-4/6 px-3 py-2">
//                       {selectedRowKeys?.position}
//                     </span>
//                   </div>
//                   <div className="w-full flex  items-center justify-between gap-3">
//                     <div className="flex justify-end pl-2  w-2/6 font-bold	">
//                       สิทธิ์การใช้งาน
//                     </div>
//                     <span className="flex w-4/6 px-3 py-2">superadmin</span>
//                   </div>
//                   <div className="w-full flex  items-center justify-between gap-3">
//                     <div className="flex justify-end pl-2  w-2/6 font-bold	">
//                       สถานะ
//                     </div>
//                     <span className="flex w-4/6 px-3 items-center  ">
//                       <p className={`w-5 h-5 ${selectedRowKeys?.activate ? 'bg-green-500':'bg-red-500'}  rounded-full duration-500`}></p>
//                       <p className={`px-3 py-2`}>{selectedRowKeys?.activate ?'เปิดใช้งาน':'ปิดใช้งาน'}</p>
//                     </span>
//                   </div>
//                 </div>
//                 <div className="w-full h-full p-2 flex  mt-4 justify-end items-center ">
//                   <button
//                     onClick={Handlelfixuser}
//                     className="inline-flex justify-center rounded-md w-2/6 xl:w-1/6 border border-transparent 
//             bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                   >
//                     ตั้งค่าผู้ใช้
//                   </button>
//                 </div>
//               </div>

//               <div className="border h-68 m-1"></div>

//               {/* ASSET INFO */}
//               <div className="w-full xl:w-5/12 bg-white rounded-xl p-2 relative mt-4 ">
//                 <div className=" absolute right-5 -top-6 text-gray-700 font-semibold">
//                   ทรัพย์สินของผู้ใช้
//                 </div>
//                 <div className=" grid grid-cols-2 lg:grid-cols-4 gap-2  ">
//                   {assetdata.map((items) => (
//                     <div
//                       key={items.code}
//                       className="w-auto bg-gray-200 rounded-xl p-2 h-28 relative"
//                     >
//                       <div className="flex justify-between items-center text-center h-full">
//                         <div className="">
//                           <items.icon className="w-14 h-14 bg-white p-2 rounded-full  " />
//                         </div>
//                         <div className=" w-full ">
//                           <h3 className="font-bold px-2 ">{items.label}</h3>
//                           <span>{items.code}</span>
//                         </div>
//                       </div>

//                       <MdOutlineAutoFixHigh
//                         onClick={() => Handlefixasset(items.label, items.code)}
//                         className="absolute w-6 h-6 p-1 bottom-1 right-2  bg-white hover:bg-yellow-200 rounded-full cursor-pointer"
//                       />
//                     </div>
//                   ))}

//                   <button
//                     className="w-auto h-28  bg-white rounded-xl p-2 hover:bg-gray-100
//               relative border-2 border-dashed flex  justify-center items-center"
//                     onClick={Handleasset}
//                   >
//                     <p className=" text-gray-500 text-6xl  ">+</p>
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <Skeleton />
//           )}
//         </div>"