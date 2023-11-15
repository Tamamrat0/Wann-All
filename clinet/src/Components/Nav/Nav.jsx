import {useState , useContext , useEffect} from "react";
import { Link, Navigate, redirect } from "react-router-dom";
import {Tooltip } from 'antd';
import Avatar  from "react-nice-avatar";
// Icons

import {RxDashboard} from 'react-icons/rx'
import {HiOutlineTicket} from 'react-icons/hi'
import {BsCalendarWeek , BsFillMoonStarsFill} from 'react-icons/bs'
import {BiSun , BiSolidMoon} from 'react-icons/bi'
import {LuUsers } from 'react-icons/lu'
import {LiaRingSolid , LiaKeySolid} from 'react-icons/lia'
import {FaSearch} from 'react-icons/fa'
import {BsPersonFill} from 'react-icons/bs'
import {PiBellFill , PiChatText , PiMoonStarsFill} from 'react-icons/pi'
import {VscListSelection , VscListFlat} from 'react-icons/vsc'
import {MdKeyboardArrowDown} from 'react-icons/md'

// Routs

import NavLoginModal from "./NavLoginModal";

// CONTEXT
import {UserContext} from "../../UserContext.jsx";
import {PageContext} from "../../PageContext.jsx";


export default function NavBar() {

  const { user } = useContext(UserContext);
  const {hidesidebar , setHidesidebar ,darkmode , setDarkmode} = useContext(PageContext);
  let [islogin, setIslogin] = useState(false)
  let [onselect , setOnselect] = useState('Dashboard')
  let [onhide , setOnhide] = useState([])
  // const [darkmode , setDarkmode] = useState(false)

  function addhideitem(ev){
    if (!onhide.includes(ev)) {
      setOnhide([...onhide,ev])
    }else{
      setOnhide(onhide.filter((item)=> item != ev))
    }
  }

  useEffect(()=>{
   
    if(darkmode){
      document.documentElement.classList.add('dark')
    }else{
      document.documentElement.classList.remove('dark')
    }
  },[darkmode])

  const datalist = [
  {name:'service' , pageof:'', icon:'',  link:'', type:'text'},
  {name:'Dashboard' , pageof:'service', icon:RxDashboard , link:'', type:'a'},
  {name:'Ticket' , pageof:'service', icon:HiOutlineTicket , link:'/ticket', type:'a'},
  {name:'Calendar' , pageof:'service', icon:BsCalendarWeek , link:'', type:'a'},
  // {name:'RD' , icon:'', pageof:'',  link:'', type:'text'},
  // {name:'Income' , pageof:'RD', icon:PiChatText , link:'/', type:'a'},
  // {name:'Rawmat' , pageof:'RD', icon:PiChatText , link:'/', type:'a'},
  // {name:'QC' , icon:'', pageof:'',  link:'', type:'text'},
  // {name:'Income' , pageof:'QC', icon:PiChatText , link:'/', type:'a'},
  // {name:'Rawmat' , pageof:'QC', icon:PiChatText , link:'/', type:'a'},
  {name:'Admin' , pageof:'', icon:'',  link:'', type:'text'},
  {name:'Chat' , pageof:'Admin', icon:PiChatText , link:'/', type:'a'},
  {name:'User' , pageof:'Admin', icon:LuUsers , link:'/users', type:'a'},
  {name:'Permission' , pageof:'Admin', icon:LiaRingSolid , link:'/permission', type:'a'},
  {name:'Asset' , pageof:'Admin', icon:LiaKeySolid , link:'/assets', type:'a'},
]

  return (
    <header className=" relative">
        {/* {contextHolder} */}
        {/* SIDE BAR */}
      <aside className= {`px-4  duration-500 antialiased shadow-none -left-20 lg:left-0 hover:left-0 ${hidesidebar ? 'w-24 ' : 'w-24 lg:w-62.5 lg:mx-4' } rounded-md  fixed inset-y-0 my-2  items-center justify-between overflow-y-auto  `}>
        <div className={`flex py-4 l   items-center justify-center gap-3 whitespace-nowrap text-text `}>
        <img className="h-10 w-auto bg-no-repeat bg-center" src="../src/assets/logo.png" alt="" />
        <span className={`font-semibold text-text dark:text-dark-text-color  duration-500 ${hidesidebar ? 'hidden' : 'hidden lg:flex' }`}>Wann ALLCafe</span>
        </div>

        <hr className="h-px opacity-75 text-gray-color " />

        <div className="items-center block w-auto max-h-screen overflow-auto mt-3 ">
          {datalist?.map((item,index )=>(
        <ul key={index} className="flex flex-col pl-0  ">
          {item.type === 'a' && (
                
            <li className={` w-full py-1 relative duration-300 ${onhide.includes(item.pageof) && 'hidden'}`}>
            <Link to ={item.link}  className={`flex pl-4 py-2 items-center ${onselect === item.name && 'bg-background dark:bg-dark-second'}  rounded-lg drop-shadow-md duration-300`}
            onClick={()=> setOnselect(item.name)}>
              <div className={`${onselect === item.name ? 'bg-gradient-to-tl from-[#1A8DCC] to-[#51C7EA]' : 'bg-background dark:bg-dark-background '} duration-300 mr-2 flex h-8 w-8 items-center justify-center rounded-lg  text-center shadow-2xl`}>
              <item.icon className={`w-4 h-4  ${onselect === item.name ?  'text-white' : 'text-text dark:text-dark-text-color'}`}/>
              </div>
             
              <span className={`font-semibold ${onselect === item.name &&  'dark:text-dark-text-color' } text-text whitespace-nowrap overflow-hidden duration-500  ${hidesidebar ? 'hidden' : 'hidden lg:flex' }`}>{item.name}</span>
              <div className="absolute animate-bounce hidden items-center justify-center rounded-full right-2 top-2 w-4 h-4 text-white text-sm bg-error dark:bg-dark-error">1</div>
            
            </Link>
          </li>
         
              )}
          {item.type === 'text' && (
            <li className={`w-full mt-2 flex items-center duration-300 overflow-clip text-text dark:text-dark-text-color`}>
              <div className={`flex items-center w-full ${hidesidebar ? 'justify-center' : 'justify-center lg:justify-start'} `}>
            <h6 className="relative flex items-center text-xs font-bold leading-tight uppercase opacity-60 whitespace-normal w-full cursor-pointer" onClick={()=> addhideitem(item.name)}>{item.name}
            <MdKeyboardArrowDown className={`absolute -right-0 w-4 h-4 font-bold leading-tight uppercase opacity-60 whitespace-normal cursor-pointer duration-300  ${onhide.includes(item.name) && 'rotate-180'}`} onClick={()=> addhideitem(item.name)}/>
            </h6>
              </div>
          </li>
            )}
              </ul>
              ))}


        
        </div>

      </aside>
      {/* END SIDEBAR */}

      {/* NAV BAR */}
      <main className={`${hidesidebar ? 'mt-5 lg:ml-[105px] mx-6' : 'ml-5 lg:ml-68.5'}  duration-500 relative`}>
      <nav className={`duration-500 fixed top-0 ${hidesidebar ? 'w-[calc(100%-122px)]' : 'w-[calc(100%-122px)] lg:w-navlg'}  my-2  py-4 px-6 bg-[hsla(0,0%,100%,80%)]  dark:bg-[#141414cb] rounded-md flex items-center justify-between backdrop-saturate-[300%] backdrop-blur-[10px]  shadow-blur z-20`}>
       <div className="hidden lg:flex mr-4 text-text-color dark:text-dark-text-color relative">
       <a href="#" onClick={()=>setHidesidebar(()=>!hidesidebar)} className={`font-semibold ${hidesidebar && 'hidden'}`}>
       <VscListSelection className="w-5 h-5"/>
       </a>
       <a href="#" onClick={()=>setHidesidebar(()=>!hidesidebar)} className={`font-semibold ${!hidesidebar && 'hidden'}`}>
       <VscListFlat className="w-5 h-5"/>
       </a>
       <div className=" absolute h-12 w-px -top-3 -right-3 bg-gray-color  "></div>
       </div>
        <div className="pl-4 flex flex-col lg:flex-row lg:justify-between lg:items-center w-full text-text-color dark:text-dark-text-color">
          <div className="flex flex-col">
          <span className="text-sm font-light">{datalist.find((ev)=> ev.name.includes(onselect)).pageof} / {onselect}</span>
          <span className="font-bold text-lg">{onselect}</span>
          </div>
          <div className="relative flex justify-between items-center gap-3">
            {/* <div>
          <FaSearch className="absolute  text-text-color dark:text-dark-text-color inset-y-3 inset-x-3"/>
        <input type="text" 
        className="pl-10 text-sm focus:shadow-md lg:w-auto w-4/6 block  flex-auto rounded-lg border border-solid border-gray-color dark:border-text-color bg-background dark:bg-dark-second py-2 pr-3 text-gray-700 dark:text-dark-text-color  dark:placeholder:text-color focus:border-primary dark:focus:border-dark-primary focus:outline-none focus:transition-shadow" 
        placeholder="Type here..." />
        </div> */}
        <div className=" flex gap-3 items-center">
          <div className="relative ">
          <BiSun className={`${!darkmode && 'hidden'} text-text-color dark:text-dark-text-color w-6 h-6 cursor-pointer duration-500 hover:rotate-45`} onClick={()=>setDarkmode(()=>!darkmode)}/>
          <PiMoonStarsFill className={` ${darkmode && 'hidden'} text-text-color dark:text-dark-text-color w-6 h-6 cursor-pointer duration-500 hover:-rotate-45 `} onClick={()=>setDarkmode(()=>!darkmode)}/>
          </div>
          <div className="relative ">
          <PiBellFill className="text-text-color dark:text-dark-text-color w-5 h-5 cursor-pointer"/>
          <div className="absolute animate-bounce hidden items-center justify-center rounded-full -right-2 -top-1 w-4 h-4 text-white text-sm bg-error dark:bg-dark-error">1</div>
          </div>
            <button className={`${!user  ? 'flex' : 'hidden'} items-center gap-1 text-text-color dark:text-dark-text-color font-semibold text-sm w-max `}
            onClick={()=> setIslogin(true)}>
              <BsPersonFill className="text-text-color dark:text-dark-text-color w-5 h-5"/>Sign In
            </button>
            <div className={` gap-2 duration-300 ${user  ? 'flex' : 'hidden'}`}>
            <Avatar className="w-10 h-10 shadow-2xl " {...user ? JSON.parse(user?.avatar) : ""}/>
            <span className="font-semibold text-sm">{user?.firstname} <br/> {user?.department} : {user?.position} </span>
            </div>
        </div>
        </div>
        </div>
      </nav>

      {/* END NAV BAR */}
      </main>

      {islogin && (<NavLoginModal open={islogin} setopen={setIslogin}/>)}
    </header>
  );
}

