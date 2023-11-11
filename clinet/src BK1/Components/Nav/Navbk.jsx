import {useState , useContext , useEffect} from "react";
import { Link, Navigate, redirect } from "react-router-dom";
import axios from "axios";
// Icons

import { Bars3Icon} from "@heroicons/react/24/outline";


// Routs

import NavProfile from "./NavProfile";
import NavMenu from "./NavMenu";
import NavMobile from "./NavMobile";

// CONTEXT
import {UserContext} from "../../UserContext.jsx";


export default function NavBar2() {
  const { user , setUser, messageApi,  notifylogin , contextHolder} = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  let [isAsset, setIsasset] = useState(false)
  let [islogout, setIslogout] = useState(false)
  useEffect(() => {
    if (notifylogin.open) {
      messageApi.open({
        type: 'success',
        content: notifylogin.detail,
        duration: 2,
      });
    }
  }, [messageApi, notifylogin]);

  if (islogout) {
    axios.post('/auth/logout');
    setUser(null);
    setIslogout(false);
  }

  function handelClick() {
    return <Navigate to="/" replace={true} />;
  }


  return (

    <header className="bg-white">
      {contextHolder}

      <nav
        className=" mx-auto flex max-w-full items-center justify-between p-3 lg:px-8 shadow-md"
        // ring-1 ring-gray-200
        aria-label="Global">
        <div className="flex lg:flex-1">
          <div className="-m-1.5 p-1.5 flex items-center gap-4 cursor-pointer" onClick={handelClick}>
            <img className="h-8 w-auto" src="../src/assets/logo.png" alt="" />
            <span className="font-semibold">IT ManageMent</span>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => {setMobileMenuOpen(true); setIsasset(false)}}>
              <div className="flex justify-center items-center h-10 w-10">
                <Bars3Icon className="h-7 w-7" aria-hidden="true" />
              </div>
          </button>
        </div>
          <NavMobile mobole={mobileMenuOpen} setmobile={setMobileMenuOpen} User={user} isAsset={isAsset} setIsasset={setIsasset} logout={setIslogout}/>
          {/* <NavMenu log={logged} setlog={setLogged}/> */}
          <NavMenu User={user}/>
          <NavProfile Userlogged={user} logout={setIslogout}/>
      </nav>

      {/* Mobile */}
      
    </header>
  );
}
