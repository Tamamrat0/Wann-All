import { Fragment, useState, useEffect , useContext } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Spin, Select, Switch , ConfigProvider , theme } from "antd";
import Avatar, { genConfig } from "react-nice-avatar";
import {PageContext} from "../../PageContext.jsx";
export default function ModalAddUser({open,setopen,setDatausers,setNoti,listdepartment,listposition,listpermission,socket}) {
  let [isOpen, setIsOpen] = useState(true);

  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [permission, setPermission] = useState("");
  const [loading, setLoading] = useState(false);
  const [userid, setUserid] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("");
  let [configavatar, setConfigavatar] = useState("");
  let [errstatus, setErrstatus] = useState("");
  const {darkmode} = useContext(PageContext);
  const [themes , setThemes] = useState('')

  useEffect(()=>{
    const { darkAlgorithm , defaultAlgorithm} = theme;
    if(darkmode){
      
      setThemes({algorithm: [darkAlgorithm]})
    }else{
      setThemes({algorithm: [defaultAlgorithm]})
    }
  },[darkmode])
  
console.log(listdepartment)
console.log(listposition)


  const handledepChange = (selectedValue) => {
    setDepartment(selectedValue);
  };
  const handlesexChange = (selectedValue) => {
    setSex(selectedValue);
  };
  const handleposChange = (selectedValue) => {
    setPosition(selectedValue);
  };
  const handleperChange = (selectedValue) => {
    setPermission(selectedValue);
  };

  useEffect(() => {
    setConfigavatar(genConfig({ sex: `${sex}`,"faceColor": "#F9C9B6" , isGradient: true }));
  }, [sex]);

  const textdata = [
    { label: "UserId", placeholder: "", value: setUserid, option:'', onchange: '' ,  err: 400 , type:'text' },
    { label: "ชื่อจริง", placeholder: "", value: setFirstname , option:'', onchange: '' , err: 0 , type:'text'},
    { label: "นามสกุล", placeholder: "", value: setLastname, option:'', onchange: '' , err: 0 , type:'text' },
    { label: "Email", placeholder: "", value: setEmail , option:'', onchange: '' , err: 0 , type:'text'},
    { label: "เพศ", placeholder: "", value: '', option: [{id:'man' , sex:'ชาย'},{id:'woman' , sex:'หญิง'}], onchange:handlesexChange , onoption: 'sex' , err: 400 , type:'select' },
    { label: "แผนก", placeholder: "", value: '' ,  option: listdepartment , onchange:handledepChange , onoption: 'department' , err: 0 , type:'select'},
    { label: "ตำแหน่ง", placeholder: "", value: '',  option: listposition , onchange:handleposChange , onoption: 'position' , err: 0 , type:'select' },
    { label: "สิทธิการใช้งาน", placeholder: "", value: '' , option: listpermission , onchange: handleperChange , onoption: 'per_name' , err: 0 , type:'select'},
  ];

  function Handleadduser(ev) {
    ev.preventDefault();
    setLoading(true);
    axios.post("/users/adduser", {
        userid,
        firstname,
        lastname,
        email,
        department,
        position,
        permission,
        configavatar,
      }).then(({data}) => {
        socket.emit('onedit_user' , data);
        console.log(1)
        setDatausers(
          data.map((items) => ({
            ...items,
            key: JSON.stringify(items.id),
          }))
        );
        setopen(false);
        setLoading(false);
        setNoti([
          {
            description: `เพิ่มผู้ใช้  ${userid} : ${firstname}  สำเร็จ`,
            icon: 1,
            key: Date.now(),
          },
        ]);
      }).catch((err) => {
 
        setNoti([
          {
            description: `เพิ่มผู้ใช้  ${userid} : ${firstname}  ไม่สำเร็จ`,
            icon: 2,
            key: Date.now(),
          },
        ]);
        // setopen(false)
        setErrstatus(err?.response.status);
        setLoading(false);
      });
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
            <div className="fixed inset-0 bg-black backdrop-blur-[5px] bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background dark:bg-dark-background p-6 text-left align-middle shadow-xl transition-all">
                  <Spin spinning={loading}>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-text dark:text-dark-text-color"
                    >
                      เพิ่มผู้ใช้งาน
                    </Dialog.Title>
                    <div className="w-full px-8 mt-4">
                      {textdata.map((items) => (
                        <div key={items.label} >
                          {items.type === 'text' && (
                          <div className="mt-4 flex justify-between items-center gap-5">
                          <label className="font-medium  text-text dark:text-dark-text-color">
                            {items.label}
                          </label>
                          <div className="flex w-4/6 relative">
                          <input
                            type="text"
                            placeholder={items.placeholder}
                            onChange={(ev) => items.value(ev.target.value)}
                            className={`pl-4 text-sm focus:shadow-md lg:w-auto   flex-auto rounded-lg border border-solid
                             border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-1 pr-3
                             text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none focus:transition-shadow
                              ${items.err !== errstatus ? 'focus:border-primary dark:focus:border-dark-primary ' : 'focus:border-error dark:focus:border-dark-error '}`}/>
                            {items.err === errstatus && (<span className=" absolute -top-4 text-sm left-2 text-error dark:text-dark-error">มี Userid นี้แล้วในระบบ</span>)}
                           </div>
                           </div>
                          )}

                          {items.type === 'select' && (
                          <div className="mt-4 flex justify-between items-center gap-5">
                          <label className="font-medium  text-text dark:text-dark-text-color">
                            {items.label}
                          </label>
                          <div className="flex w-4/6 relative">
                          <ConfigProvider theme={themes}>
                          <Select
                          className="top-1"
                          showSearch
                          style={{
                            width: 222,
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
                          onChange={items.onchange}
                          options={items.option?.map((res) => ({
                            value: res?.id,
                            label: res?.[(items.onoption)],
                          }))}
                        /></ConfigProvider>
                           </div>
                           </div>
                          )}
                            
                        </div>
                      ))}


                    </div>
                    <div className="mt-6 flex justify-end w-full gap-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-text dark:text-dark-text-color hover:text-error dark:hover:text-dark-error "
                        onClick={() => setopen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={
                          !firstname ||
                          !lastname ||
                          !userid ||
                          !sex ||
                          !department ||
                          !position ||
                          !permission 
                        }
                        className={`${
                          !firstname ||
                          !lastname ||
                          !userid ||
                          !sex ||
                          !department ||
                          !position||
                          !permission 
                            ? "cursor-not-allowed "
                            : " hover:bg-blue-300  "
                        }inline-flex justify-center rounded-md w-2/6 border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        onClick={Handleadduser}
                      >
                        Save
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
  );
}
