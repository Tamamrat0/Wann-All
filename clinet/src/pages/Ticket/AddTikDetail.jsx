import React from 'react'
import { Fragment,  useState, useEffect , useContext  , useRef } from "react";
import { ConfigProvider , Select , Radio  } from "antd";

export default function AddTikDetail({assets , themes, dept , style ,setStyle ,setDept,subject,setSubject,description,setDescription,codedevice,setCodedevice,select_doc,listdepartment}) {
    const forminput =  [
        {lable:'ส่งถึง' , description: 'เลือกหน่วยงานที่ต้องการส่งถึง' , value:dept , onchange:setDept  , typeinput:'selectdept' , type:'all' , important:true},
        {lable:'ลักษณะงาน' , description: 'เลือกลักษณะที่เกี่ยวข้องกับงานนี้' , value:style , onchange:setStyle  , typeinput:'radio' , type:'repair' , important:true},
        {lable:'เรื่อง / อาการ' , description: 'กรอกเรื่องหลักของการติดต่อ' , value:subject , onchange:setSubject  , typeinput:'input' , type:'all' , important:true},
        {lable:'รายละเอียด' , description: 'กรอกรายละเอียดเพิ่มเติมเกี่ยวกับเรื่องที่ต้องการติดต่อ' , value:description , onchange:setDescription  , typeinput:'area' , type:'all' , important:false},
        {lable:'ชื่อเครื่องจักร / อุปกรณ์' , description: 'เลือกเครื่องจักร หรือ อุปกรณ์ที่มีปัญหา (หากทราบ)' , value:codedevice , onchange:setCodedevice  , typeinput:'selectassets' , type:'repair' , important:false},
    ]

    // const [selectedOption, setSelectedOption] = useState(''); // สถานะเพื่อเก็บค่าตัวเลือกที่ถูกเลือก

    const handleOptionChange = (event) => {
        setStyle(event.target.value); // อัพเดตค่าตัวเลือกที่ถูกเลือกเมื่อมีการเปลี่ยนแปลง
    };
  
    function inputbox( value = null, onchange = null ){
        return(
            <div className="relative">
                <input
                type='text'
                value={value}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={` w-full px-4 text-sm focus:shadow-md h-8  flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                />
            </div>
        )
    }

    function areabox(value = null, onchange = null ){
        return(
            <div className="relative">
                <textarea
                type='text'
                value={value}
                onChange={onchange ? (ev)=> onchange(ev.target.value) : null}
                min="0"
                className={`px-4 py-2 w-[100%] text-sm focus:shadow-md h-24 flex-auto rounded-md border border-solid font-semibold
                border-gray-color dark:border-text-color bg-background dark:bg-dark-second 
                text-text dark:text-dark-text-color dark:placeholder:text-color focus:outline-none focus:transition-shadow focus:border-primary dark:focus:border-dark-primary`}
                />
            </div>
        )
    }

    function selectdeptinput(){
        return(
            <ConfigProvider theme={themes}>
            <Select 
            value={dept}
            onChange={(ev)=>setDept(ev)}
            placeholder="เลือกผู้ใช้"
            options={listdepartment.filter(i => i.department === 'IT' || i.department === 'PE').map((item)=> ({
                    label:item.department,
                    value:item.department
            }))}
            />
            </ConfigProvider>
        )
    }

    function selectassetinput(){
      return(
          <ConfigProvider theme={themes}>
          <Select 
          value={codedevice}
          disabled={!assets}
          onChange={(ev)=>setCodedevice(ev)}
          placeholder="เลือก เครื่องจักร / อุปกรณ์"
          options={assets?.map((item)=> ({
                  label:`${item.item_no} | ${item.item_name}`,
                  value:item.id
          }))}
          />
          </ConfigProvider>
      )
  }
    function radioinput(){
        return(
        <div className='flex w-full justify-around '>
        <label className='cursor-pointer flex items-center gap-2 '>
        <input
        className='w-5 h-5 cursor-pointer '
          type="radio"
          value="ซ่อม"
          checked={style === 'ซ่อม'}
          onChange={handleOptionChange}
        />
        ซ่อม
      </label>

      <label className='cursor-pointer flex items-center gap-2'>
        <input
        className='w-5 h-5 cursor-pointer'
          type="radio"
          value="ปรับปรุง"
          checked={style === 'ปรับปรุง'}
          onChange={handleOptionChange}
        />
        ปรับปรุง
      </label>

      <label className='cursor-pointer flex items-center gap-2'>
        <input
        className='w-5 h-5 cursor-pointer'
          type="radio"
          value="สร้าง"
          checked={style === 'สร้าง'}
          onChange={handleOptionChange}
        />
        สร้าง
      </label>

      <label className='cursor-pointer flex items-center gap-2'>
        <input
        className='w-5 h-5 cursor-pointer'
          type="radio"
          value="ติดตั้ง"
          checked={style === 'ติดตั้ง'}
          onChange={handleOptionChange}
        />
        ติดตั้ง
      </label>
            </div>
        )
    }

return (
    <div className="border rounded-md py-4 px-4 dark:border-dark-second mt-4">
      <div className={`grid grid-cols-2 gap-8 items-center max-h-hh text-text dark:text-dark-text-color`}>
        {forminput.map((item, index) => {
          if (item.type === select_doc || item.type === 'all') {
            return (
                <Fragment key={index}>
              <div  className={`flex-col mt-2 flex`}>
                <h1 className={`font-semibold text-lg`}>
                  {item.lable} {item.important && <span className="text-error ml-4">*</span>}
                </h1>
                <span>{item.description}</span>
              </div>
              {item.typeinput === 'input' && inputbox(item.value, item.onchange)}
                {item.typeinput === 'area' && areabox(item.value, item.onchange)}
                {item.typeinput === 'radio' && radioinput()}
                {item.typeinput === 'selectdept' && selectdeptinput()}
                {item.typeinput === 'selectassets' && selectassetinput()}
                </Fragment>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}