// MAIN
import {useState , useContext , useEffect, Fragment} from "react";
import { UserContext } from "../../UserContext.jsx";
import { Link, Navigate, redirect } from "react-router-dom";

// ICON
import { CheckIcon } from "@heroicons/react/20/solid";
import {
  ComputerDesktopIcon,
  CheckCircleIcon,
  CpuChipIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { PiComputerTower } from "react-icons/pi";
import { BsPrinter } from "react-icons/bs";

// UI LIBRARY
import Avatar from "react-nice-avatar";
import { Skeleton } from 'antd';

// FILE PART
import TableTicket from './TableTicket.jsx'




export default function Profile() {
const { user } = useContext(UserContext);
let [configavatar, setConfigavatar] = useState({})
let [deviceinfo , setDeviceinfo] = useState(null)

  useEffect(()=>{
    if (user){
      setConfigavatar(JSON.parse(user.avatar))
    }
  },[user])



setTimeout(() => {
  const deviceinfo1 = [
    {
      name: "Computer",
      model: "HP PAVILION (all-in-one)",
      codename: "It-05",
      icon: CpuChipIcon,
    },
    {
      name: "Moniter",
      model: "MSI Pro MT241X",
      codename: "MNT-007",
      icon: ComputerDesktopIcon,
    },
    {
      name: "UPS",
      model: "CLEANLINE D-1000I",
      codename: "UPS-001",
      icon: PiComputerTower,
    },
    {
      name: "Printer",
      model: "HP Laser 107a",
      codename: "PRT-012",
      link: "/",
      icon: BsPrinter,
    },
    {
      name: "Software",
      model: "HP Laser 107a",
      codename: "PRT-012",
      link: "/",
      icon: BsPrinter,
    },

  ];
  setDeviceinfo(deviceinfo1)
}, 3000);


  if (!user) {
    return <Navigate to={"/"} />;
  }
  return (
    <>

      <div className="flex flex-col md:flex-row md:h-128 gap-4 md:gap-0 rounded-lg  h-max p-2 ">
        {/* Computer information /Left Zone */}
        <div className="w-full md:w-8/12 lg:w-10/12 h-max flex flex-col  md:mr-4 ">
          <span className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
            PROFILE
          </span>
          <p className="text-base leading-7 text-gray-600">
            ข้อมูล และ อุปกรณ์ของคุณ
          </p>

          <div className=" rounded-xl  p-4  ">
            <div className="w-full text-right px-4 mb-2">
              <span className="">อุปกรณ์ของคุณ</span>
            </div>

            {!deviceinfo ? (
            <div className="flex">
            <Skeleton
            avatar
            active={true}
            paragraph={{rows: 4}}/>
            <Skeleton
            avatar
            active={true}
            paragraph={{rows: 4}}/>
            <Skeleton
            avatar
            active={true}
            paragraph={{rows: 4}}/>
            <Skeleton
            avatar
            active={true}
            paragraph={{rows: 4}}/>
            </div>
            ):(
              
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:p-1 leading-6  gap-5 p-2  ">

              {deviceinfo.map((items) => (
                <div
                  key={items.codename}
                  className="flex  items-center bg-gray-200  rounded-xl p-3 "
                >
                  <div className="flex bg-white  items-center justify-center p-4 h-fit rounded-2xl md:hidden lg:hidden xl:flex">
                    {
                      <items.icon className=" w-5 h-5 text-indigo-500 xl:w-12 xl:h-12 md:w-8 md:h-8 sm:w-5 sm:h-5 " />
                    }
                  </div>
                  <div className="h-full w-full m-2">
                    <div className="h-1/5  p-2">
                      <h3 className="text-xl font-bold  text-gray-700 text-center">
                        {items.name}
                      </h3>
                    </div>
                    <div className="h-4/5 p-2 items-center text-center grid grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
                      <li className="flex gap-2 items-start ">
                        <CheckCircleIcon
                          className="h-6 w-6 flex-none text-green-500"
                          aria-hidden="true"
                        />
                        <p className=" text-sm text-left leading-5">
                          Number : {items.codename}
                        </p>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircleIcon
                          className="h-6 w-6 flex-none text-green-500 "
                          aria-hidden="true"
                        />
                        <p className=" text-sm text-left leading-5">
                          Model : {items.model}
                        </p>
                      </li>
                    </div>
                  </div>
                </div>
              ))}
              
            </div>
            )}
                        
          </div>
          {/* Tricket  */}
          <div className="mt-8 ">
          <span className="text-2xl font-semibold tracking-tight text-gray-900">
            TICKET
          </span>
          <p className="text-base leading-7 text-gray-600">
            ประวัติการเปิด Ticket ของคุณ
          </p>
          <div className="mt-3 p-4">
            <TableTicket/>
          </div>

          </div>
        </div>

        {/* Personal information */}
        <div className="flex justify-center items-center flex-col w-full md:w-4/12 lg:w-2/12   rounded-lg p-5 h-full  bg-gray-900 ">
          <div className="w-44 h-44  bg-white rounded-full flex justify-center items-center m-4  ">
            <Avatar className="w-40 h-40 absolute  "{...configavatar} />
            <button className="w-8  h-8 rounded-full relative  -bottom-16 -right-14 bg-white text-center items-center flex justify-center ">
              <Cog6ToothIcon className="h-6 w-6 hover:rotate-90 " />
            </button>
          </div>

          <form className="w-full bg-white rounded-lg h-3/4 p-4 ">
            <h3 className="text-xl font-bold  text-gray-700 text-center m-4">
              My Profile
            </h3>
            
            <div className="p-2 w-full flex flex-col gap-5 ">
                <div className="w-full " >
                  UserID
                  <input
                    type="text"
                    // value={user?.user_no}
                    value={!user.user_no ? `--` : `${user.user_no}`}
                    className="w-full	mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                    placeholder="Your UserID"
                    disabled
                  />
                </div>

                <div className="w-full ">
                  First name
                  <input
                    type="text"
                    // value={user?.firstname}
                    value={!user.firstname ? `--` : `${user.firstname}`}
                    className="w-full	mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                    placeholder="Your Firstname"
                    disabled
                  />
              </div> 
                <div className="w-full " >
                  Last name 
                  <input
                    type="text"
                    // value={user?.lastname}
                    value={!user.lastname ? `--` : `${user.lastname}`}
                    className="w-full	mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                    placeholder="Your Lastname"
                    disabled
                  />
                </div>
                <div className="w-full flex gap-3 ">
                  <div className="w-1/2">
                  Department
                  <input
                    type="text"
                    // value={user?.department}
                    value={!user.department ? `--` : `${user.department}`}
                    className="w-full	mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                    placeholder="Your Department"
                    disabled
                  />
                  </div>
                  <div className="w-1/2">
                  position
                  <input
                    type="text"
                    // value={user?.position}
                    value={!user.position ? `--` : `${user.position}`}
                    className="w-full	mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                    placeholder="Your position"
                    disabled
                  />
                  </div>
              </div> 
                <div className="w-full ">
                  Email
                  <input
                    type="text"
                    value={!user.email ? `--` : `${user.email}`}
                    className="w-full	mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                    placeholder="Your Email"
                    disabled
                  />
              </div> 
            </div>
           
          </form>
        </div>
      </div>

    </>
  );
}
