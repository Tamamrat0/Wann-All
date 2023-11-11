import {useContext } from "react";
import NavBar from "./Nav/Nav";
import {Outlet} from "react-router-dom";
import {PageContext} from "../PageContext";

export default function Layout() {
  const {hidesidebar } = useContext(PageContext);

  return (
    <div className="">
      <NavBar />
      <div className={`${hidesidebar ? 'ml-[110px]' : 'ml-[110px] lg:ml-[274px]'} mt-[135px] lg:mt-24 duration-500 pr-4 pl-1`}>
      <Outlet/>
      </div>
    </div>
  );
}