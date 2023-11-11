import {  useState , useEffect , useContext } from "react";
import { Tooltip ,  Table , Spin , ConfigProvider , theme } from "antd";
import Avatar from "react-nice-avatar";
import {PageContext} from "../../PageContext.jsx";

// ICONS
import {RiListSettingsFill} from 'react-icons/ri'


export default function TableUsers({selectrow , setSelectrow ,datausers  , seteditmodal }) {
const {darkmode} = useContext(PageContext);
const [themes , setThemes] = useState('')



  const columns = [
    {
      title: "Userid",
      dataIndex: "key",
      // width: 80,
      align:'center',
      sorter: (a, b) => a.key -(b.key),
      render:(text) => <><p className=" text-center text-text  dark:text-dark-text-color">{text}</p></>
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      // width: 100,
      align:'center',
      render: (text) => <><div className="flex justify-center"><Avatar className="w-8 h-8  "{...JSON.parse(text)} /></div></>,
    },
    {
      title: "ชื่อหน้า",
      dataIndex: "firstname",
      render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
      
    },
    {
      title: "นามสกุล",
      dataIndex: "lastname",
      render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
    },
    {
      title: "แผนก",
      dataIndex: "department",
      // width: 100,
      sorter: (a, b) => a.department.localeCompare(b.department),
      // sortOrder: sortedInfo.columnKey === 'department' ? sortedInfo.order : null,
      render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "position",
      // width: 200,
      sorter: (a, b) => a.position.localeCompare(b.position),
      render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
    },
    {
      title: "สิทธิการใช้งาน",
      dataIndex: "per_name",
      sorter: (a, b) => a.per_name.localeCompare(b.per_name),
       render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
    },
    {
      title: "Account",
      dataIndex: "username",
      render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
    },
    {
      title: "สถานะ",
      dataIndex: "activate",
      // width: 150,
      render: (text) => <><div className={`truncate  w-fit px-2 flex items-center h-6  rounded-full shadow duration-500 text-white ${text ? 'bg-green-400':'bg-red-400'}`} >
        {text ? 'เปิดใช้งาน':'ปิดใช้งาน'}</div></>,
        sorter: (a, b) => a.activate -(b.activate),
    },
    {
      title: "action",
      // dataIndex: "activate",
      // width: 100,
      render: (text) => <>
      <div className="flex w-full items-center">
      <Tooltip title="ตั้งค่าผู้ใช้">
      <div className="">
      <RiListSettingsFill className="w-6 h-6 text-text  dark:text-dark-text-color cursor-pointer"
      onClick={()=>seteditmodal(true)}/>
        </div>
      </Tooltip>
      </div>
        </>,
    },

    

  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectrow(selectedRows[0])
    },
  };

useEffect(()=>{
  const { darkAlgorithm , defaultAlgorithm} = theme;
  if(darkmode){
    setThemes({algorithm: [darkAlgorithm]})
  }else{
    setThemes({algorithm: [defaultAlgorithm]})
  }
},[darkmode])

 
  return (
   <>
      <Spin spinning={!datausers}>
        <ConfigProvider theme={themes}>
      <Table

        rowSelection={{
          type: 'radio',
          ...rowSelection,
          selectedRowKeys : [selectrow?.key],
        }}
        
          columns={columns}
        dataSource={datausers}
        pagination={{
          position: ['topLeft'],
          pageSize:10,  // กำหนดให้แสดงแถวต่อหน้า 5 แถว
        }}
        // pagination={false}

        onRow={(record , rowIndex) => {
            return {
                onClick: () => {
                  setSelectrow(record);
                },
            };
        }
      }
      scroll={{ x: 860, y: true }} 
        />
        </ConfigProvider>
        </Spin>
    </>
  );
}