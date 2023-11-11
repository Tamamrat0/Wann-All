import { Fragment , useState, useEffect , useContext , React , useRef } from "react";

import { Divider, Input, Select, Button , Popconfirm , ConfigProvider } from 'antd';

import axios from "axios";


import { LiaSave } from "react-icons/lia";
import { GoPlus } from "react-icons/go";
import { ImBin } from "react-icons/im";

import {UserContext} from "../../UserContext.jsx";
import {AdminContext} from "../../AdminContext.jsx";
import ModalConfirm from "../../Components/ModalConfirm.jsx"


export default function AddSecond({selecttype , code,setCode,type,setType,name,setName ,receive , setReceive,quantity,setQuantity,detail,setDetail,spec,setSpec,ip,setIp,mac,setMac,supplier,setSupplier,warrantyday,setWarranyday,owner,setOwner,remark,setRemark , themes}) {

    const {typesall , setTypesall , userall , assetsall} = useContext(AdminContext);
    const {user} = useContext(UserContext);

    // DATA spec
    const [spec_cpu , setSpec_cpu] = useState('')
    const [spec_mb , setSpec_mb] = useState('')
    const [spec_ram , setSpec_ram] = useState('')
    const [spec_gpu , setSpec_gpu] = useState('')
    const [spec_hdd , setSpec_hdd] = useState('')
    const [spec_ssd , setSpec_ssd] = useState('')
    const [spec_m2 , setSpec_m2] = useState('')
    const [spec_psu , setSpec_psu] = useState('')

    // CONTROLER

    const [checkedItems, setCheckedItems] = useState([]);

    // INSERT TYPES
    const [texttypes , setTexttypes] = useState('')

    // DELETE TYPES 
    const [opendel , setOpendel] = useState(false)
    const [resdel , setResdel] = useState('')
    const [iddel , setIddel] = useState('')

    console.log(!user.department === 'IT')
    console.log(user.department === 'IT')
    const datatext = [
        {label:'รหัส', description : 'รหัสอุปกรณ์' , value:code,onchange:setCode ,type:'text' , longtext:false , important:'yes' , detp: true},
        {label:'ชนิด', description : 'ประเภทหรือลักษณะของอุปกรณ์ เช่น เครื่องใช้ไฟฟ้า, คอมพิวเตอร์ หรือคุณสามารถเพิ่มหัวข้อเองได้' , value:type,onchange:setType ,type:'selecttype' , longtext:false , important:'yes' , detp: true},
        {label:'ชื่ออุปกรณ์', description : 'ชื่อที่ใช้ระบุอุปกรณ์นี้ เช่น iPhone X, Dell Inspiron 15, เป็นต้น' , value:name,onchange:setName ,type:'text' , longtext:false , important:'yes' , detp: true},
        {label:'จำนวน', description : 'จำนวนของอุปกรณ์' , value:quantity,onchange:setQuantity ,type:'number', longtext:false , important:'yes' , detp: true},
        {label:'วันที่รับเข้า', description : 'วันที่รับเข้าของอุปกรณ์' , value:receive,onchange:setReceive ,type:'date', longtext:false , important:'yes' , detp: true},
        {label:'รายละเอียด', description : 'ข้อมูลเพิ่มเติมเกี่ยวกับอุปกรณ์ เช่น คุณสมบัติพิเศษ, สี, น้ำหนัก เป็นต้น' , value:detail,onchange:setDetail ,type:'text' , longtext:true , important:'' , detp: true},
        {label:'สเปค',  description : 'ข้อมูลเฉพาะเกี่ยวกับสเปคของคอมพิวเตอร์' , value:'',onclick:null ,type:'spec',   longtext:false , important:'' , detp: user.department === 'IT'},
        {label:'IP Address', description : 'ที่อยู่ IP ของอุปกรณ์ (หากมี)' , value:ip,onchange:setIp ,type:'text',  longtext:false , important:'' , detp: true},
        {label:'MAC Address', description : 'ที่อยู่ MAC ของอุปกรณ์ (หากมี)' , value:mac,onchange:setMac ,type:'text',  longtext:false , important:'' , detp: true},
        {label:'Supplier', description : 'บริษัทหรือผู้จัดจำหน่ายของอุปกรณ์นี้' , value:supplier,onchange:setSupplier ,type:'text',  longtext:false , important:'' , detp: true},
        {label:'วันรับประกัน', description : 'วันที่อุปกรณ์ได้รับการรับประกัน กรอกเป็นวัน เช่น 365 วัน' , value:warrantyday,onchange:setWarranyday ,type:'number' , longtext:false , important:'' , detp: true},
        {label:'owner', description : 'ข้อมูลเกี่ยวกับผู้ที่เป็นเจ้าของของอุปกรณ์นี้' , value:owner,onchange:setOwner ,type:'select',  longtext:false , important:'' , detp: true},
        {label:'Remark', description : 'ข้อมูลหรือความคิดเห็นเพิ่มเติมที่คุณต้องการจะบันทึกเกี่ยวกับอุปกรณ์นี้' , value:remark,onchange:setRemark ,type:'text',  longtext:true , important:'' , detp: true},
    ]

    const speclist = [
        {label:'Cpu' , value:spec_cpu , onchange:setSpec_cpu},
        {label:'Mainboard' , value:spec_mb , onchange:setSpec_mb},
        {label:'Memory' , value:spec_ram , onchange:setSpec_ram},
        {label:'Gpu' , value:spec_gpu , onchange:setSpec_gpu},
        {label:'Harddisk' , value:spec_hdd , onchange:setSpec_hdd},
        {label:'Solid State Drive' , value:spec_ssd , onchange:setSpec_ssd},
        {label:'M.2' , value:spec_m2 , onchange:setSpec_m2},
        {label:'Power Supply' , value:spec_psu , onchange:setSpec_psu},
    ]

    function inputbox(type = 'text', value = null, onchange = null , name){
        return(
            <div className="relative">
                <input
                type={type}
                value={value}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={` w-full px-4 text-sm focus:shadow-md h-8  flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                />
                <div className={`${name === 'วันรับประกัน' ? 'absolute' : 'hidden'} mt-2 flex gap-2`}>
                    <button className={`px-4 border rounded-md ${warrantyday === 365 ? 'bg-primary text-white' : 'text-text dark:text-dark-text-color'}  hover:bg-primary hover:text-white duration-500`}
                    onClick={()=>setWarranyday(365)}>1 ปี</button>
                    <button className={`px-4 border rounded-md ${warrantyday === 730 ? 'bg-primary text-white' : 'text-text dark:text-dark-text-color'}  hover:bg-primary hover:text-white duration-500`}
                    onClick={()=>setWarranyday(730)}>2 ปี</button>
                    <button className={`px-4 border rounded-md ${warrantyday === 1095 ? 'bg-primary text-white' : 'text-text dark:text-dark-text-color'}  hover:bg-primary hover:text-white duration-500`}
                    onClick={()=>setWarranyday(1095)}>3 ปี</button>
                    <button className={`px-4 border rounded-md ${warrantyday === 1825 ? 'bg-primary text-white' : 'text-text dark:text-dark-text-color'}  hover:bg-primary hover:text-white duration-500`}
                    onClick={()=>setWarranyday(1825)}>5 ปี</button>
                </div>
                <div className={`${name === 'รหัส' && assetsall?.some(name => name.item_no.trim().toLowerCase() === code.trim().toLowerCase() )  ? 'absolute' : 'hidden'} mt-2 flex gap-2 text-error font-semibold`}>
                    <span>รหัสนี้มีอยู่แล้ว</span>
                </div>
                </div>
        )
    }
   
    function inputspec(name , value , onchange){
        return(
            <input
            type='text'
            value={value ? value.text : value}
            onChange={(ev)=>onchange({label:name , text:ev.target.value })}
            min="0"
            disabled={!checkedItems.includes(name)}
            className={`${!checkedItems.includes(name) && 'bg-gray-100  dark:bg-second cursor-not-allowed'} px-4 text-sm focus:shadow-md h-8  flex-auto rounded-md border border-solid font-semibold
            border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
            text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
            />
        )
    }


    const handleCheckboxChange = (label , onchange) => {
        console.log(label)
        // console.log(spec)
        // ตรวจสอบว่ามี label ใน selectedItems หรือไม่
         
        if (checkedItems.includes(label)) {
          // ถ้ามีแล้ว, ลบ label นั้นออกจาก array
          setCheckedItems(prevItems => prevItems.filter(item => item !== label));


        } else {
          // ถ้ายังไม่มี, เพิ่ม label นั้นเข้าไปใน array
          setCheckedItems(prevItems => [...prevItems, label]);
        } 
        onchange('')
        
    };
    // console.log(checkedItems)
    // console.log(checkedItems)

    useEffect(()=>{
        let newdata = null
            // console.log(newdata.values)
        if(checkedItems.includes(spec_cpu.label)){
            spec ? newdata = {...newdata, [spec_cpu.label]: spec_cpu.text} : newdata = {[spec_cpu.label]: spec_cpu.text}
        }
        if(checkedItems.includes(spec_mb.label)){
            spec ? newdata = {...newdata, [spec_mb.label]: spec_mb.text} : newdata = {[spec_mb.label]: spec_mb.text}
        }
        if(checkedItems.includes(spec_ram.label)){
            spec ? newdata = {...newdata, [spec_ram.label]: spec_ram.text} : newdata = {[spec_ram.label]: spec_ram.text}
        }
        if(checkedItems.includes(spec_gpu.label)){
            spec ? newdata = {...newdata, [spec_gpu.label]: spec_gpu.text} : newdata = {[spec_gpu.label]: spec_gpu.text}
        }
        if(checkedItems.includes(spec_hdd.label)){
            spec ? newdata = {...newdata, [spec_hdd.label]: spec_hdd.text} : newdata = {[spec_hdd.label]: spec_hdd.text}
        }
        if(checkedItems.includes(spec_ssd.label)){
            spec ? newdata = {...newdata, [spec_ssd.label]: spec_ssd.text} : newdata = {[spec_ssd.label]: spec_ssd.text}
        }
        if(checkedItems.includes(spec_m2.label)){
            spec ? newdata = {...newdata, [spec_m2.label]: spec_m2.text} : newdata = {[spec_m2.label]: spec_mb.text}
        }
        if(checkedItems.includes(spec_psu.label)){
            spec ? newdata = {...newdata, [spec_psu.label]: spec_psu.text} : newdata = {[spec_psu.label]: spec_psu.text}
        }
        
        if(newdata){
            setSpec([newdata])
        }else{
            setSpec(null)
        }
        
        // console.log(newdata) 

    },[spec_cpu,spec_mb,spec_ram,spec_hdd,spec_ssd,spec_m2,spec_psu])



    function handleAddtypes() {
        if(texttypes){
            axios.post('/assets/addtypes' , {cate_id :selecttype?.id , name:texttypes}).then(({data})=>{
                console.log(data)
                setTypesall([...typesall , ...data])
                setTexttypes('')
            }).catch((err)=>{

            })
        }
    }

    function handleDeletTypes(id) {
        console.log(id)
        setOpendel(true)
        setIddel(id)
    }

    useEffect(()=>{
        setType('')
        if(resdel){
          setResdel(false)
              axios.post('/assets/deltypes',{iddel}).then(({data})=>{
                  setTypesall(typesall.filter((item)=> item.id !== iddel))
                  setType('')
                })
            
        }
      },[resdel])

    // console.log(owner) 

    return(
    <>
    <div className="border rounded-md py-4 px-4 dark:border-dark-second mt-4">

        <div className={`grid grid-cols-2 gap-8 items-center px-8 overflow-y-scroll max-h-hh  text-text dark:text-dark-text-color`}>
        <div className="flex flex-col mt-2 ">
                <h1 className="font-semibold text-lg">หมวดหมู่</h1>
            </div>
            <div className="flex flex-col mt-2 text-text dark:text-dark-text-color">
                <div className="bg-slate-200 dark:bg-dark-second  rounded-xl p-2 h-28 w-4/12">
                    <div className="flex flex-col justify-between items-center text-center h-full">
                <selecttype.icon className="mt-2 w-14 h-14 bg-background dark:bg-dark-background text-text dark:text-dark-text-color  p-2 rounded-full  "/>
                <h3 className="font-bold px-2 ">{selecttype?.cate_name}</h3>
                    </div>
                </div>
            </div>
            {datatext.map((item)=>(
                <Fragment key={item.label}>
                <div className={` flex-col mt-2 ${item.detp ? 'flex' : 'hidden'}`}>
                <h1 className={`font-semibold text-lg  `}>{item.label} {item.important && (<span className="text-error ml-4">*</span>)} </h1>
                <span>{item.description}</span>
                </div>
            {item.longtext ? (
                <textarea
                type={item.type}
                value={item.value}
                onChange={(ev) => item.onchange(ev.target.value)}
                className={`px-4 py-2 text-sm focus:shadow-md h-24 flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
            />
            ):(
                <>
                {item.type === 'spec' && user.department === 'IT' ? (
                    <div  tabIndex={1} className="border dark:border-dark-second bg-background dark:bg-dark-second  h-auto rounded-md grid grid-cols-2 gap-2 px-4 py-2 focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary">
                        {speclist.map((items)=>(
                        <Fragment key={items.label}>
                        <div  className="flex items-center gap-4">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600"
                            name={items.label}
                            onChange={()=>handleCheckboxChange(items.label , items.onchange)}
                             />
                            <span className={` text-md ${checkedItems.includes(items.label) && 'font-semibold' }`}>{items.label}</span>
                        </div>
                        {/* <inputbox check={items.label} /> */}
                        {inputspec(items.label , items.value , items.onchange)}
                        </Fragment>
                        ))}
                    </div>
                ) : (
                    <>
                    {item.type === 'selecttype' ? (
                        <ConfigProvider theme={themes}>
                        <Select 
                        value={type}
                        onChange={(ev)=>setType(ev)}
                        placeholder="เลือกชนิด"
                        dropdownRender={(menu) => (
                            <>
                            {menu}
                            <Divider
                                style={{
                                margin: '8px 0',
                                }}
                            />
                                <div className="flex justify-between w-full gap-2">
                                <div className=" relative w-full">
                                <Input
                                
                                placeholder="Please enter item"
                                value={texttypes}
                                onChange={(ev) => setTexttypes(ev.target.value)}
                                
                                ></Input>
                                <span className={`${typesall?.some(name => name.name.trim() === texttypes?.trim()) ? 'absolute' : 'hidden'}  right-10 top-1 text-error font-semibold`}>ชื่อนี้มีอยู่แล้ว</span>
                                </div>

                                <Button type="text" className="flex justify-center items-center" icon={<GoPlus />} onClick={()=>handleAddtypes()} >
                                <span className="opacity-0 w-0 lg:opacity-100 lg:w-max">Add item</span>
                                </Button>
                                </div>
                            </>
                            
                        )}
                        options={typesall
                            .filter((item) => item.cate_id === selecttype?.id || item.cate_id === 0)
                            .map((item) => ({
                              label: (
                                <>
                                  <div className="flex justify-between items-center ">
                                    {item.name}
                                    <Button
                                      type="text"
                                      className={`flex justify-center items-center ${item.id === 1 && 'hidden'} `}
                                      icon={<ImBin />}
                                      onClick={() => handleDeletTypes(item?.id)}
                                    />
                                  </div>
                                </>
                              ),
                              value: item?.id,
                            }))
                        }
                        />
                        </ConfigProvider>
                    ) : (
                        <>
                        {item.type === 'select' ? (
                        <ConfigProvider theme={themes}>
                        <Select 
                        value={owner}
                        onChange={(ev)=>setOwner(ev)}
                        placeholder="เลือกผู้ใช้"
                        options={userall.map((item)=> ({
                            label:item.firstname,
                            value:item.id
                        }))}
                        />
                            </ConfigProvider>
                            ) : (
                                <>
                                {item.detp &&
                                    inputbox(item.type , item.value , item.onchange , item.label)
                                }
                                </>
                                    )}
                        </>
                    )}
                    </>
                )}

                </>

            )}
            </Fragment>
            ))}
            {opendel && (
              <ModalConfirm 
              open = {opendel}
              onClose = {setOpendel}
              header='ยืนยันการลบข้อมูล'  
              detail='คุณต้องการลบข้อมูลนี้ใช่หรือไม่ ? <br/> หากยืนยันข้อมูลจะหายไปและไม่สามารถกู้คืนได้.' 
              onChange={setResdel}  
              status='delete' 
              />
              )}
        </div>

    </div>
    </>
    )
}