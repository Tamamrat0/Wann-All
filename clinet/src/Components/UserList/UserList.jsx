import {useState , useContext , useEffect, Fragment} from "react";
import Avatar  from "react-nice-avatar";
import { UserContext } from "../../UserContext";
export default function UserList(){
    const {  usersall , useronline } = useContext(UserContext);

    const [usersallsort, setUsersallsort] = useState([]);

    useEffect(() => {
        if(usersall && usersall.length > 0){
            const inB = usersall.filter(x => useronline.includes(String(x.id))).sort((a, b) => useronline.indexOf(String(a.id)) - useronline.indexOf(String(b.id)));
            const notInB = usersall.filter(x => !useronline.includes(String(x.id)));
    
            setUsersallsort([...inB, ...notInB]);
        }
    }, [usersall, useronline]);
    // console.log(usersallsort)
    return(
        <>
        {/* RIGHT ZONE */}
        <div className="min-w-[12%] z-20 fixed -right-12 hover:right-0 lg:right-4 lg:hover:right-4 top-[135px] lg:top-[6rem] bottom-2 px-2 lg:px-4 py-2 bg-background dark:bg-dark-second rounded-md overflow-auto  scrollbar-hide duration-300">
            <div className="flex flex-col  w-full text-text dark:text-dark-text-color">
                <h1 className="mt-1  font-semibold text-sm">IT ({usersall?.filter(i => i.department === 'IT').length})</h1>
                {usersall && usersall.map((item ,index)=>(
                    <Fragment key={item.id || index}>
                    {item.department === 'IT' && (
                        <div  className="flex justify-center lg:justify-start items-center gap-4 mt-5">
                    <div className="relative">
                        <Avatar className="w-10 h-10 shadow-2xl " {...JSON.parse(item?.avatar)}/>
                        <div className={`${useronline.includes(String(item.id)) ? 'bg-green-500' : 'bg-error'} duration-300 absolute h-4 w-4 -right-1 -bottom-0 rounded-full border-2 border-white dark:border-dark-second`}></div>
                    </div>
                    <div className=" flex-col lg:flex hidden">
                        <span className="font-semibold">{item.firstname}</span>
                        <span className="text-sm">{`${item.department} : ${item.position}`}</span>
                    </div>
                </div>
                    )}
                    </Fragment>
                    ))}
                <h1 className="mt-5  font-semibold text-sm">PE ({usersall?.filter(i => i.department === 'PE').length})</h1>
                {usersall && usersall.map((item ,index)=>(
                    <Fragment key={item.id || index}>
                    {item.department === 'PE' && (
                        <div  className="flex justify-center lg:justify-start items-center gap-4 mt-5">
                    <div className="relative">
                        <Avatar className="w-10 h-10 shadow-2xl " {...JSON.parse(item?.avatar)}/>
                        <div className={`${useronline.includes(String(item.id)) ? 'bg-green-500' : 'bg-error'} duration-300 absolute h-4 w-4 -right-1 -bottom-0 rounded-full border-2 border-white dark:border-dark-second`}></div>
                    </div>
                    <div className=" flex-col lg:flex hidden">
                        <span className="font-semibold">{item.firstname}</span>
                        <span className="text-sm">{`${item.department} : ${item.position}`}</span>
                    </div>
                </div>
                    )}
                    </Fragment>
                    ))}
                    <h1 className="mt-6 font-semibold text-sm overflow-hidden">All ({(usersallsort.filter(i=> i.department !== 'IT' && i.department !== 'PE' ).filter(s => useronline.includes(String(s.id))).length)})</h1>
                    {usersall && usersallsort.filter(i => i.department !== 'IT' && i.department !== 'PE').map((item , index)=>(
                    <Fragment key={item.id || index}>
                    <div key={item.id || index} className="flex justify-center lg:justify-start items-center gap-4 mt-5">
                    <div className="relative">
                        <Avatar className="w-10 h-10 shadow-2xl " {...JSON.parse(item?.avatar)}/>
                        <div className={`${useronline.includes(String(item.id)) ? 'bg-green-500' : 'bg-error'} duration-300 absolute h-4 w-4 -right-1 -bottom-0 rounded-full border-2 border-white dark:border-dark-second`}></div>
                    </div>
                    <div className=" flex-col lg:flex hidden">
                        <span className="font-semibold">{item.firstname}</span>
                        <span className="text-sm">{`${item.department} : ${item.position}`}</span>
                    </div>
                </div>
                    
                </Fragment>
                    ))}

            </div>
        </div>
        </>
    )
}