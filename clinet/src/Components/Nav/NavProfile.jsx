import {useState , useContext , useEffect, Fragment} from "react";
import {Transition , Menu , Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";
import {BiGhost} from 'react-icons/bi'
import Avatar  from "react-nice-avatar";
import NavLoginModal from './NavLoginModal'
import { UserContext } from "../../UserContext.jsx";


export default function NavProfile({Userlogged , logout}) {
const {user, setUser , setNotify , setNotifydetail } = useContext(UserContext);
let [isOpen, setIsOpen] = useState(false)
let [configavatar, setConfigavatar] = useState({})



useEffect(()=>{
  if (user){
    setConfigavatar(JSON.parse(user.avatar))
  }
},[user])

      const userNavigationLogged = [
        { name: "Your Profile", link: '/profile' },
        { name: "Lot out", link: "#" ,onClick: ()=>logout(true)},
      ];
      const userNavigationNotLogged = [
        { name: "Log in", link: '#' , onClick:Handlelogin},
      ];
      
      const menu = Userlogged ? userNavigationLogged : userNavigationNotLogged;
      
      function Handlelogin(){
       setIsOpen(true)
      }

    
    return (
      <>
        <Menu
          as="div"
          className="relative  hidden lg:flex lg:flex-1 lg:justify-end"
        >
          {/* <Menu as="div" className="relative ml-3"> */}
          <div>
            <Menu.Button className="flex max-w-xs justify-between items-center rounded-full bg-gray-200 text-sm focus:outline-none  shadow-md ">
              {Userlogged && (
                <div className="flex-col inline-flex mx-4 text-center">
                  <span className="font-semibold text-sm ml-3 ">{user?.firstname}</span>
                  <span className="font-semi text-xs ml-3 text-left">{`${user?.department} : ${user?.position}`}</span>
                </div>
              )}
              {Userlogged ? (
                <Avatar className="w-10 h-10 shadow-2xl border-2 border-white "{...configavatar}/>
              ) : (
                <div className="flex items-center justify-center h-10 w-10 text-2xl bg-white rounded-2xl">
                  <BiGhost />
                </div>
              )}
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-12 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {menu.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) =>
                      <Link
                        to={item.link}
                        onClick={item.onClick}
                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? "bg-gray-100" : ""}`}>
                        {item.name}
                      </Link>
                  }
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
                  {isOpen && (
                    <NavLoginModal open={isOpen} setopen={setIsOpen}/>
                  )}
       

      </>
    );
}