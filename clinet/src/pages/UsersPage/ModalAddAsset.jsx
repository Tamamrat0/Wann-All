import { Fragment, useState, useEffect , useContext } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Spin, Select, Switch , ConfigProvider , theme } from "antd";
import { ComputerDesktopIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import { PiComputerTower } from "react-icons/pi";
import { BsPrinter } from "react-icons/bs";
import { IoIosGitNetwork } from "react-icons/io";

import { LiaMicrosoft } from "react-icons/lia";
import {PageContext} from "../../PageContext.jsx";
export default function ModalAddAsset({ open, setopen  }) {
  const [selecttype, setSelecttype] = useState(null);
  const [optionsomeitem, setOptionsomeitem] = useState(true);
  const [optionallitems, setOptionallitems] = useState(false);
  const [themes , setThemes] = useState('')
  const {darkmode} = useContext(PageContext);

  useEffect(()=>{
    const { darkAlgorithm , defaultAlgorithm} = theme;
    if(darkmode){
      
      setThemes({algorithm: [darkAlgorithm]})
    }else{
      setThemes({algorithm: [defaultAlgorithm]})
    }
  },[darkmode])

  const textdatatype = [
    { label: "Computer", icon: CpuChipIcon },
    { label: "Moniter", icon: ComputerDesktopIcon },
    { label: "Ups", icon: PiComputerTower },
    { label: "Printer", icon: BsPrinter },
    { label: "Network", icon: IoIosGitNetwork },
    { label: "Software", icon: LiaMicrosoft },
  ];


    function allitems(checked){
      setOptionallitems(checked);
      setOptionsomeitem(false);
      if (!checked) {
        setOptionsomeitem(true);
      }
    }
    function someitems(checked){
      setOptionsomeitem(checked);
      setOptionallitems(false);
      if (!checked) {
        setOptionallitems(true);
      }
    }


  // },[optionallitems,optionsomeitem])
    
  // useEffect(() => {
  //   axios
  //     .get("/auth/department")
  //     .then(({ data }) => {
  //       setListepartment(data.department);
  //       setListPosition(data.position);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

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
                <Dialog.Panel className="w-full  max-w-md transform overflow-hidden rounded-2xl bg-background dark:bg-dark-background  p-6 text-left align-middle shadow-xl transition-all">
                  <Spin spinning={false}>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-text dark:text-dark-text-color"
                    >
                      เพิ่มทรัพย์สินของผู้ใช้
                    </Dialog.Title>
                    {/* Header */}
                    <div className="w-full grid grid-cols-3 gap-4 mt-8 relative text-text dark:text-dark-text-color">
                      <div className=" absolute right-1 -top-6">
                        เลือกประเภททรัพย์สินที่ต้องการ
                      </div>
                      {textdatatype.map((items) => (
                        <button
                          key={items.label}
                          className={`w-auto bg-slate-200 dark:bg-dark-second  rounded-xl p-2 h-28 relative ${
                            selecttype === items.label
                            ? "ring-2 ring-primary dark:ring-dark-primary drop-shadow-2xl"
                              : " opacity-40"
                          }  `}
                          onClick={() => setSelecttype(items.label)}
                        >
                          <div className="flex flex-col justify-between items-center text-center h-full">
                            <items.icon className="mt-2 w-14 h-14 bg-background dark:bg-dark-background text-text dark:text-dark-text-color  p-2 rounded-full  " />
                            <h3 className="font-bold px-2 ">{items.label}</h3>
                          </div>
                        </button>
                      ))}
                    </div>
                    {/* Detail */}
                    <div className={` flex w-full flex-col duration-500 ${!selecttype ? 'opacity-0 h-0 overflow-hidden':'mt-8'}`}>
                      {/* Select Bar */}
                      <div className=" w-full  flex flex-row justify-between text-text dark:text-dark-text-color">
                        <div className="flex flex-col">
                          <p>ข้อมูลของคอมพิวเตอร์ทั้งหมด</p>
                          <ConfigProvider theme={themes}>

                          <Select
                            className=""
                            showSearch
                            style={{
                              width: 210,
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
                            // onChange={handledepChange}
                            // options={listdepartment?.map((res) => ({
                            //   value: res?.id,
                            //   label: res?.department,
                            // }))}
                          />
                          </ConfigProvider>

                        </div>
                        <div className="">
                          <div className="flex gap-2 justify-end w-full ">
                            <p>แสดงไอเท็มที่ว่างอยู่</p>
                            <ConfigProvider theme={themes}>
                            <Switch className="bg-gray-200" checked={optionsomeitem} onChange={someitems} />
                            </ConfigProvider>
                          </div>
                          <div className="flex gap-2 justify-end w-full mt-2">
                            <p>แสดงไอเท็มทั้งหมด</p>
                            <ConfigProvider theme={themes}>
                            <Switch className="bg-gray-200"  checked={optionallitems} onChange={allitems} />
                            </ConfigProvider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end w-full gap-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-text dark:text-dark-text-color hover:text-error hover:dark:text-dark-error "
                        onClick={() => setopen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className=" inline-flex justify-center rounded-md w-2/6 border border-transparent bg-primary dark:bg-dark-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-300  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setopen(false)}
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
