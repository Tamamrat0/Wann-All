import { useState , useEffect,useContext } from "react"
import {UserContext} from "../../UserContext";
import {AdminContext} from "../../AdminContext";
import axios from "axios";
// ICON
import {HiPlus } from "react-icons/hi"
import {BiError } from "react-icons/bi"
import {BsXCircle , BsCheckCircle } from "react-icons/bs"
import {MdDriveFileRenameOutline } from "react-icons/md"
import { AiOutlineUsergroupAdd  } from "react-icons/ai"
import { TbLayoutGridAdd } from "react-icons/tb"
import { FcAbout } from "react-icons/fc";

// UI LIBRARY
import { Select , Switch ,Spin , Tooltip , notification } from 'antd';
import Avatar  from "react-nice-avatar";


// FILE PATH
import ModalConfirm from '../../Components/ModalConfirm'
import TablePermission from './TablePermission'
import { Navigate, redirect } from "react-router-dom";

export default function Permission(){

    // DATA ZONE
    const {socket , user} = useContext(UserContext);
    const {userall , setUserall , pageall , listpermission, setListpermission , permissusercount , setPermissusercount } = useContext(AdminContext);
    const [users , setUsers] = useState('');
    const [pernamegroup , setPernamegroup] = useState('');
    const [userselect , setUserselect] = useState([]);
    // const [permissgroup , setPermissgroup] = useState('');
    // const [permissusercount , setPermissusercount] = useState('');
    let [checkarray , setCheckarray] = useState([]);

    // DATA FIX ZONE
    let [permissfix , setPermissfix] = useState('');
    let [permissuserfix , setPermissuserfix] = useState(null);
    let [perdetailfix , setPerdetailfix] = useState(null);
    let [pernamegroupfix , setPernamegroupfix] = useState('');
    // TEMP
    const [prevPerdetailfix, setPrevPerdetailfix] = useState(null);
    const [prevPernamegroupfix, setPrevPernamegroupfix] = useState(null);
    const [prevPermissuserfix, setPrevPermissuserfix] = useState(null);

    // DATA FOR TABLE
    const [pagedata , setPagedata] = useState('') //ข้อมูล page ทั้งหมด
    const [tabledatapage , setTabledatapage] = useState('') 
    const [permissioncheck , setPermissioncheck] = useState(null)// ข้อมูล page ที่ผ่านการ filter และ ใช้งานจริง 

    // Controllers ZONE
    const [api, contextHolder] = notification.useNotification();
    const [addnew , setAddnew] = useState(false)
    const [delayaddnew , setDelayaddnew] = useState(false)
    const [pagechoice , setPagechoice] = useState('')
    const [loading , setLoading] = useState(false)
    const [alreadyper , setAlreadyper] = useState(null)
    const [alreadyname , setAlreadyname] = useState(null)
    const [noti, setNoti] = useState(null);
    const [onfix , setOnfix] = useState(false);
    const [modalconfirm , setModalconfirm] = useState(false)
    const [modalresponse , setModalresponse] = useState(false)
    const [modalcancel , setModalcancel] = useState(false)
    const [modalccresponse , setModalccresponse] = useState(false)
    const [modalcancel_fix , setModalcancel_fix] = useState(false)
    const [modalccresponse_fix , setModalccresponse_fix] = useState(false)
    const [pagepermiss , setPagepermiss] = useState()

// สำหรับเช็คไม่ได้ล็อคอิน
if (!user) {
       
    return <Navigate  to="/" />;
}
// console.log(userall)

// สำหรับ animation หลอดโหลดตอนสร้างสิทธิ 
    useEffect(() => {
        if(addnew || onfix){
            setTimeout(() => {
                setDelayaddnew(true)
            }, 1000);
        }else{
            setDelayaddnew(false)
        }
       
      }, [addnew , onfix , permissfix]);

// สำหรับดึงข้อมูลทั้งหมด + socket io
   useEffect(()=>{
    if(userall){
        const sortedData = [...userall].sort((a , b) => a.department.localeCompare(b.department))
        setUsers(sortedData)
    }


        setPagedata(pageall?.map(items => ({
            ...items,
             key: JSON.stringify(items.id)
          })))
          setPagechoice([...new Set(pageall?.map(item => item.page_of)),"all"].sort())
          setTabledatapage(pageall?.map(items => ({
            ...items,
             key: JSON.stringify(items.id)
          })))
       


          if(user){
            setPagepermiss(JSON.parse(user.per_detail).find((ev)=> ev.page === 'permission')?.detail)
          }


    // Socket connect room
    if(socket){
        socket.emit('create_room', {user:user.firstname , room:"permissionpage"});
        
        return()=>{
          socket.emit('leave_room', {user:user.firstname , room:"permissionpage"});
        }
    }


   },[])

// สำหรับรับค่า Socket
   useEffect(()=>{
    if(socket){
        socket.on('after_edit_permission', (data)=>{
            console.log(data)
            setListpermission(data[0].pageall)
            setUserall(userall.forEach((items)=>{
                // console.log(1)
                // console.log(data[0].pageuser)
                const userupdate = data[0].pageuser.find((ev)=> items.id === ev.id)
                // console.log(userupdate)
                if (userupdate){
                    // console.log(2)
                    items.permission_id = userupdate.permission_id;
                    items.per_name = userupdate.per_name;
                }
            }))
            // setPermissusercount(data[0].pageuser)
        })
    }
    },[socket])
    
// สำหรับ Notify
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
                    <BsCheckCircle className="w-6 h-6 text-success" />
                    ) : (
                    <BiError className="w-6 h-6 text-error" />
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







// สำหรับรับค่า Response จาก Modal Delete 
    useEffect(() => {

        if(modalresponse){
            setLoading(true)
            axios.post('permiss/permiss_delete' ,{groupid : permissfix.id}
            ).then(({data})=> {
                setNoti([
                    {
                      description: `ลบสิทธิสำเร็จ`,
                      icon: 1,
                      key: Date.now(),
                    },
                  ]);
                  setOnfix(()=>!onfix)
                  setListpermission(data[0].pageall)
                  setUserall(userall.forEach((items)=>{
                    // console.log(1)
                    // console.log(data[0].pageuser)
                    const userupdate = data[0].pageuser.find((ev)=> items.id === ev.id)
                    // console.log(userupdate)
                    if (userupdate){
                        // console.log(2)
                        items.permission_id = userupdate.permission_id;
                        items.per_name = userupdate.per_name;
                    }
                }))
                //   setPermissusercount(data[0].pageuser)
                  socket.emit('onedit_permission' , data);
                setLoading(false)
            }).catch((err)=>{
                setLoading(false)
            })
        }

        if(modalccresponse){
            setModalccresponse(false)
            setPernamegroup('')
            setUserselect([])
            setPermissioncheck(null)
            setAddnew(()=>!addnew)
            setAlreadyname(null)
            setAlreadyper(null)
        }
        if(modalccresponse_fix){

            setModalccresponse_fix(false)
            setPermissfix('')
            setOnfix(()=>!onfix)
        }
    },[modalresponse,modalccresponse,modalccresponse_fix])


// สร้าง Array สำหรับ ให้เลือกหน้าเพจ ตาม page_of
   function handleselectpages(ev){

    // console.log(ev)
    if(ev === 'all'){
        setTabledatapage(pagedata)
        return
    }else{
        const result = pagedata.filter((item) => item.page_of === ev);
        setTabledatapage(result)
        
    }
   
   }

// บันทึกสิทธิใหม่
   function handleSave(ev){
    ev.preventDefault()
    setLoading(true)
    setAlreadyname(null)
    setAlreadyper(null)

    const newdata = [{
        box: "สิทธิการใช้งาน",
        detail: `เปลี่ยนสิทธิผู้ใช้เป็น ${pernamegroup}`,
      }];

    setTimeout(() => {
        axios.post('/permiss/permiss_addgroup',{
        pernamegroup,
        userselect,
        permissioncheck,
        editdetail : newdata
    }).then(({data})=>{
        setNoti([
            {
              description: `เพิ่มสิทธิ ${pernamegroup} สำเร็จ`,
              icon: 1,
              key: Date.now(),
            },
          ]);
          setAddnew(()=>!addnew)
          setListpermission(data[0].pageall)
          setUserall(userall.forEach((items)=>{
            // console.log(1)
            // console.log(data[0].pageuser)
            const userupdate = data[0].pageuser.find((ev)=> items.id === ev.id)
            // console.log(userupdate)
            if (userupdate){
                // console.log(2)
                items.permission_id = userupdate.permission_id;
                items.per_name = userupdate.per_name;
            }
        }))
        //   setPermissusercount(data[0].pageuser)
          socket.emit('onedit_permission' , data);
        setLoading(false)
        setAlreadyper(null)
        setAlreadyname(null)
        setCheckarray([])
        setUserselect([])
        setPermissioncheck(null)
        setPernamegroup('')

    }).catch((err)=>{
        setLoading(false)
        console.log(err)
        // setAlreadyper(err.response.data)
        // console.log(err.response.data)
        {err.response.status === 400 && setAlreadyname(err.response.data)}
        {err.response.status === 409 && setAlreadyper(err.response.data)}
    })
    }, 1000);
   }

// สำหรับ ยืนยันใน กรณีที่ ผู้ใช้ที่เลือกมีสิทธิอยู่แล้ว
   function handleconfirm(ev){
    ev.preventDefault()

    setLoading(true)
    const newdata = [{
        box: "สิทธิการใช้งาน",
        detail: `เปลี่ยนสิทธิผู้ใช้เป็น ${pernamegroup}`,
      }];
    setTimeout(()=> {
    axios.post('permiss/permiss_confirm' , {checkarray,pernamegroup,editdetail : newdata}).then(({data})=>{
        setNoti([
            {
              description: `เพิ่มสิทธิ ${pernamegroup} สำเร็จ`,
              icon: 1,
              key: Date.now(),
            },
          ]);
        setAddnew(()=>!addnew)
        console.log(data)
        setListpermission(data[0].pageall)
        
        setUserall(userall.forEach((items)=>{
            const userupdate = data[0].pageuser.find((ev)=> items.id === ev.id)
            if (userupdate){
                items.permission_id = userupdate.permission_id;
                items.per_name = userupdate.per_name;
            }
        }))
        
        // setPermissusercount(data[0].pageuser)
        socket.emit('onedit_permission' , data);
        setLoading(false)
        setAlreadyper(null)
        setAlreadyname(null)
        setCheckarray([])
        setUserselect([])
        setPermissioncheck(null)
        setPernamegroup('')
    }).catch((err)=>{
        setLoading(false)

    })
} ,1000)
   }

// สำหรับ ยืนยันใน กรณีที่ ผู้ใช้ที่เลือกมีสิทธิอยู่แล้ว
   function handleconfirm_fix(ev){
    ev.preventDefault()
    setLoading(true)
    const newdata = [{
        box: "สิทธิการใช้งาน",
        detail: `เปลี่ยนสิทธิผู้ใช้เป็น ${pernamegroupfix}`,
      }];
    setTimeout(()=> {
    axios.post('permiss/permiss_confirm' , {checkarray,pernamegroup:pernamegroupfix,editdetail : newdata}).then(({data})=>{
        setNoti([
            {
              description: `แก้ไขสิทธิ ${pernamegroup} สำเร็จ`,
              icon: 1,
              key: Date.now(),
            },
          ]);
        setOnfix(()=>!onfix)
        setPermissfix('')
        setListpermission(data[0].pageall)
        setUserall(userall.forEach((items)=>{
            const userupdate = data[0].pageuser.find((ev)=> items.id === ev.id)
            if (userupdate){
                items.permission_id = userupdate.permission_id;
                items.per_name = userupdate.per_name;
            }
        }))
        // setPermissusercount(data[0].pageuser)
        socket.emit('onedit_permission' , data);
        setLoading(false)
        setAlreadyper(null)
        setAlreadyname(null)
        setCheckarray([])
        setUserselect([])
        setPermissioncheck(null)
        setPernamegroup('')
    }).catch((err)=>{
        setLoading(false)

    })
} ,1000)
   }

// สำหรับสร้าง Array ให้ผู้ใช้ที่มีสิทธิอยู่แล้ว
   function handlealreadypercheck(id) {
        if (!checkarray.includes(id)) {
            setCheckarray([...checkarray, id]);
        }
}

// สำหรับลบ Array ให้ผู้ใช้ที่มีสิทธิอยู่แล้ว
   function handlealreadyperclose(id) {
    if (checkarray.includes(id)){
        setCheckarray(checkarray.filter((item)=> item !== id))
    }
   }

// สำหรับกดแก้ไขสิทธิ
   function handlefixper(id){
    setAlreadyname('')
    setAlreadyper('')
    setPermissfix(listpermission.filter((item)=>item.id === id).shift())
    setPermissuserfix(userall.filter((item)=>item.permission_id === id).map((items)=>items.id))
    setPerdetailfix(JSON.parse(listpermission.filter((item)=>item.id === id).shift().per_detail))
    setPernamegroupfix(listpermission.filter((item)=>item.id === id).shift().per_name)
    setDelayaddnew(false)
    setOnfix(true)

    setPrevPernamegroupfix(listpermission.filter((item)=>item.id === id).shift().per_name)
    setPrevPerdetailfix(JSON.parse(listpermission.filter((item)=>item.id === id).shift().per_detail))
    setPrevPermissuserfix(userall.filter((item)=>item.permission_id === id).map((items)=>items.id))

    if(addnew){
        setAddnew(()=>!addnew)
    }

}

// สำหรับลบสิทธื
    function handleDelete(ev){
        ev.preventDefault()
        setModalresponse(false)
        setModalconfirm(true)
    }

// สำหรับอัพเดทสิทธิ
    function handleUpdate(ev){
        ev.preventDefault()
        axios.post('permiss/permiss_update' , {
            idper:permissfix.id,
            permissuserfix, 
            perdetailfix,
            pernamegroupfix
        }).then(({data})=>{
            socket.emit('onedit_permission' , data);
            setPermissfix('')
            setOnfix(()=>!onfix)
            setLoading(false)
            setListpermission(data[0].pageall)
            setUserall(userall.forEach((items)=>{
                // console.log(1)
                // console.log(data[0].pageuser)
                const userupdate = data[0].pageuser.find((ev)=> items.id === ev.id)
                // console.log(userupdate)
                if (userupdate){
                    // console.log(2)
                    items.permission_id = userupdate.permission_id;
                    items.per_name = userupdate.per_name;
                }
            }))
            // setPermissusercount(data[0].pageuser)
            setNoti([
                {
                  description: `แก้ไขสิทธิ ${pernamegroup} สำเร็จ`,
                  icon: 1,
                  key: Date.now(),
                },
              ]);
        }).catch((err)=>{
            setLoading(false)
            {err.response.status === 400 && setAlreadyname(err.response.data)}
            {err.response.status === 409 && setAlreadyper(err.response.data)}

        })
    }

// สำหรับยกเลิก
    function handlecancel_create(ev) {
        ev.preventDefault()
        if(!addnew){
            setAddnew(()=>!addnew)
        }
        if(pernamegroup || permissioncheck || userselect.length > 0){
            
            setModalcancel(true)
        }else{
            setAddnew(()=>!addnew)
        }
    }

    function handlecanncel_fix(ev){
        ev.preventDefault()

        if(prevPernamegroupfix !== pernamegroupfix || JSON.stringify(prevPermissuserfix) !== JSON.stringify(permissuserfix) || JSON.stringify(prevPerdetailfix) !== JSON.stringify(perdetailfix)){
            setModalcancel_fix(true)
            
        }else{
            setOnfix(()=>!onfix)
            setPermissfix('')
        }
    }

    return(
        <form className="p-4 w-full ">
            {contextHolder}
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-center ">

            {/* TEXT HEADER */}
            <div className="flex flex-col">
            <span className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
            Permission
            </span>
            <p className="text-base leading-7 text-gray-600">จัดการสิทธิการใช้งานของผู้ใช้ทั้งหมด</p>
            </div>
            

            {/* ADD Button */}
            <div className="">
                <button
                onClick={handlecancel_create} 
                className={`${onfix && ' opacity-0 hidden'} mt-3 w-32  lg:mt-0 flex items-center justify-center text-white ${addnew ? 'bg-error hover:bg-red-300' : 'bg-primary hover:bg-blue-300 dark:bg-dark-primary dark:hover:bg-blue-300 '}  px-6 py-2 rounded-md gap-2 duration-300 `}>
                <HiPlus className={`w-4 h-4  duration-500 ${addnew && 'rotate-45'}`}/> {`${addnew ? 'ยกเลิก' : 'เพิ่มสิทธิ'}`}
                </button>

                <button
                onClick={handlecanncel_fix} 
                className={`${!onfix && ' opacity-0 hidden'} mt-3 w-32  lg:mt-0 flex items-center justify-center text-white bg-error hover:bg-red-300  px-6 py-2 rounded-md gap-2 duration-300 `}>
                <HiPlus className={`w-4 h-4  duration-500 rotate-45`}/> ยกเลิก
                </button>
            </div>
            
            </header>
            {/* END Header */}

            
            {/* BODY DETAIL */}
            <div className="flex flex-col lg:flex-row gap-3">

            {/* LEFT SIDE */}
            <div className={`w-full ${addnew || onfix ?'lg:w-2/6':''} duration-500  mt-7 rounded-lg p-4 shadow-lg border bg-background dark:bg-dark-background`}>
                <div className="flex flex-col px-4 mb-3">
                    <span className="text-2xl font-semibold tracking-tight text-text dark:text-dark-text-color mt-2">
                    Permission Group
                    </span>
                    <p className="text-base leading-7 text-text dark:text-dark-text-color">กลุ่มสิทธิการใช้งาน แต่ละสิทธิจะครอบคลุมเฉพาะกลุ่มผู้ใช้ภายในสิทธิเท่านั้น</p>
                </div>
                <div className={`grid grid-cols-1 ${addnew || onfix ? ' md:grid-cols-2':'md:grid-cols-2 lg:grid-cols-4'}  gap-3  `}>

                    {listpermission && listpermission.map((item,index)=>(
                    <div key={index} className={`bg-gray-color dark:bg-dark-second flex flex-col gap-3   px-8 py-6 rounded-lg shadow-md overflow-x-hidden duration-500 ${permissfix && permissfix?.per_name === item.per_name && ' ring-4 ring-primary'}`}>
                        <div className="flex justify-end relative ">
                            <span className="text-text dark:text-dark-text-color absolute left-0 font-semibold">{`(${userall?.filter((items)=> items.permission_id === item.id).length}) Accounts`}</span>
                            <div className={`flex  relative mt-7 hover:duration-700 -space-x-6 hover:-space-x-3 ${addnew || onfix  && '-space-x-7'}`}>
                            {userall?.filter((items) => items.permission_id === item.id).length > 6 && (
                            // <Tooltip key={index} title={'test'}></Tooltip>
                            <div className=" relative z-0 hover:ring ring-primary rounded-full hover:scale-125 hover:-translate-x-1 transition-transform">
                                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-dark-second text-text dark:text-dark-text-color flex justify-center items-center border-2 border-white cursor-default text-sm font-semibold" >
                                +{userall?.filter((items) => items.permission_id === item.id).length - 6}
                                </div>
                                </div>
                                
                                )}
                                {userall?.filter((items)=> items.permission_id === item.id).slice(0, 6).map((i,index)=>(
                                    <Tooltip key={index} title={i.firstname}>
                                        <div className="relative z-0 hover:ring ring-primary rounded-full hover:scale-125 hover:-translate-x-1 transition-transform">
                                            <Avatar className="w-10 h-10 border-2  border-white" {...JSON.parse(i.avatar)}/> 
                                        </div>
                                 </Tooltip>
                                ))}

                            </div>
                        </div>
                        <span className=" font-bold text-2xl text-text dark:text-dark-text-color">{item.per_name}</span>
                        <button className="w-max text-primary font-semibold text-base"
                        onClick={(ev)=>{
                            ev.preventDefault()
                            handlefixper(item.id)}}
                            disabled={permissfix && permissfix?.per_name === item.per_name} >แก้ไข , ดูรายละเอียด
                            
                            </button>
                    </div>
                    ))}

                </div>
            </div>

            {/* RIGHT SIDE - CREATE  */}
            <div className={`${addnew  ?'lg:w-4/6  mt-7  ':'w-0 opacity-0 hidden ' } duration-700 relative  `}>
            <div className={`absolute h-20 ${delayaddnew ? 'w-3/6 ' : 'w-0 '} ${loading ? 'w-full border-t-4 rounded-lg' : 'border-t-4 rounded-l-lg'} ${alreadyper && 'w-5/6'} border-t-primary z-10  duration-500 `}></div>

            {/* TEXT HEADER */}
                <div className={`w-full right-0 absolute  border rounded-lg px-2 py-4 shadow-lg bg-background dark:bg-dark-background `}>
                <Spin spinning={loading}>
                <div className="flex flex-col px-4 mb-3  relative mt-2 lg:mt-0 ">
                    <span className="text-2xl font-semibold tracking-tight text-text dark:text-dark-text-color mt-2">
                     Create Permission
                    </span>
                    <p className="text-base leading-7 text-text dark:text-dark-text-color lg:whitespace-nowrap">สร้างสิทธิการใช้งานให้กับผู้ใช้ สามารถเลือกสิทธิการใช้งานให้แต่ละหน้าเพจได้</p>
                    <div className={`absolute right-6 flex justify-end w-36  `}>
                    <button 
                    onClick={!alreadyper ? handleSave : handleconfirm}
                        disabled={pernamegroup === '' || permissioncheck === null || (userselect.length === 0)}
                        className={` px-4 py-1  rounded-md font-semibold z-10 ${pernamegroup === '' || permissioncheck === null || (userselect.length === 0 ) ? 'bg-white text-gray-400 border-2 ' : 'text-white bg-primary hover:bg-blue-400' } `}>
                            {`${alreadyper ? 'Confirm' : 'Save'}`}
                    </button>
                    </div>
                </div>
               
               {/* Create */}
                <div className={`flex flex-col duration-500  `} >
                
                <div className="flex flex-col lg:flex-row gap-3 w-full  py-4 px-4 ">
                <div className={`flex flex-col w-full lg:w-2/6 h-40   border boder-gray-color dark:border-dark-second py-4 px-4 rounded-md ${alreadyper && 'bg-gray-color dark:bg-dark-second'} `}>
                        <div className="flex flex-col">
                            <div className="flex justify-between text-text dark:text-dark-text-color">
                            <span className="font-semibold flex items-center gap-2"><MdDriveFileRenameOutline className="w-5 h-5"/>ตั้งชื่อ สิทธิการใช้งาน </span>
                            {alreadyname && (<div className="font-semibold  text-error">ชื่อนี้มีอยู่แล้ว</div>)}
                            </div>
                            <input type="text"
                            value={pernamegroup}
                            onChange={(ev)=>setPernamegroup(ev.target.value)} 
                            disabled={alreadyper}
                            className={` mt-2 px-4 py-2 text-sm focus:shadow-md lg:w-auto   flex-auto rounded-lg border 
                             bg-background dark:bg-dark-second  
                            text-text dark:text-dark-text-color  dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary
                             ${pernamegroup === '' && ' border border-primary' }
                             ${alreadyname ? 'border-error dark:border-dark-error border ' : 'border-gray-color dark:border-text-color'}`}
                            // className={`text-sm font-semibold rounded-md text-text
                            //  dark:text-dark-text-color px-4 py-2 mt-2
                            //   ${pernamegroup === '' && ' border-primary border'}  
                            //   ${alreadyname && ' border-error border'} focus:ring-4  
                            //   focus:outline-none border`} 
                            />
                        </div>

                    </div>
                <div className={`flex flex-col w-full lg:w-4/6  ${alreadyper ? 'h-full ' : 'h-40'}  border boder-gray-color dark:border-dark-second  py-4 px-4 rounded-md `}>
                    <span className=" whitespace-nowrap flex justify-between items-center ">
                        <div className="flex items-center gap-2 font-semibold px-2 text-text dark:text-dark-text-color">
                        <AiOutlineUsergroupAdd className="h-6 w-6"/>เพิ่ม User
                        </div>
                        {alreadyper && (
                        <span className="font-semibold px-2 text-text dark:text-dark-text-color ">{`เลือก (${checkarray.length})`}</span>
                        )}
                    </span>
                        <Select 
                        mode="multiple"
                        disabled={ alreadyper}
                        className={`mt-2  duration-300 `}
                        placeholder="Select Users"
                        value={userselect}
                        onChange={(ev)=>{setUserselect(ev)}}
                        options={users && users?.map((res) => ({
                            key:res?.id,
                            value: res?.id,
                            label: `${res?.firstname} ${res?.department}`
                        }))}
                        />
                        <div className=" p-1 mt-3  flex gap-2  overflow-x-auto whitespace-nowrap z-10 ">
                            {alreadyper && alreadyper?.map((item)=>(
                            <div key={item.id} className={`flex  rounded-md border boder-gray-color dark:border-dark-second text-text dark:text-dark-text-color bg-background dark:bg-dark-second  ${checkarray.includes(item.id)  ? 'shadow-md ' : 'shadow-sm'} `}>
                            <div className={`flex flex-col justify-center  px-2 ${checkarray.includes(item.id)  ? 'bg-green-200 dark:text-dark-second  rounded-l-md ' : ''} `}>
                                <div className="">{`${item.firstname} มีสิทธิ ${item.per_name} อยู่แล้ว`}</div>
                                <div className="">ต้องการเปลี่ยนหรือไม่</div>
                            </div>
                            <div className="flex border border-yellow-500 "></div>
                            <div className="gap-1 py-1 flex flex-col px-2  rounded-r-md ">
                                <BsCheckCircle className="cursor-pointer text-green-500  rounded-full hover:bg-green-300"
                                onClick={() => handlealreadypercheck(item.id)}/>

                                <BsXCircle className="cursor-pointer text-red-500 rounded-full hover:bg-red-300"
                                onClick={() => handlealreadyperclose(item.id)}/>
                            </div>
                            </div>
                            ))}
                        </div>
                        
                </div>
                </div>
                <div className={`flex flex-col  border mx-4  mb-4 py-4 px-4 rounded-md ${alreadyper && 'bg-gray-100'} `}>
                    <div className="flex justify-between">
                    <span className="font-semibold px-2 whitespace-nowrap flex gap-2 items-center">
                        <TbLayoutGridAdd className="h-6 w-6"/>ตั้งค่าสิทธิผู้ใช้
                    </span>
                    <div className="">
                        <Select 
                            showSearch
                            className="w-40"
                            placeholder="Select Users"
                            onChange={handleselectpages}
                            disabled={alreadyper}
                            defaultValue={{
                                value:'all',
                                label:'all'
                            }}
                            options={pagechoice && pagechoice?.map((res) => ({
                                value: res,
                                label: res,
                            }))}
                            />
                    </div>
                    </div>
                    <div className="mt-4">
                    {modalcancel && (
                            <ModalConfirm 
                            open = {modalcancel}
                            onClose = {setModalcancel}
                            header='คุณต้องการยกเลิก'  
                            detail='คุณต้องการยกเลิกการกรอกข้อมูลนี้ใช่หรือไม่ ? <br/> หากยืนยันข้อมูลที่คุณกรอกจะหายไป.' 
                            onChange={setModalccresponse}  
                            status='caution' 
                            />
                             )} 
                        {addnew && (
                            <TablePermission  newstatus={addnew} tabledatapage={tabledatapage} setPermissioncheck={setPermissioncheck} permissioncheck={permissioncheck} alreadyper={alreadyper}  />
                        )}
                    </div>
                        
                </div>
                
                </div>

                </Spin>
                </div>


            </div>

            {/* RIGHT SIDE - FIX */}
            <div className={`${onfix ?'lg:w-4/6  mt-7  ':'w-0 opacity-0 hidden ' } duration-700 relative  `}>
            <div className={`absolute h-20 ${delayaddnew ? 'w-3/6 ' : 'w-0 '} ${loading ? 'w-full border-t-4 rounded-lg' : 'border-t-4 rounded-l-lg'} ${alreadyper && 'w-5/6'} border-t-yellow-500  z-10  duration-500 `}></div>

            {/* TEXT HEADER */}
                <div className={`w-full right-0 absolute  border rounded-lg px-2 py-4 shadow-lg `}>
                <Spin spinning={loading}>
                <div className="flex flex-col px-4 mb-3  relative mt-2 lg:mt-0  ">
                    <span className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
                     Fix Permission
                    </span>
                    <p className="text-base leading-7 text-gray-600 lg:whitespace-nowrap">สร้างสิทธิการใช้งานให้กับผู้ใช้ สามารถเลือกสิทธิการใช้งานให้แต่ละหน้าเพจได้</p>
                    <div className={`absolute  flex  w-40 gap-4  right-6 justify-end `}>
                    <button 
                    onClick={handleDelete}  
                        className={` px-4 py-1  rounded-md font-semibold z-10 text-white bg-red-400 hover:bg-red-300 ${permissfix?.per_name === 'user' && 'opacity-0 hidden'} `}>
                            {`DELETE`}
                    </button>
                    <button 
                    onClick={!alreadyper ? handleUpdate : handleconfirm_fix}
                        className={`${prevPernamegroupfix === pernamegroupfix && JSON.stringify(prevPermissuserfix) === JSON.stringify(permissuserfix) && JSON.stringify(prevPerdetailfix) === JSON.stringify(perdetailfix)
                        ? 'bg-white text-gray-400  ' : 'text-white bg-blue-500 hover:bg-blue-400 border-blue-500'}  border-2 px-4 py-1  rounded-md font-semibold z-10  `}
                        disabled={prevPernamegroupfix === pernamegroupfix && JSON.stringify(prevPermissuserfix) === JSON.stringify(permissuserfix) && JSON.stringify(prevPerdetailfix) === JSON.stringify(perdetailfix)}
                        >{`${alreadyper ? 'Confirm' : 'Update'}`}
                    </button>
                    </div>
                </div>
               
               {/* Fix Permission */}
                <div className={`flex flex-col duration-500  `} >
                
                <div className="flex flex-col lg:flex-row gap-3 w-full relative  py-4 px-4 ">
                <div className={`flex flex-col w-full lg:w-2/6 h-40  border py-4 px-4 rounded-md  ${alreadyper || permissfix?.per_name === 'user' && 'bg-gray-100'} `}>
                        <div className="flex flex-col">
                            <div className="flex justify-between ">
                            <span className="font-semibold flex items-center gap-2"><MdDriveFileRenameOutline className="w-5 h-5"/>สิทธิการใช้งาน </span>
                            {alreadyname && (<div className="font-semibold  text-red-500">ชื่อนี้มีอยู่แล้ว</div>)}
                            </div>
                            <input type="text"
                            value={pernamegroupfix}
                            onChange={(ev)=>setPernamegroupfix(ev.target.value)} 
                            disabled={alreadyper || permissfix?.per_name === 'user'}
                            className={`text-sm font-semibold rounded-md text-gray-700 px-4 py-2 mt-2 ${pernamegroupfix === '' && ' border-blue-500 border'}  ${alreadyname  && ' border-red-500 border'} focus:ring-4  focus:outline-none border`} />
                        </div>
                        <div className="flex  mt-6 gap-6">

                        </div>
                    </div>
                <div className={`flex flex-col w-full lg:w-4/6  ${alreadyper ? 'h-full ' : 'h-40'}  border  py-4 px-4 rounded-md ${permissfix?.per_name === 'user' && 'bg-gray-100'} overflow-auto `}>
                    <span className=" whitespace-nowrap flex justify-between items-center ">
                        <div className="flex items-center gap-2 font-semibold px-2">
                        <AiOutlineUsergroupAdd className="h-6 w-6"/>เพิ่ม User
                        </div>
                        {alreadyper && (
                        <span className="font-semibold px-2">{`เลือก (${checkarray.length})`}</span>
                        )}
                    </span>
                        <Select 
                        mode="multiple"
                        disabled={alreadyper || permissfix?.per_name === 'user'}
                        className={`mt-2  duration-300 `}
                        placeholder="Select Users"
                        value={permissuserfix}
                        onChange={(ev)=>{
                            setPermissuserfix(ev)
                        }}
                        options={users && users?.map((res) => ({
                            key:res?.id,
                            value: res?.id,
                            label: `${res?.firstname} ${res?.department}`
                        }))}
                        />
                        <div className=" p-1 mt-3  flex gap-2  overflow-x-auto whitespace-nowrap z-10 ">
                            {alreadyper && alreadyper?.map((item)=>(
                            <div key={item.id} className={`flex  rounded-md border ${checkarray.includes(item.id)  ? 'shadow-md ' : 'shadow-sm'} `}>
                            <div className={`flex flex-col justify-center  px-2 ${checkarray.includes(item.id)  ? 'bg-green-200 rounded-l-md ' : ''} `}>
                                <div className="">{`${item.firstname} มีสิทธิ ${item.per_name} อยู่แล้ว`}</div>
                                <div className="">ต้องการทับหรือไม่</div>
                            </div>
                            <div className="flex border border-yellow-500 "></div>
                            <div className="gap-1 py-1 flex flex-col px-2  rounded-r-md ">
                                <BsCheckCircle className="cursor-pointer text-green-500  rounded-full hover:bg-green-300"
                                onClick={() => handlealreadypercheck(item.id)}/>

                                <BsXCircle className="cursor-pointer text-red-500 rounded-full hover:bg-red-300"
                                onClick={() => handlealreadyperclose(item.id)}/>
                            </div>
                            </div>
                            ))}
                        </div>
                        
                </div>
                </div>
                <div className={`flex flex-col  border mx-4  mb-4 py-4 px-4 rounded-md ${alreadyper && 'bg-gray-100'} `}>
                    <div className="flex justify-between">
                    <span className="font-semibold px-2 whitespace-nowrap flex gap-2 items-center">
                        <TbLayoutGridAdd className="h-6 w-6"/>ตั้งค่าสิทธิผู้ใช้
                    </span>
                    <div className="">
                        <Select 
                            showSearch
                            className="w-40"
                            placeholder="Select Users"
                            onChange={handleselectpages}
                            disabled={alreadyper}
                            defaultValue={{
                                value:'all',
                                label:'all'
                            }}
                            options={pagechoice && pagechoice?.map((res) => ({
                                value: res,
                                label: res,
                            }))}
                            />
                    </div>
                    </div>
                    <div className="mt-4">
                        {modalconfirm && (
                            <ModalConfirm 
                            open = {modalconfirm}
                            onClose = {setModalconfirm}
                            header='ยืนยันการลบ'  
                            detail='คุณต้องการลบสิทธิการใช้งานนี้หรือไม่ ? <br/> หากยืนยันการลบ ข้อมูลจะไม่สามารถกู้คืนได้.' 
                            onChange={setModalresponse}  
                            status='delete' 
                            />
                        )} 
                        {modalcancel_fix && (
                            <ModalConfirm 
                            open = {modalcancel_fix}
                            onClose = {setModalcancel_fix}
                            header='คุณต้องการยกเลิก'  
                            detail='คุณต้องการยกเลิกการแก้ไขข้อมูลนี้ใช่หรือไม่ ? <br/> หากยืนยันข้อมูลที่คุณแก้ไขจะหายไป.' 
                            onChange={setModalccresponse_fix}  
                            status='caution' 
                            />
                        )} 
                        {onfix  && (
                            <TablePermission  tabledatapage={tabledatapage} setPermissioncheck={setPerdetailfix} permissioncheck={perdetailfix} alreadyper={alreadyper}  />
                        
                        )}
                    </div>
                        
                </div>
                
                </div>

                </Spin>
                </div>
            </div>
            {/* END FIX  */}


            </div>
            {/* END BODY DETAIL */}

        </form>
        // END FORM 
    )
}

// โค้ดทำ status ความเคลื่อนไหว
{/* <div className={`absolute -top-14 left-4  flex items-center gap-4 font-semibold  `}>
<div className={` ${secondpage === 'page1' && delayaddnew ? 'border-2 border-blue-500 text-blue-500':'text-gray-500 border-2'} duration-500 bg-transparent flex justify-center items-center rounded-full font-semibold  w-10 h-10`}>1</div>
<span className={`${secondpage === 'page1' && delayaddnew  ? '':'text-gray-500'}`}>Setting</span>
<div className="w-10 lg:w-40 border"></div>
<div className={` ${secondpage === 'page2' ? 'border-2 border-blue-500 text-blue-500':'text-gray-500 border-2'} duration-500 bg-transparent flex justify-center items-center rounded-full font-semibold  w-10 h-10`}>2</div>
<span className={`${secondpage === 'page1' ? 'text-gray-500':''}`}>Confirmation</span>
</div> */}



// Second Add page
// <div className={`flex flex-col lg:flex-row  duration-500 px-4 pt-4 pb-2 gap-3 ${secondpage === 'page2' ? 'opacity-100 flex ':'hidden overflow-hidden h-0' } `}>
// LEFT BOX 
// <div className="flex flex-col w-full lg:w-2/6 gap-3 ">
// <div className="flex flex-col h-40  border rounded-md py-4 px-4  ">
//     <div className="flex flex-col">
//         <span className="font-semibold flex items-center gap-2"><MdDriveFileRenameOutline className="w-5 h-5"/>ตั้งชื่อ สิทธิการใช้งาน</span>
//         <input type="text" className="text-sm font-semibold rounded-md text-gray-700 px-4 py-2 mt-2 border-blue-500  focus:ring-4  focus:outline-none border" />
//     </div>
//     <div className="flex  mt-6 gap-6">
//         <span className="font-semibold flex items-center gap-2"><VscActivateBreakpoints/>เปิดใช้งาน</span>
//         <Switch className="bg-gray-200 w-12"  />
//     </div>
// </div>

// <div className="flex flex-col  border rounded-md py-4 px-4  ">
//         <span className="font-semibold flex items-center gap-2"><LuUsers className="w-5 h-5"/>ผู้ใช้งาน</span>
//         <div className="mt-2">
//             {secondpage === 'page2' && (
//         <TableUser userselect={userselect}/>
//             )}
//         </div>
        
// </div>
// </div>

// RIGHT BOX 
// <div className="flex flex-col w-full lg:w-4/6 border mt-6 lg:mt-0  rounded-md py-4 px-4 relative ">
//     <span className="absolute text-gray-400 right-4 -top-6">สำหรับสรุปข้อมูลเท่านั้น ไม่สามารถแก้ไขได้</span>
// <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 `}>
// {permissioncheck?.map((item , index)=>(
//     <div key={index} className="border rounded-md px-4 py-2 flex flex-col gap-3">
//         <div className="flex flex-col  items-center">
//             <span className="font-semibold text-gray-800 text-lg">Page : {item.page}</span>
//             <span className="font-semi text-sm text-gray-600">Page of : {item.page_of}</span>
//         </div>
    
//         <div className="border rounded-md px-4 py-2 flex flex-col gap-3 ">
//             <div className="flex justify-between items-center gap-3">
//                 <div className="flex justify-end  w-3/6">
//                 <input type="checkbox" className="w-4 h-4"
//                 checked={item.detail.includes('read')}
//                 readOnly/>
//                 </div>
//                 <div className="flex justify-start w-3/6 text-gray-500 font-semibold">Read</div>
//             </div>
//             <div className="flex justify-between items-center gap-3">
//                 <div className="flex justify-end  w-3/6">
//                 <input type="checkbox" className="w-4 h-4" 
//                 checked={item.detail.includes('insert')}
//                 readOnly/>
//                 </div>
//                 <div className="flex justify-start w-3/6 text-gray-500 font-semibold">Insert</div>
//             </div>
//             <div className="flex justify-between items-center gap-3">
//                 <div className="flex justify-end  w-3/6">
//                 <input type="checkbox" className="w-4 h-4" 
//                 checked={item.detail.includes('modify')}
//                 readOnly/>
//                 </div>
//                 <div className="flex justify-start w-3/6 text-gray-500 font-semibold">Modify</div>
//             </div>
//             <div className="flex justify-between items-center gap-3">
//                 <div className="flex justify-end  w-3/6">
//                 <input type="checkbox" className="w-4 h-4" 
//                 checked={item.detail.includes('delete')}
//                 readOnly/>
//                 </div>
//                 <div className="flex justify-start w-3/6 text-gray-500 font-semibold">Delete</div>
//             </div>
//        </div>
//     </div>
//     ))}
    
// </div>
// </div>
// </div>
