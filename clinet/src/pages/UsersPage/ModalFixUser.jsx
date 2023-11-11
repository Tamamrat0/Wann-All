import { Fragment, useState, useEffect, useContext } from "react";
import moment from 'moment';
import axios from "axios";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { Spin, Select, Switch, Tooltip, ConfigProvider ,theme} from "antd";
import { BsCheck } from "react-icons/bs";
import { TbHistory } from "react-icons/tb";
import { MdKeyboardBackspace } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Socket } from "socket.io-client";
import {PageContext} from "../../PageContext.jsx";
export default function ModalFixUser({
  open,
  setopen,
  selectrow,
  setSelectrow,
  setNoti,
  listdepartment,
  listposition,
  setDatausers,
  socket,
  datausers,
  listpermission
}) {
  const [department, setDepartment] = useState(selectrow.department_id);
  const [position, setPosition] = useState(selectrow.position_id);
  const [permission, setPermission] = useState(selectrow.permission_id);
  const [loading, setLoading] = useState(false);
  const [userid, setUserid] = useState(selectrow.emp_no);
  const [firstname, setFirstname] = useState(selectrow.firstname);
  const [lastname, setLastname] = useState(selectrow.lastname);
  const [email, setEmail] = useState(
    JSON.parse(selectrow.email) === null ? "" : selectrow.email
  );
  const [username , setUsername] = useState('');
  const [password , setPassword] = useState('');
  const [cpassword , setCpassword] = useState('');
  const [resetpassword , setResetpassword] = useState('');
  const [cresetpassword , setCresetpassword] = useState('');
  const [openpassword , setOpenpassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Detail");
  const [optionswitch, setOptionswitch] = useState(true);
  const [resetpass, setResetpass] = useState(false);
  const [adduser, setAdduser] = useState(false);
  const [onhistory, setOnhistory] = useState(false);
  const [historydetail , setHistorydetail] = useState(null)
  const headertabs = [{ label: "Detail" }, { label: "Login" }];
  const [themes , setThemes] = useState('')
  const {darkmode} = useContext(PageContext);
  const handledepChange = (selectedValue) => {
    setDepartment(selectedValue);
  };

  const handleposChange = (selectedValue) => {
    setPosition(selectedValue);
  };
  useEffect(()=>{
    const { darkAlgorithm , defaultAlgorithm} = theme;
    if(darkmode){
      setThemes({algorithm: [darkAlgorithm]})
    }else{
      setThemes({algorithm: [defaultAlgorithm]})
    }
  },[darkmode])
// console.log(selectrow)
// console.log(permission)
  const textdata = [
    {
      label: "UserId",
      onChange: setUserid,
      value: selectrow.emp_no,
      newvalue: userid,
      type: 1,
      err: 400,
    },
    {
      label: "สิทธิ์การใช้งาน",
      onChange: setPermission,
      value: selectrow.permission_id,
      newvalue: permission, 
      type: 2,
      err: 400,
      options: listpermission,
      prop: "per_name"
    },
    {
      label: "ชื่อจริง",
      onChange: setFirstname,
      value: selectrow.firstname,
      newvalue: firstname,
      type: 1,
    },
    {
      label: "นามสกุล",
      onChange: setLastname,
      value: selectrow.lastname,
      newvalue: lastname,
      type: 1,
    },
    {
      label: "email",
      onChange: setEmail,
      value: JSON.parse(selectrow.email) === null ? "" : selectrow.email,
      newvalue: email,
      type: 1,
    },
    { label: "", onChange: "", value: "", newvalue: "", type: 3 },

    {
      label: "department",
      onChange: handledepChange,
      value: selectrow.department_id,
      newvalue: department,
      type: 2,
      options: listdepartment,
      prop: "department",
    },
    {
      label: "position",
      onChange: handleposChange,
      value: selectrow.position_id,
      newvalue: position,
      type: 2,
      options: listposition,
      prop: "position",
    },
  ];




  async function activate_employees(value) {
    setLoading(true);
    axios
      .post("/users/activate", {
        idemploy: selectrow.id,
        value: value,
        detail: value ? "เปิดแสดงรายชื่อผู้ใช้งาน" : "ปิดแสดงรายชื่อผู้ใช้งาน",
      })
      .then(({ data }) => {

        setDatausers(
          data.map((items) => ({
            ...items,
            key: JSON.stringify(items.id),
          }))
        );

        const data_select = data.find((item) => item.id === selectrow.id);

        setSelectrow(() => ({
          ...data_select,
          key: JSON.stringify(data_select.id),
        }));


        socket.emit('onedit_user' , data);

        setLoading(false);

        setNoti([
          {
            description: selectrow.activate
              ? "ปิดใช้งานผู้ใช้สำเร็จ"
              : "เปิดใช้งานผู้ใช้สำเร็จ",
            icon: 1,
            key: Date.now(),
          },
        ]);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function activate_login(value) {
     setLoading(true);
    axios
      .post("/users/activate_login", {
        idlogin: selectrow.user_account,
        value: value,
      })
      .then(({ data }) => {

        setDatausers(
          data.map((items) => ({
            ...items,
            key: JSON.stringify(items.id),
          }))
        );


        const data_select = data.find((item) => item.id === selectrow.id);
        setSelectrow(() => ({
          ...data_select,
          key: JSON.stringify(data_select.id),
        }));

        socket.emit('onedit_user' , data);

        // socket.emit('edit_user' , data);

        setLoading(false);

        setNoti([
          {
            description: selectrow.activate_login
              ? "ปิดใช้งานผู้ใช้สำเร็จ"
              : "เปิดใช้งานผู้ใช้สำเร็จ",
            icon: 1,
            key: Date.now(),
          },
        ]);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function handleUpdate() {
    setLoading(true);
    let resultdata = [];
    if (selectrow.emp_no !== userid) {
      const newdata = {
        box: "userid",
        detail: `ก่อนแก้ ${selectrow.emp_no} หลังแก้ ${userid}`,
      };
      resultdata.push(newdata);
    }

    if (selectrow.firstname !== firstname) {
      const newdata = {
        box: "ชื่อจริง",
        detail: `ก่อนแก้ ${selectrow.firstname} หลังแก้ ${firstname}`,
      };
      resultdata.push(newdata);
    }
    if (selectrow.lastname !== lastname) {
      const newdata = {
        box: "นามสกุล",
        detail: `ก่อนแก้ ${selectrow.lastname} หลังแก้ ${lastname}`,
      };
      resultdata.push(newdata);
    }

    if (
      (JSON.parse(selectrow.email) === null ? "" : selectrow.email) !== email
    ) {
      const newdata = {
        box: "email",
        detail: `ก่อนแก้ ${
          JSON.parse(selectrow.email) === null ? "" : selectrow.email
        } หลังแก้ ${email}`,
      };
      resultdata.push(newdata);
    }

    if (selectrow.department_id !== department) {
      const foundDepartment = listdepartment.find(
        (item) => item.id === department
      );
      const newdata = {
        box: "แผนก",
        detail: `ก่อนแก้ ${selectrow.department} หลังแก้ ${foundDepartment.department}`,
      };
      resultdata.push(newdata);
    }

    if (selectrow.position_id !== position) {
      const foundPosition = listposition.find((item) => item.id === position);
      const newdata = {
        box: "ตำแหน่ง",
        detail: `ก่อนแก้ ${selectrow.position} หลังแก้ ${foundPosition.position}`,
      };
      resultdata.push(newdata);
    }

    if (selectrow.per_name !== permission) {
      const foundper = listpermission.find((item) => item.id === permission);
      const newdata = {
        box: "สิทธิ์การใช้งาน",
        detail: `ก่อนแก้ ${selectrow.per_name} หลังแก้ ${foundper.per_name}`,
      };
      resultdata.push(newdata);
    }

    console.log(permission);
    axios
      .post("/users/editemploy", {
        idselectuser: selectrow.id,
        userid,
        firstname,
        lastname,
        email,
        department,
        position,
        permission,
        resultdata,
      })
      .then(({ data }) => {
        setDatausers(
          data.map((items) => ({
            ...items,
            key: JSON.stringify(items.id),
          }))
        );

        const data_select = data.find((item) => item.id === selectrow.id);

        setSelectrow(() => ({
          ...data_select,
          key: JSON.stringify(data_select.id),
        }));

        socket.emit('onedit_user' , data);

        setNoti([
          {
            description: "แก้ไขข้อมูลสำเร็จ",
            icon: 1,
            key: Date.now(),
          },
        ]);
        setLoading(false);
        setopen(false)
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  async function  handleHistory (){
    setOnhistory(true);
  try {
    const response = await axios.post('/users/history', { idemploy: selectrow.id });
    // const data = JSON.parse(response.data.update_detail);
   

    
    const formattedHistory = response.data.map(item => ({
      ...item,
      date: moment(item.date).format('DD-MM-YYYY HH:mm:ss')
    }));
    // console.log(formattedHistory)
     setHistorydetail(formattedHistory);
     
  } catch (error) {
    // จัดการเมื่อเกิดข้อผิดพลาด
  }
    
  }
  
  function handleResetPass(){
      setLoading(true)
    axios.post('users/resetpassword',{
      idlogin:selectrow.user_account,
      password:resetpassword
    }).then(({data})=>{
      setResetpass(false)
      setLoading(false)
      setResetpassword('')
      setCresetpassword('')
      setNoti([
        {
          description: "แก้ไขรหัสสำเร็จ",
          icon: 1,
          key: Date.now(),
        },
      ]);
    }).catch((err)=>{
      setLoading(false)
    })
  }
  function handleNewaccount(){
      setLoading(true)
    axios.post('users/addaccount',{
      idemploy:selectrow.id,
      username,
      password
    }).then(({data})=>{

      setPassword('')
      setCpassword('')
      
      setDatausers(
        data.map((items) => ({
          ...items,
          key: JSON.stringify(items.id),
        }))
      );

      const data_select = data.find((item) => item.id === selectrow.id);

      setSelectrow(() => ({
        ...data_select,
        key: JSON.stringify(data_select.id),
      }));

      socket.emit('onedit_user' , data);

      setLoading(false)
      setNoti([
        {
          description: "เพิ่มผู้ใช้งานสำเร็จ",
          icon: 1,
          key: Date.now(),
        },
      ]);
    }).catch((err)=>{
      setLoading(false)
    })
  }


  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-30 " onClose={setopen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black backdrop-blur-[5px] bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center   text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-129 max-w-md  transform overflow-hidden rounded-2xl bg-background dark:bg-dark-background p-6 text-left align-middle shadow-xl transition-all ">
                  <Spin spinning={loading}>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-text dark:text-dark-text-color"
                    >
                      ตั้งค่าผู้ใช้งาน
                    </Dialog.Title>

                    <div className="w-full  max-w-md px-2 mt-4 sm:px-0 ">
                      <Tab.Group>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 dark:bg-dark-second p-1 drop-shadow-md">
                          {headertabs.map((item) => (
                            <Tab
                              key={item.label}
                              onClick={() => setSelectedTab(item.label)}
                              className={` w-full rounded-lg py-2.5 text-sm font-medium leading-5 focus:outline-none
                            ${
                              selectedTab === item.label
                                ? "bg-background dark:bg-dark-background shadow text-primary dark:text-dark-primary font-extrabold"
                                : "text-text dark:text-dark-text-color hover:bg-white/[0.12] "
                            }`}
                            >
                              {item.label}
                            </Tab>
                          ))}
                        </Tab.List>
                      </Tab.Group>

                      {selectedTab === "Detail" && (
                        <div
                          className={`flex flex-col  w-full bg-background dark:bg-dark-background border dark:border-dark-second drop-shadow-sm 
                        rounded-xl mt-3 px-8 py-4 duration-500  ${
                          onhistory ? "h-130" : ""
                        }`}
                        >
                          {onhistory ? (
                            <>
                            <div className="flex flex-col w-full">

                             <div className="flex w-full justify-center items-center relative">
                              <span className="font-bold text-text dark:text-dark-text-color" >ประวัติการแก้ไข</span>
                              <MdKeyboardBackspace 
                              onClick={()=>setOnhistory(()=>!onhistory)}
                              className="h-6 w-6 text-text dark:text-dark-text-color cursor-pointer absolute left-0 "/>
                               </div>

                               <div className="mt-5 w-full h-80 gap-3 flex flex-col overflow-y-scroll  ">
                                {historydetail?.map((item) => (

                                <div key={item.date} className="w-full flex flex-col text-text dark:text-dark-text-color  bg-gray-color dark:bg-dark-second rounded-md  shadow-md px-3 py-2">
                                  <div className="w-full flex justify-between">
                                    <span>{item.date}</span>
                                    <span className="font-bold">ผู้แก้ไข : <span className="font-normal">{item.editor}</span></span>
                                  </div>
                                  <div className="flex w-full flex-col mt-2 ">
               
                                    <span className="px-2 font-bold mb-1">รายละเอียด</span>

                                    {typeof item.detail === 'string' ? (
                                     <span>{item.detail}</span> 
                                    ):(
                                      <div>
                                      {item.detail.map((detailItem, index) => (
                                        <div key={index} className="flex flex-col my-1">
                                          <span className="font-semibold">แก้ไข {detailItem.box}</span>
                                          <span className="">{detailItem.detail}</span>
                                        </div>
                                      ))}
                                    </div>
                                    )}
                                    
                                  </div>
                                </div>
                                ))}

                               </div>

                            </div>
                            </>
                          ) : (
                            <>
                              {/* SWitch */}
                              <div className="flex justify-end gap-3 items-center mr-16 relative">
                                <span className="font-medium  text-text dark:text-dark-text-color">
                                  แสดงรายชื่อผู้ใช้งาน
                                </span>
                                <ConfigProvider theme={themes}>
                                <Switch
                                  className=" w-2 bg-gray-color "
                                  defaultChecked={selectrow.activate}
                                  onChange={(newValue) =>
                                    activate_employees(newValue)
                                  }
                                />
                                </ConfigProvider>
                                <span className=" absolute -right-16 text-text dark:text-dark-text-color">
                                  {selectrow.activate
                                    ? "เปิดใช้งาน"
                                    : "ปิดใช้งาน"}
                                </span>
                              </div>

                              {/* DETAIL */}

                          <div className="mt-8 w-full grid grid-cols-2 gap-4  relative">
                            {textdata.map((item) => (
                              <div key={item.label} className="flex flex-col ">
                                <span className=" font-medium  text-text dark:text-dark-text-color px-3 relative">
                                  {item.label}
                                  <span className="absolute right-0">
                                    {item.newvalue !== item.value
                                      ? `มีการแก้ไข`
                                      : ""}
                                  </span>
                                </span>

                                {item.type === 1 && (
                                  <input
                                    type="text"
                                    placeholder=""
                                    onChange={(event) =>
                                      item.onChange(event.target.value)
                                    }
                                    defaultValue={item.value}
                                    className={`pl-4 text-sm focus:shadow-md lg:w-auto   flex-auto rounded-lg border border-solid
                                    border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 pr-3
                                     text-gray-700 dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary
                                     ${item.newvalue !== item.value && 'ring-2 ring-primary dark:ring-dark-primary' }`}
                                  />
                                )}

                                {item.type === 2 && (
                                  <ConfigProvider  theme={themes}>
                                  <Select
                                    className={`${
                                      item.newvalue !== item.value
                                        ? "ring-2	ring-blue-400 rounded-md"
                                        : ""
                                    }`}
                                    showSearch
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      (option?.label ?? "").includes(input)
                                    }
                                    filterSort={(optionA, optionB) =>
                                      (optionA?.label ?? "")
                                        .toLowerCase()
                                        .localeCompare(
                                          (optionB?.label ?? "").toLowerCase()
                                        )
                                    }
                                    defaultValue={item.value}
                                    onChange={item.onChange}
                                    options={item.options?.map(
                                      (res, index) => ({
                                        key: `${res?.id}-${index}`,
                                        value: res?.id,
                                        label: res?.[item?.prop],
                                      })
                                    )}
                                  />
                                  </ConfigProvider>
                                )}
                              </div>
                            ))}
                          </div>
                            </>
                          )}

                          
                        </div>
                      )}
                      {selectedTab === "Login" && (
                        <div
                          className={`flex flex-col items-center h-130  duration-500 w-full  border dark:border-dark-second drop-shadow-sm rounded-xl mt-3 px-8 py-4  `}
                        >
                          {selectrow.username === null ? (
                            <div className="flex flex-col w-full mt-10  justify-center items-center ">
                              <span className="text-text dark:text-dark-text-color font-semibold text-xl">
                                {adduser
                                  ? `สร้างรหัสให้ผู้ใช้ : ${selectrow.firstname}`
                                  : "ผู้ใช้นี้ไม่มีรหัส Login"}
                              </span>

                              {/* สำรหับกดเพิ่มรหัส */}
                              <div
                                className={`mt-6 w-full duration-500 ${
                                  !adduser
                                    ? " overflow-hidden h-0 hidden opacity-0"
                                    : " flex-col flex"
                                }`}
                              >
                                <span className=" font-medium  text-text dark:text-dark-text-color px-3">
                                  Username
                                </span>
                                
                                <input
                                  type="text"
                                  placeholder=""
                                  value={username}
                                  onChange={(ev) =>
                                    setUsername(ev.target.value)
                                  }
                                  className={`pl-2 mt-1 pr-16 text-sm focus:shadow-md lg:w-full   rounded-lg border border-solid
                                  border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 
                                  text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none 
                                  focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                                />
                                

                                <span className="mt-4 font-medium  text-text dark:text-dark-text-color px-3">
                                  รหัสผ่าน
                                </span>
                                <div className="flex w-full relative">
                                <input
                                  type= {openpassword ? 'text' : 'password'}
                                  placeholder=""
                                  value={password}
                                  onChange={(ev) =>
                                    setPassword(ev.target.value)
                                  }
                                  className={`pl-2 mt-1 pr-16 text-sm focus:shadow-md lg:w-full   rounded-lg border border-solid
                                  border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 
                                  text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none 
                                  focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                                />
                                    <AiOutlineEye 
                                    onClick={()=>setOpenpassword(()=>!openpassword)}
                                    className={`absolute right-2 top-2 w-6 h-6 text-text dark:text-dark-text-color  duration-500 cursor-pointer ${openpassword ? 'h-0 opacity-0 hidden' : ''} `}/>
                                    <AiOutlineEyeInvisible 
                                    onClick={()=>setOpenpassword(()=>!openpassword)}
                                    className={`absolute right-2 top-2 w-6 h-6 text-text dark:text-dark-text-color  duration-500 cursor-pointer ${!openpassword ? 'h-0 opacity-0 hidden' : ''}`}/>

                                </div>
                                <span className="mt-4 font-medium  text-text dark:text-dark-text-color px-3">
                                  ยืนยันรหัสผ่าน
                                </span>
                                <div className="flex w-full relative">
                                <input
                                  type= {openpassword ? 'text' : 'password'}
                                  placeholder=""
                                  value={cpassword}
                                  onChange={(ev) =>
                                    setCpassword(ev.target.value)
                                  }
                                  className={`pl-2 mt-1 pr-16 text-sm focus:shadow-md lg:w-full   rounded-lg border border-solid
                                  border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 
                                  text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none 
                                  focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                                />
                                <BsCheck className={`absolute right-2 top-2 w-6 h-6 text-text dark:text-dark-text-color  duration-500 ${password === cpassword && !!password && !!cpassword ? '' : 'opacity-0 h-0'}"`}/>
                                      </div>
                                <div className="flex w-full mt-6 justify-end">
                                  <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-text dark:text-dark-text-color hover:text-error hover:dark:text-dark-error "
                                    onClick={() => setAdduser(false)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className={` ${password !== cpassword  || !password  || !cpassword || !username ? ' cursor-not-allowed' : ' cursor-pointer hover:bg-blue-300 '} duration-500 relative inline-flex justify-center rounded-md w-3/6 border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 `}
                                    disabled={password !== cpassword  || !password  || !cpassword || !username }
                                    onClick={handleNewaccount}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                              {/* end สำรหับกดเพิ่มรหัส */}
                              {/* สำหรับปุ่มเพิ่ม รหัส */}

                                <div >
                                  <Tooltip title="เพิ่มรหัส Login">
                                <button
                                  onClick={() => setAdduser(() => !adduser)}
                                  className={`w-48 h-28 mt-12  bg-background dark:bg-dark-second rounded-xl p-2 hover:bg-gray-100 duration-500
                                  relative border-2 border-dashed   justify-center items-center ${
                                    adduser
                                ? "h-0 overflow-hidden hidden opacity-0"
                                : "flex"
                            }`}
                                >
                                  <p className=" text-text dark:text-dark-text-color text-6xl  ">+</p>
                                </button>
                              </Tooltip>
                                </div>
                              {/* end สำหรับปุ่มเพิ่ม รหัส */}
                            </div>
                          ) : (
                            <div className="flex flex-col  w-full  ">
                              {/* SWitch */}
                           
                              <div className="flex justify-end gap-3 items-center mr-16 relative">
                                
                                <span className="font-medium  text-text dark:text-dark-text-color">
                                  เปิดใช้งานรหัส
                                </span>
                                <Switch
                                  className="bg-gray-200 w-2"
                                  defaultChecked={selectrow.activate_login}
                                  onChange={(newValue) =>
                                    activate_login(newValue)
                                  }
                                />
                                <span className=" absolute -right-16 text-text dark:text-dark-text-color">
                                  {optionswitch ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                </span>
                              </div>
                              {/* DETAIL */}
                              <div className=" mt-12 w-full flex flex-col justify-center items-center  ">
                                <span className="font-bold text-text dark:text-dark-text-color text-base">
                                  รหัสเข้าสู่ระบบของผู้ใช้ : {selectrow.firstname}
                                </span>
                                <div className="mt-6 flex flex-col text-left w-full">
                                  <span className=" font-medium  text-text dark:text-dark-text-color px-3">
                                    Username
                                  </span>
                                  <input
                                    type="text"
                                    placeholder=""
                                    defaultValue={selectrow.username}
                                    disabled={true}
                                    className={`pl-4 text-sm focus:shadow-md lg:w-auto   flex-auto rounded-lg border border-solid
                                    border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 pr-3
                                    text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                                 
                                 />

                                  <div
                                    className={`flex flex-col duration-500 ${
                                      resetpass
                                        ? ""
                                        : "opacity-0 h-0 overflow-hidden"
                                    } `}
                                  >
                                    <span className=" mt-2 font-medium  text-text dark:text-dark-text-color px-3">
                                      รหัสผ่านใหม่
                                    </span>
                                    <div className="flex w-full relative">
                                    <input
                                      type= {openpassword ? 'text' : 'password'}
                                      placeholder=""
                                      value={resetpassword}
                                      onChange={(ev) =>
                                        setResetpassword(ev.target.value)
                                      }
                                      className={`pl-2 mt-1 pr-16 text-sm focus:shadow-md lg:w-full   rounded-lg border border-solid
                                      border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 
                                      text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none 
                                      focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                                    />
                                    <AiOutlineEye 
                                    onClick={()=>setOpenpassword(()=>!openpassword)}
                                    className={`absolute right-2 top-2 w-6 h-6 text-text dark:text-dark-text-color  duration-500 cursor-pointer ${openpassword ? 'h-0 opacity-0 hidden' : ''} `}/>
                                    <AiOutlineEyeInvisible 
                                    onClick={()=>setOpenpassword(()=>!openpassword)}
                                    className={`absolute right-2 top-2 w-6 h-6 text-text dark:text-dark-text-color  duration-500 cursor-pointer ${!openpassword ? 'h-0 opacity-0 hidden' : ''}`}/>
                                    </div>
                                    <span className="mt-2 font-medium  text-text dark:text-dark-text-color px-3">
                                      ยืนยันรหัสผ่านใหม่
                                    </span>
                                    <div className="flex w-full relative">
                                    <input
                                      type= {openpassword ? 'text' : 'password'}
                                      placeholder=""
                                      value={cresetpassword}
                                      onChange={(ev) =>
                                        setCresetpassword(ev.target.value)
                                      }
                                      className={`pl-2 mt-1 pr-16 text-sm focus:shadow-md lg:w-full   rounded-lg border border-solid
                                      border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 
                                      text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none 
                                      focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}                                    />
                                    <BsCheck className={`absolute right-2 top-2 w-6 h-6 text-gray-500  duration-500 ${resetpassword === cresetpassword && !!resetpassword && !!cresetpassword ? '' : 'opacity-0 h-0'}"`}/>
                                      </div>
                                    
                                  </div>
                                  <div className="flex w-full mt-6">
                                    <button
                                      type="button"
                                      className={`${resetpass  ? ' opacity-0 h-0 hidden':''} duration-500 relative inline-flex justify-center rounded-md w-3/6 border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-dark-primary focus-visible:ring-offset-2 `}
                                      onClick={() => setResetpass(() => !resetpass)}>
                                      Reset password
                                    </button>
                                    <button
                                      type="button"
                                      className={`${ !resetpass ? 'opacity-0 h-0 hidden':''} ${resetpassword !== cresetpassword  || !resetpassword  || !cresetpassword || !resetpass ? ' cursor-not-allowed' : ' cursor-pointer hover:bg-blue-300 '} duration-500 relative inline-flex justify-center rounded-md w-3/6 border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-dark-primary focus-visible:ring-offset-2 `}
                                      disabled={resetpassword !== cresetpassword  || !resetpassword  || !cresetpassword || !resetpass}
                                      onClick={handleResetPass}>
                                     Save
                                    </button>
                                    <button
                                      type="button"
                                      className={` justify-center rounded-md px-4 py-2 text-sm font-medium text-text dark:text-dark-text-color
                                        ${
                                          resetpass
                                            ? "inline-flex"
                                            : "overflow-hidden opacity-0 hidden"
                                        } hover:text-error hover:dark:text-dark-error `}
                                      onClick={() =>
                                        setResetpass(() => !resetpass)
                                      }
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>

                          
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    <footer
                      className={`mt-6 flex justify-end w-full relative duration-300 ${
                        selectedTab === "Login" || onhistory
                          ? "opacity-0 h-0 overflow-hidden"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-text dark:text-dark-text-color hover:text-error dark:hover:text-dark-error "
                        onClick={() => setopen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className={` ${
                          selectrow.emp_no === userid &&
                          selectrow.firstname === firstname &&
                          selectrow.lastname === lastname &&
                          (JSON.parse(selectrow.email) === null
                            ? ""
                            : selectrow.email) === email &&
                          selectrow.department_id === department &&
                          selectrow.position_id === position && 
                          selectrow.permission_id === permission
                            ? " cursor-not-allowed"
                            : "hover:bg-blue-300 "
                        } inline-flex justify-center rounded-md w-2/6 border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 
                        text-sm font-medium text-white 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                        focus-visible:ring-offset-2`}
                        onClick={handleUpdate}
                        disabled={
                          selectrow.emp_no === userid &&
                          selectrow.firstname === firstname &&
                          selectrow.lastname === lastname &&
                          (JSON.parse(selectrow.email) === null
                            ? ""
                            : selectrow.email) === email &&
                          selectrow.department_id === department &&
                          selectrow.position_id === position && 
                          selectrow.permission_id === permission
                        }
                      >
                        Update
                      </button>
                      
                      <button
                        onClick={handleHistory}
                        className=" absolute cursor-pointer left-2 -top-1 border p-2 rounded-full
                       duration-500 hover:bg-primary hover:text-white dark:hover:bg-dark-primary dark:hover:text-white hover:rotate-45 text-text dark:text-dark-text-color"
                      >
                        <Tooltip title="ดูประวัติการแก้ไข">
                          <div>
                        <TbHistory className="w-6 h-6  " />
                          </div>
                        </Tooltip>
                      </button>
                      
                    </footer>
                  </Spin>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
