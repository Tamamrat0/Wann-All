import { Fragment, useState, useContext, useMemo, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Spin, Select, Radio, ColorPicker } from "antd";
import axios from "axios";
import Avatar, { genConfig } from "react-nice-avatar";
import { UserContext } from "../../UserContext.jsx";

// icon
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
export default function NavLoginModal({ open, setopen }) {
  const {setUser , setNotifylogin  } = useContext(UserContext);
  // ตัวแปรสำหรับเก็บข้อมูลส่ง Server
  const [username, setUserame] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  // ตัวแปรสำหรับคำนวณ
  const [cpassword, setCpassword] = useState("");
  const [listdepartment, setListepartment] = useState([]);
  const [listposition, setListPosition] = useState([]);
  // ตัวแปรสำหรับ Avatar
  const [loginstatus, setLoginstatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [signup, setSignup] = useState(false);
  const [openpassword, setOpenpassword] = useState(false);
  // ตัวแปรสำหรับ Avatar
  const [configavatar, setConfigavatar] = useState("");
  const [sexavatar, setSexavatar] = useState("man");
  const [coloravatar, setColoravatar] = useState("");

  useEffect(() => {
      axios
        .get("/auth/department")
        .then(({ data }) => {
          setListepartment(data.department);
          setListPosition(data.position);
        })
        .catch((err) => {
          console.log(err);
        });
    
  }, []);

  function handleLoginSubmit(ev) {
    ev.preventDefault();
    setLoading(true); 
    setTimeout(() => {axios.post("/auth/login", { username, password })
        .then(({ data }) => {
          setUser(data);
          setopen(false);
          setNotifylogin({
            open: true,
            detail: "Login Success",
          });
          setTimeout(()=>{
            setNotifylogin({
              open: true,
              detail: `Welcome ${data.firstname}`,
            });
          },1500)
          
        })
        .catch((err) => {
          setLoginstatus(err.response.status);
          setLoading(false);
        });
      }, 1000);
    }
    

  function handleRegisterSubmit(ev){
    ev.preventDefault();
    
    if (password === cpassword) {
      setLoading(true); 
      setTimeout(() => {
        axios.post('/auth/register', {
          username,
          firstname,
          lastname,
          password,
          department,
          position,
          configavatar
        }).then(({data})=>{
          setUser(data)
          setopen(false);
          setNotifylogin({
            open: true,
            detail: `Register Success `,
          });
          setTimeout(()=>{
            setNotifylogin({
              open: true,
              detail: `Welcome ${data.firstname}`,
            });
          },1500)
        }).catch((err)=>{
          setLoginstatus(err.response.status)
          setLoading(false); 
        })
      },1000);
    }

  }
  // สำหรับ Dropdown
  const handledepChange = (selectedValue) => {
    setDepartment(selectedValue);
  };
  const handleposChange = (selectedValue) => {
    setPosition(selectedValue);
  };

  // สำหรับ Avatar
  const defaultAvatar = {
    sex: "man",
    faceColor: "#F9C9B6",
    earSize: "small",
    eyeStyle: "smile",
    noseStyle: "long",
    mouthStyle: "peace",
    shirtStyle: "polo",
    glassesStyle: "none",
    hairColor: "#000",
    hairStyle: "thick",
    hatStyle: "none",
    hatColor: "#FC909F",
    eyeBrowStyle: "up",
    shirtColor: "#6BD9E9",
    bgColor: "#e2c37a",
  };

  const hexString = useMemo(
    () =>
      typeof coloravatar === "string" ? coloravatar : coloravatar.toHexString(),
    [coloravatar]
  );
  function randomAvatar(ev) {
    ev.preventDefault();
    setConfigavatar(
      genConfig({ sex: `${sexavatar}`, bgColor: `${hexString}`  })
    );
    // console.log(configavatar)
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setopen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  {/* <button
                    onClick={() => setopen(false)}
                    className=" absolute right-8 font-semibold text-xl top-4 bg-black text-gray-400 "
                  >
                    x
                  </button> */}
                  <Spin spinning={loading}>
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-gray-900"
                  >
                    {/* Sign in to your account */}
                    {signup
                      ? "Register your account"
                      : "Sign in to your account"}
                    <div className="bg-gray-300 h-px w-full mt-4"></div>
                  </Dialog.Title>
                  
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
                      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        {/* LOGIN */}
                        {!signup && (
                          <form 
                            className="space-y-6 "
                            onSubmit={handleLoginSubmit}
                          >
                            <div>
                              <div className="relative">
                                <span className={`${loginstatus === 401 && 'absolute left-48 font-semibold text-red-400'}`}>{loginstatus === 401 && 'รหัสนี้ถูกปิดการใช้งาน'}</span>
                                {/* <label className="block text-sm font-medium leading-6 text-gray-900 text-left"> */}
                                <label className={`block text-sm font-medium leading-6 text-left ${loginstatus === 404 ? 'text-red-500 font-bold' : 'text-gray-900 '}`}>
                                {loginstatus === 404 ? 'Username is incorrect' : 'Username'}
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    value={username}
                                    onChange={(ev) =>
                                      setUserame(ev.target.value)
                                    }
                                    className={`${loginstatus === 404 ? 'border border-red-500' : 'border border-slate-300'} mt-1 px-3 py-2 bg-white shadow-sm  placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1`} 

                                    // className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                    placeholder="Your name"
                                  />
                                </div>
                              </div>


                              <div className="flex items-center justify-between mt-4">
                                {/* <label className="block text-sm font-medium leading-6 text-gray-900"> */}
                                <label className={`block text-sm font-medium leading-6 text-left ${loginstatus === 400 ? 'text-red-500 font-bold' : 'text-gray-900 '}`}>
                                {loginstatus === 400 ? 'Password is incorrect' : 'Password'}
                                </label>
                              </div>
                              <div className="mt-2">
                                <input
                                  type={openpassword ? "text" : "password"}
                                  value={password}
                                  onChange={(ev) =>
                                    setPassword(ev.target.value)
                                  }
                                  className={`${loginstatus === 400 ? 'border border-red-500' : 'border border-slate-300'} mt-1 px-3 py-2 bg-white shadow-sm  placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1`} 

                                  // className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                  placeholder="Az 0123 0-8"
                                />
                                <div className="absolute right-10 transform -translate-y-7 text-xl cursor-pointer">
                                  {!openpassword ? (
                                    <AiOutlineEye
                                      onClick={() => setOpenpassword(true)}
                                    />
                                  ) : (
                                    <AiOutlineEyeInvisible
                                      onClick={() => setOpenpassword(false)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              {/* <button className="flex w-full justify-center rounded-md bg-indigo-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Sign in
                              </button> */}
                              <button disabled={!username || !password}  
                              className={`${!username || !password ? ' cursor-not-allowed':'hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'} flex w-full justify-center rounded-md bg-indigo-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm `}>
                                 Sign in
                              </button>
                              <div className="mt-2 ">
                                <span>
                                  Don't have an account ?
                                  <a
                                    className="font-bold"
                                    onClick={() => {
                                      setSignup(true);
                                    }}
                                  >
                                    Register!
                                  </a>
                                </span>
                              </div>
                            </div>
                          </form>
                        )}
                        {/* REGISTER */}
                        {signup && (
                          <form
                            className="space-y-6 "
                            onSubmit={handleRegisterSubmit}
                          >
                            <div>
                              <div>
                            
                                <label className={`block text-sm font-medium leading-6 text-left ${loginstatus === 400 ? 'text-red-500 font-bold' : 'text-gray-900 '}`}>
                                  {loginstatus === 400 ? 'Username already exists' : 'Username'}
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    value={username}
                                    onChange={(ev) =>
                                      setUserame(ev.target.value)
                                    }
                                    className={`${loginstatus === 400 ? 'border border-red-500' : 'border border-slate-300'} mt-1 px-3 py-2 bg-white shadow-sm  placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1`} 
                                    placeholder="Your name"
                                  />
                                </div>
                              </div>
                              <div className="mt-4 w-full flex text-left gap-4">
                                <div className="w-1/2 ">
                                  First name
                                <input
                                    type="text" value={firstname} onChange={(ev) => setFirstname(ev.target.value)}
                                    className="w-40	 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                                    placeholder="Your Firstname"
                                  />
                                </div>
                                <div className="w-1/2 ">
                                  Last name
                                  <input
                                    type="text" value={lastname} onChange={(ev) => setLastname(ev.target.value)}
                                    className="w-40	mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block  rounded-md sm:text-sm focus:ring-1"
                                    placeholder="Your Lastname"
                                  />
                                  </div>
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                  Password
                                </label>
                              </div>
                              <div className="mt-2">
                                <input
                                  type={openpassword ? "text" : "password"}
                                  value={password}
                                  onChange={(ev) =>
                                    setPassword(ev.target.value)
                                  }
                                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                  placeholder="Az 0123 0-8"
                                />
                                <div className="absolute right-10 transform -translate-y-7 text-xl cursor-pointer">
                                  {!openpassword ? (
                                    <AiOutlineEye
                                      onClick={() => setOpenpassword(true)}
                                    />
                                  ) : (
                                    <AiOutlineEyeInvisible
                                      onClick={() => setOpenpassword(false)}
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                                </label>
                              </div>
                              <div className="mt-2">
                                <input
                                  type={openpassword ? "text" : "password"}
                                  value={cpassword}
                                  onChange={(ev) =>
                                    setCpassword(ev.target.value)
                                  }
                                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                  placeholder="Az 0123 0-8"
                                />
                                
                                <div className="absolute right-10 transform -translate-y-7 text-xl cursor-pointer">
                                  {password === cpassword && !!password && !!cpassword &&(
                                    <div className="absolute right-7 cursor-default"><BsCheck/></div>
                                  )}
                                
                                  {!openpassword ? (
                                    <AiOutlineEye
                                      onClick={() => setOpenpassword(true)}
                                    />
                                  ) : (
                                    <AiOutlineEyeInvisible
                                      onClick={() => setOpenpassword(false)}
                                    />
                                  )}
                                  
                                </div>
                              </div>
                              {/* ---------------------- */}
                              <div className="flex items-center mt-4 w-full">
                                <label className="w-1/2 text-left pl-2 text-sm font-medium leading-6 text-gray-900">
                                  Department
                                </label>
                                <label className="w-1/2 text-left pl-2 text-sm font-medium leading-6 text-gray-900">
                                  Position
                                </label>
                              </div>

                              <div className="left-px flex justify-between gap-2">
                                {/* DEPARTMENT */}
                                <Select
                                  className="top-1"
                                  showSearch
                                  style={{
                                    width: 167,
                                  }}
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
                                  // value={listdepartment}
                                  onChange={handledepChange}
                                  options={listdepartment?.map((res) => ({
                                    value: res?.id,
                                    label: res?.department,
                                  }))}
                                />
                                <Select
                                  className="top-1"
                                  showSearch
                                  style={{
                                    width: 167,
                                  }}
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
                                  onChange={handleposChange}
                                  options={listposition.map((res) => ({
                                    value: res?.id,
                                    label: res?.position,
                                  }))}
                                />
                              </div>
                              <div className="w-full  mt-6 flex">
                                <div className="w-1/2  mt-5 ">
                                  {configavatar ? (
                                    <Avatar
                                      className="w-32 h-32"
                                      {...configavatar}
                                    />
                                  ) : (
                                    <Avatar
                                      className="w-32 h-32"
                                      {...defaultAvatar}
                                    />
                                  )}
                                </div>
                                <div className="px-2 mt-2  flex-col justify-center items-center">
                                  <div className="mb-1">
                                    <label className="text-base">
                                      Character
                                    </label>
                                  </div>
                                  <Radio.Group
                                    defaultValue="man"
                                    buttonStyle="solid"
                                    size="md"
                                    onChange={(ev) => {
                                      setSexavatar(ev.target.value);
                                    }}
                                  >
                                    <Radio.Button value="man">
                                      Male
                                    </Radio.Button>
                                    <Radio.Button value="woman">
                                      Female
                                    </Radio.Button>
                                  </Radio.Group>
                                  <div className="mt-3 flex ">
                                    <div className="w-60 text-sm">
                                      <ColorPicker
                                        trigger="hover"
                                        format={"hex"}
                                        value={coloravatar}
                                        onChange={setColoravatar}
                                        showText={() => (
                                          <span>Background colors</span>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <button
                                      className="bg-blue-500	 rounded-md px-7 py-2  text-white "
                                      onClick={randomAvatar}
                                    >
                                      Generate
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {/* ---------------------- */}
                            </div>

                            <div>
                              <button disabled={!username || !firstname || !lastname || !password || !cpassword || !department || !position|| !configavatar ||password !== cpassword}  
                              className={`${!username || !firstname || !lastname || !password || !cpassword || !department || !position || !configavatar ||password !== cpassword ?  ' cursor-not-allowed':'hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'} flex w-full justify-center rounded-md bg-indigo-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm `}>
                                Register
                              </button>
                              <div className="mt-2 ">
                                <span>
                                  You already have an account ?
                                  <a
                                    className="font-bold"
                                    onClick={() => {
                                      setSignup(false);
                                    }}
                                  >
                                    Sgin in!
                                  </a>
                                </span>
                              </div>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
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
