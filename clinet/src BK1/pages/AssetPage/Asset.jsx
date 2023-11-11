import {useState , useContext , useEffect , useRef, Fragment} from "react"

// LIBRARY 
import { Select , ConfigProvider , theme} from "antd"
import { Dialog, Transition, Tab } from "@headlessui/react";


// PATH FILE 
import {UserContext} from "../../UserContext.jsx";
import {PageContext} from "../../PageContext.jsx";
import {AdminContext} from "../../AdminContext.jsx";
import TableAssets from "./TableAssets.jsx"

// ICON
import {IoIosAddCircleOutline} from 'react-icons/io'
import {BiFilterAlt} from 'react-icons/bi'
import AddAssets from "./AddAssets.jsx";


export default function Asset(){
    // CONTEXT
    const {darkmode} = useContext(PageContext);
    const {categories , setCategories , assetsall } = useContext(AdminContext);
    const {user} = useContext(UserContext);

    //  console.log(assetsall)
    // DATA

    // CONTROLLER
    const [themes , setThemes] = useState('')
    const [open , setOpen] = useState(false)
    const [openmodal , setOpenmodal] = useState(false)



    // FILTER 
    const [realCate , setRealCate] = useState([])
    const [cate_filter , setCate_filter] = useState([])
    const [data_filter , setData_filter] = useState([])

  

    function handleSelectFilter(value){
      // console.log(value)
      if(!cate_filter.includes(value)){
        setCate_filter([...cate_filter , value])
        if(data_filter){
          let morefilter = (assetsall.filter(item => item.cate_name === value))
          setData_filter([...data_filter , ...morefilter])
        }else{
          setData_filter(assetsall.filter(item => item.cate_name === value))
  
        }
      }

      // const cate = assetsall.map(item => item.cate_name)
      // console.log(cate)
      // let uniqueNumbers = ['ทั้งหมด' , ...new Set(cate)];
      // console.log(uniqueNumbers)

    }

    function handleRemoveFilter(value){
      setCate_filter(cate_filter.filter(item => item !== value))
      setData_filter(data_filter.filter(item => item.cate_name !== value))
    }





    useEffect(()=>{
      if(assetsall){
        const cate = assetsall.map(item => item.cate_name)
        setRealCate([...new Set(cate)])
      }
        const { darkAlgorithm , defaultAlgorithm} = theme;
        if(darkmode){
          setThemes({algorithm: [darkAlgorithm]})
        }else{
          setThemes({algorithm: [defaultAlgorithm]})
        }
      },[darkmode])

      
console.log(realCate)

    return(
        <main className="flex flex-col ">
            {/* Text Header */}
            <div className="flex flex-col mt-4">
            <h1 className="text-text dark:text-dark-text-color text-2xl font-semibold">Assets</h1>
            <h3 className="text-text dark:text-dark-text-color text-base leading-7  ">ข้อมูลอะไหล่ และ ทรัพย์สินทั้งหมด</h3>
            </div>


            {/* controller Button */}
            <div className="flex flex-col lg:flex-row mt-4 justify-between items-center px-4 ">


                {/* RIGHR ZONE */}
                <div className="flex justify-start lg:justify-end w-full mt-2 lg:mt-0 ">
                  
                <div className="flex  items-center gap-4  dark:bg-dark-second rounded-lg px-4 py-2 relative">
                    <div className="relative flex items-center">
                        <ConfigProvider theme={themes}>
                    <Select 
                            showSearch
                            className="w-40"
                            placeholder="กรองชนิด "
                            value={null}
                            onChange={(value)=>handleSelectFilter(value)}
                            options={realCate.length >0  && realCate?.map((res) => ({
                              label: res,
                                value: res,
                            }))}
                            />
                            </ConfigProvider>
                    </div>
                    <div className={`${cate_filter.length >0 ? ' px-2 h-full flex items-center gap-2' : 'hidden duration-300'}`}>
                      {cate_filter && cate_filter.map(item => (
                        <Fragment key={item}>
                          <div className={`px-1 bg-white dark:bg-dark-background dark:text-white rounded-md flex items-center gap-2 `}>{item}
                          <button
                          onClick={()=>handleRemoveFilter(item)} 
                          className="w-4 h-4  bg-error text-white rounded-full flex items-center justify-center text-xs">x</button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <button className="w-8 h-8 ">
                        <IoIosAddCircleOutline className="w-full h-full text-text dark:text-dark-text-color "
                        onClick={()=>setOpenmodal(!openmodal)}/>
                    </button>

                </div>
                </div>
            </div>


            {/* TABLE */}
            <div className="mt-4">
                <TableAssets themes={themes} assetsall={assetsall}  user={user} data_filter={data_filter}/>
            </div>

            {/* Modal */}
            {openmodal && (<AddAssets open={openmodal}  setopen={setOpenmodal}  categories={categories} setCategories={setCategories} />)}
        </main>
    )
}