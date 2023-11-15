import {useContext } from "react";
import NavBar from "./Nav/Nav";
import {Outlet} from "react-router-dom";
import {PageContext} from "../PageContext";

export default function Layout() {
  const {hidesidebar } = useContext(PageContext);
console.log(hidesidebar)
  return (
    <div className="">
      <NavBar />
      {/* <div className={`${hidesidebar ? 'ml-[100px]' : 'ml-[100px] lg:ml-[270px]'} mt-[135px] lg:mt-24 duration-500 pr-4 pl-1`}> */}
      <div className={`${hidesidebar ? 'ml-5 lg:ml-[100px] ' : 'ml-5 lg:ml-[270px]'} mt-[135px] lg:mt-24 duration-500 pr-4 pl-1`}>
      <Outlet/>
      </div>
    </div>
  );
}