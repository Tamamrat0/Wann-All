import { useState, useEffect } from "react";
import { Dialog, Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import NavLoginModal from "./NavLoginModal";
import Avatar from "react-nice-avatar";
// ICONS
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { PiComputerTower } from "react-icons/pi";
import { RiComputerLine } from "react-icons/ri";
import { BsPrinter } from "react-icons/bs";
import { LiaMicrosoft } from "react-icons/lia";
import { CgMenuGridO } from "react-icons/cg";

export default function NavMobile({
  mobole,
  setmobile,
  User,
  isAsset,
  setIsasset,
  logout,
}) {
  let [isOpen, setIsOpen] = useState(false);

  let [configavatar, setConfigavatar] = useState({});

  useEffect(() => {
    if (User) {
      setConfigavatar(JSON.parse(User.avatar));
    }
  }, [User]);
  const products = [
    {
      name: "Computer",
      description: "Get a better understanding of your traffic",
      link: "/",
      icon: ComputerDesktopIcon,
    },
    {
      name: "Moniter",
      description: "Speak directly to your customers",
      link: "/",
      icon: RiComputerLine,
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

  function Handlelogin(ev) {
    ev.preventDefault();
    setIsOpen(true);
  }

  // console.log(isAsset);
  return (
    <>
      <Dialog as="div" className="lg:hidden" open={mobole} onClose={setmobile}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-1/2 overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              {/* <span className="sr-only">Your Company</span> */}
              <img className="h-8 w-auto" src="../src/assets/logo.png" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setmobile(false)}
            >
              {/* <span className="">Close menu</span> */}
              <XMarkIcon
                onClick={() => setIsasset(false)}
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Tickets
                </a>
                {User && (
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Users
                  </a>
                )}
                {User && (
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          onClick={() => setIsasset((prevState) => !prevState)}
                          className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          Asset
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {[...products, ...callsToAction].map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              onClick={() => setIsasset(false)}
                              as="a"
                              href={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )}
              </div>
              <div className="py-6">
                {!User ? (
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={Handlelogin}
                  >
                    Log in
                  </a>
                ) : (
                  <div className="max-w-xs w-44 bg-gray-200 rounded-full flex  justify-between items-center">
                    <div className="flex flex-col pl-5">
                      <span className="text-center w-full font-bold">{`${User?.firstname}`}</span>
                      <span className=" text-left w-full text-sm">{`${User?.department} : ${User?.position}`}</span>
                    </div>
                    <Avatar
                      className="w-10 h-10 shadow-2xl border-2 border-white "
                      {...configavatar}
                    />
                  </div>
                )}
              </div>

            </div>
            {User && (
                <div
                  className={`mt-20 mb-3 flex flex-row p-4 w-5/6 items-center  justify-center  ${isAsset ? " " : "absolute bottom-3"}`}
                >
                  <button
                    className="bg-indigo-600 px-4 py-2 rounded-md text-white "
                    onClick={() => logout(true)}
                  >
                    Logout
                  </button>
                </div>
              )}
          </div>
          {isOpen && <NavLoginModal open={isOpen} setopen={setIsOpen} />}
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
