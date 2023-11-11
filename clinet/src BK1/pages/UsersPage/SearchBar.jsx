import { useState } from "react";
import { Empty  } from "antd";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineIdcard } from "react-icons/ai";
import { GoNumber } from "react-icons/go";
import Avatar from "react-nice-avatar";
export default function SearchBar({datausers , setSelectrow , setdatauser}) {
  const [input , setInput] = useState("")
  const [focus , setFocus] = useState(false)
  const [results , setResults] = useState(null)

  
  function handleChange(value){
    setInput(value);

    if(value !== ""){
      const lowerCaseValue = value.toLowerCase();
      const result = datausers.filter((item)=>{
        
        return value && item &&
        item.emp_no && item.emp_no.toLowerCase().includes(lowerCaseValue) ||
        item.firstname && item.firstname.toLowerCase().includes(lowerCaseValue) ||
        item.department && item.department.toLowerCase().includes(lowerCaseValue) 
      })

      setResults(result)
     
    }
      
    
  }

  function handleItemSelect(ev) {
    
    setSelectrow(ev)
    setInput("")
  }
  return (
    <>
    <div className="flex w-full flex-col relative ">
      <div className="w-full h-2/4 relative ">
        <input
          className="shadow-lg border rounded-lg w-full h-10 pl-8 pr-16  py-2 text-gray-500 placeholder-gray-400 focus:outline-none focus:border-blue-400"
          type="text"
          placeholder="ค้นหาจาก ID , ชื่อ , แผนก"
          value={input}
          onChange={(ev)=>handleChange(ev.target.value)}
          onBlur={()=>setFocus(true)}
          onClick={()=>setFocus(false)}
    
        />
      <BiSearchAlt className=" absolute top-3 mx-2 h-4 w-4 items-center" />
      <AiOutlineIdcard className=" absolute top-3 right-1 mx-2 h-4 w-4 text-gray-500" />
      <GoNumber className=" absolute top-3 right-7 mx-2 h-4 w-4 text-gray-500" />
      </div>

        <div className={`absolute opacity-0 h-0 overflow-y-auto top-12 w-full bg-white duration-500
        rounded-lg z-40 shadow-lg ${!!input && !focus ? 'opacity-100 h-72 ' : ''}`}>
        <div className="flex flex-col  items-center py-4 gap-3  ">

        <div className="flex px-12 w-full items-center text-center text-gray-500 justify-between font-bold ">
              <p className="w-8"></p>
              <p className="w-1/4 ">ไอดี</p>
              <p className="w-1/4 ">ชื่อ</p>
              <p className="w-1/4 ">แผนก</p>
        </div>
        {results?.length  < 1 &&(
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}

          {results?.map((item,index)=>(
            <>
            <div key={index} 
           onClick={() => handleItemSelect(item)}
            className=" cursor-pointer flex px-12 w-full items-center text-center text-gray-500 justify-between hover:bg-gray-200  ">
              <Avatar className=" w-8 h-8 "{...JSON.parse(item?.avatar)}/>
              <p className="w-1/4 py-3">{item.emp_no}</p>
              <p className="w-1/4">{item.firstname}</p>
              <p className="w-1/4" >{item.department}</p>
            </div>

            </>
          ))}
        </div>
        </div>
      </div>
      
{/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> */}
    </>
  
  );
}
