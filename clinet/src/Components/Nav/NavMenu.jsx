import { Link } from "react-router-dom";
// EFFECT
import { Fragment, useState, useEffect } from "react";
import { Transition, Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// ICONS
import { ComputerDesktopIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import { PiComputerTower , PiUsersThree } from "react-icons/pi";
import { RiComputerLine } from "react-icons/ri";
import { BsPrinter } from "react-icons/bs";
import { LiaMicrosoft } from "react-icons/lia";
import { CgMenuGridO } from "react-icons/cg";
import { LiaRingSolid } from "react-icons/lia";

export default function NavMenu({ User }) {
  const products = [
    {
      name: "Computer",
      description: "Get a better understanding of your traffic",
      link: "/",
      icon: CpuChipIcon,
    },
    {
      name: "Moniter",
      description: "Speak directly to your customers",
      link: "/",
      icon: ComputerDesktopIcon,
    },
    {
      name: "UPS",
      description: "Connect with third-party tools",
      link: "/",
      icon: PiComputerTower,
    },
    {
      name: "Printer",
      description: "Your customers’ data will be safe and secure",
      link: "/",
      icon: BsPrinter,
    },
    {
      name: "Software",
      description: "Build strategic funnels that will convert",
      link: "/",
      icon: LiaMicrosoft,
    },
  ];

  const callsToAction = [{ name: "Asset all", href: "#", icon: CgMenuGridO }];

  const adminpage = [{name:"User",link:"/users",icon:PiUsersThree},{name:"Permission",link:"/permission",icon:LiaRingSolid,}]


  return (
    <Popover.Group className="hidden lg:flex lg:gap-x-12">
      <Link to="/" className="text-sm font-semibold leading-6 text-gray-900">
        Home
      </Link>
      <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
        Tickets
      </a>
      {/* {User && (
        <Link
          to="/users"
          href="#"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Admin
        </Link>
      )} */}
      <Popover className="relative">
        {/* {User && permiss ==='admin' && ( */}
        {User && (
          <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            Admin
            <ChevronDownIcon
              className="h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
            />
          </Popover.Button>
        )}

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="z-40 absolute -left-8 top-full  mt-3 w-80 max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {adminpage.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon
                      className="h-6 w-6 text-gray-600 group-hover:text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-auto">

                    <Link to={item.link} className="block font-semibold text-gray-900">
                      {item.name}
                      <span className="absolute inset-0" />
                    </Link>

                    {/* <p className="mt-1 text-gray-600">{item.description}</p> */}
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
              {callsToAction.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                >
                  <item.icon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div> */}
          </Popover.Panel>
        </Transition>
      </Popover>
      <Popover className="relative">
        {/* {User && permiss ==='admin' && ( */}
        {User && (
          <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            Asset
            <ChevronDownIcon
              className="h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
            />
          </Popover.Button>
        )}

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="z-40 absolute -left-8 top-full  mt-3 w-80 max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {products.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon
                      className="h-6 w-6 text-gray-600 group-hover:text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-auto">
                    <a
                      href={item.href}
                      className="block font-semibold text-gray-900"
                    >
                      {item.name}

                      <span className="absolute inset-0" />
                    </a>
                    {/* <p className="mt-1 text-gray-600">{item.description}</p> */}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
              {callsToAction.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                >
                  <item.icon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </Popover.Group>
  );
}
