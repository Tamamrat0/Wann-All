import {  useState  , useContext , useEffect } from "react";
import { Tooltip ,  Table , Spin , ConfigProvider , theme } from "antd";
import moment from 'moment';
import Avatar from "react-nice-avatar";
import {PageContext} from "../../PageContext.jsx";

// ICONS
import {RiListSettingsFill} from 'react-icons/ri'
import {CgMenuGridO} from 'react-icons/cg'
import {RiShoppingBasket2Line} from 'react-icons/ri'


export default function TableAssets({themes , assetsall  , user , data_filter}) {
const currentDate = moment();


  const columns = [
    {
      title: "รหัส",
      dataIndex: "item_no",
      align:'center',
      fixed: 'left',
      render:(text) => <><p className=" text-center text-text  dark:text-dark-text-color">{text}</p></>
    },
    {
      title: "ชนิด",
      dataIndex: "cate_name",
      align:'center',
      sorter: (a, b) => a.cate_name.localeCompare(b.cate_name),
      render: (text) => <div className={``}>{text}</div>
    },
    {
      title: "ประเภท",
      dataIndex: "name",
      align:'center',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <div className={`w-max`}>{text}</div>
    },
    {
        title: "ชื่ออุปกรณ์",
        dataIndex: "item_name",
        render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
        
    },
    {
      title: "วันที่รับเข้า",
      dataIndex: "receive_date",
      render: (text) => <div className="text-text  dark:text-dark-text-color">{moment(text).format('DD-MM-YYYY')}</div>,
    },
    {
      title: "รายละเอียด",
      dataIndex: "item_detail",
      render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      render: (text) => <div className="text-text  dark:text-dark-text-color">{text}</div>,
    },
    {
      title: "วันที่หมดประกัน",
      dataIndex: "warranty_status",
      // width: 130,
      render: (text) => {
        let status = 0
        const warrantyDate = moment(text, "DD/MM/YYYY");
        const monthsDeiff = warrantyDate.diff(currentDate, 'months');
   
        if (monthsDeiff >= 5){
          status = 3
        }else if(monthsDeiff >=1 && monthsDeiff <=3){
          status = 2
        }else if(monthsDeiff <= 0){
          status = 1
        }

        return (
          <div className={`${status === 1 && 'bg-red-400'} ${status === 2 && 'bg-warning'}  ${status === 3 && 'bg-green-400'} truncate flex justify-center px-2 h-6 items-center rounded-md text-white`}>{text}</div>
        )
      },
    },
    // {
    //   title: "จำนวนคงเหลือ",
    //   // width:120,
    //   dataIndex: "quantity",
    // },
    {
      title: "ผู้ใช้งาน",
      dataIndex: "firstname",
      render: (text , record , index) => <div className="flex items-center gap-2">{record.avatar && <Avatar className="w-6 h-6  "{...JSON.parse(record.avatar)} /> }{record.firstname}</div>

    },
    {
      title: "หมายเหตุ",
      dataIndex: "remark",

    },
    {
      title: "action",
      fixed: 'right',
      align: 'center',
      render: (text) => <>
      <div className="flex w-full items-center justify-center gap-2">
      <Tooltip title="แก้ไข">
      <div className="">
      <CgMenuGridO className="w-6 h-6 text-text  dark:text-dark-text-color cursor-pointer"/>
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


  const subColumns = [
        {
      title: "สเปค",
      dataIndex: "spec",
      width:"max",
      render: (text) => {
        if(text !== null){
          const specs = JSON.parse(text)[0];
          return (
            <div className="flex justify-center flex-col">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="gap-2">
                          <span className="font-semibold">{key}   </span>: {value}
                      </div>
                  ))}
              </div>
          );
        }
        },
  },
    { title: "Mac", dataIndex: "mac" },
    { title: "IP",dataIndex: "ipaddress",},
  ];

  return (
   <>
      <Spin spinning={!assetsall}>
        <ConfigProvider theme={themes}>

      <Table
        
        columns={columns}
        // dataSource={assetsall}
        dataSource={data_filter.length >0 ? data_filter : assetsall}

        expandable={{
          expandedRowRender: record => (
          
            <Table 
            bordered={true}
            dataSource={[{
              key: record.key, 
              spec: record.spec , 
              ipaddress: record.ipaddress , 
              mac: record.mac
            }]} // ข้อมูลย่อยของคุณ
            columns={subColumns}
            pagination={false}
            size="small"
        />
          ),
         
        }}
        
        pagination={{
          position: ['bottomRight'],
          pageSize: 10,  // กำหนดให้แสดงแถวต่อหน้า 5 แถว
        }}

    scroll={{
      x: 1500,

    }}
  
        />

        </ConfigProvider>
        </Spin>
    </>
  );
}