import {useContext ,  useState, useEffect } from "react";
import moment from 'moment';
// UI LIBRARY
import Avatar  from "react-nice-avatar";

// PATH FILE
import {PageContext} from "../../PageContext";
import UserList from "../../Components/UserList/UserList";

// ICON
import { FcBookmark ,FcApproval ,FcAnswers} from "react-icons/fc";

export default function Home(){
    const {hidesidebar } = useContext(PageContext);
    const [elapsedTime, setElapsedTime] = useState(moment.duration());
    // useEffect(() => {
    //     const startTime = moment("30/10/2023 15:30", "DD/MM/YYYY HH:mm");
    //     const updateElapsedTime = () => {
    //         const duration = moment.duration(moment().diff(startTime));
    //         setElapsedTime(duration);
    //     };

    //     updateElapsedTime(); // เรียกฟังก์ชันครั้งแรกเพื่อเป็นการเริ่มต้นการนับเวลา

    //     const interval = setInterval(updateElapsedTime, 1000); // นับเวลาทุกๆ 1 วินาที

    //     return () => clearInterval(interval); // cleanup เมื่อ component unmount
    // }, []); 
    // const days = elapsedTime.days();
    // const hours = elapsedTime.hours();
    // const minutes = elapsedTime.minutes();
    // const seconds = elapsedTime.seconds();


    return(
        <div className="flex">

        {/* LEFT ZONE */}
        <div className={`${hidesidebar ? 'w-[calc(100%-12%-24px)]' : 'lg:w-[calc(100%-20px-12%-24px)] w-[calc(100%-12%-24px)]'} bg-background dark:bg-dark-second rounded-md px-4 py-4 text-text dark:text-dark-text-color duration-300`}>
            {/* TOP ZONE */}
            <div className="flex gap-2 flex-col ">
            {/* <span className="text-xl font-semibold tracking-tight ">Ticket summary</span> */}
            <div className="flex flex-col lg:flex-row text-text dark:text-dark-text-color py-4 px-4 justify-around items-center gap-11">
                <div className="flex flex-col items-center ">
                    <div className="flex  gap-4">
                        <FcAnswers className="w-6 h-6"/>
                        <span className="font-semibold text-xl">งานที่กำลังทำ</span>
                    </div>
                    <span className="text-2xl font-semibold mt-2">เปิดใบงานผิด</span>
                    <div className="flex items-center gap-2 justify-center w-full mt-2">
                    <Avatar className="w-6 h-6 shadow-2xl "/>
                    {/* <span className=" text-sm ">tammarat : {days > 0 ? `${days}day ${hours}h ${minutes}m ${seconds}s` : `${hours}h ${minutes}m ${seconds}s`}</span> */}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex  gap-4">
                        <FcBookmark className="w-6 h-6"/>
                        <span className="font-semibold text-xl">จำนวน Ticket ค้าง</span>
                    </div>
                    <span className="text-2xl font-semibold mt-2">200 </span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex  gap-4">
                        <FcApproval className="w-6 h-6"/>
                        <span className="font-semibold text-xl">จำนวน Ticket ทั้งหมด</span>
                    </div>
                    <span className="text-2xl font-semibold mt-2">500 </span>
                </div>
            </div>
            </div>
        </div>

        {/* RIGHT ZONE */}
        <UserList/>
        </div>
    )
}