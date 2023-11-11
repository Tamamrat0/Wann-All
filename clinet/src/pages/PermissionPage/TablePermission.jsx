import {  useState , useEffect } from "react";
import {Table , Spin} from "antd";
export default function TablePermission({tabledatapage ,setPermissioncheck ,permissioncheck , alreadyper}) {
  const [loading , setLoading] = useState(false)
  const [detailpermission , setDetailpermission] = useState(null)



function handleCheckboxChange(record, name, check) {

  if (check) {
    if (permissioncheck) { //เช็คว่ามีค่ารึยัง
      if (permissioncheck.some(item => item.page === record.pagename)) {
        const updatedPermission = permissioncheck.map(item => {
          if (item.page === record.pagename) {
            return {
              ...item,
              detail: [...item.detail, name],
            };
          }
          return item;
        });
        setPermissioncheck(updatedPermission);
      } else {
        // สร้าง OBJECT ใหม่สำหรับไปต่อกับตัวแรก
        const newPermission = [
          ...permissioncheck,
          {
            page: record.pagename,
            page_of: record.page_of,
            detail: [name],
          },
        ];
        setPermissioncheck(newPermission);
      }
    } else {
      // สร้าง OBJECT ใหม่สำหรับยังไม่มีการติ้ก
      const initialPermission = [
        {
          page: record.pagename,
          page_of: record.page_of,
          detail: [name],
        },
      ];
      setPermissioncheck(initialPermission);
    }
  } else {
    if (permissioncheck) {
      const updatedPermission = permissioncheck.map(item => {
        if (item.page === record.pagename) {
          const updatedDetail = item.detail.filter(detail => detail !== name);
          return {
            ...item,
            detail: updatedDetail,
          };
        }
        return item;
      });
      const filteredData = updatedPermission.filter(item => item.detail.length > 0);
      // console.log(filteredData.length === 0)
      setPermissioncheck(filteredData.length === 0 ? null : filteredData);
    }
  }
}



let columns = [
  {
      title: "PageName",
      dataIndex: "pagename",
      width: 80,
      align:'left',
      sorter: (a, b) => a.pagename.localeCompare(b.pagename),
      // render:(text) => <><p className=" text-left">{text}</p></>
    },
    {
        title:'Read',
        width: 50,
        align:'center',
        render:(text , record) => <>
        <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer"
        checked={!permissioncheck  ? false : !!permissioncheck.find((ev)=> ev.page === record.pagename)?.detail.includes('read')}
        onChange={(ev) => handleCheckboxChange(record, 'read', ev.target.checked) }
        disabled={alreadyper}
      />
      </>
    },
    {
        title:'Insert',
        width: 50,
        align:'center',
        render:(text , record) => <>
        <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer"
        checked={!permissioncheck ? false : !!permissioncheck.find((ev)=> ev.page === record.pagename)?.detail.includes('insert')}
        onChange={(ev) => handleCheckboxChange(record, 'insert', ev.target.checked)}
        disabled={alreadyper}
      />
      </>
    },
    {
        title:'Modify',
        width: 50,
        align:'center',
        render:(text , record) => <>
        <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer"
        checked={!permissioncheck ? false : !!permissioncheck.find((ev)=> ev.page === record.pagename)?.detail.includes('modify')}
        onChange={(ev) => handleCheckboxChange(record, 'modify', ev.target.checked)}
        disabled={alreadyper}
      />
      </>
    },
    {
        title:'Delete',
        width: 50,
        align:'center',
        render:(text , record) => <>
        <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer"
        checked={!permissioncheck ? false : !!permissioncheck.find((ev)=> ev.page === record.pagename)?.detail.includes('delete')}
        onChange={(ev) => handleCheckboxChange(record, 'delete', ev.target.checked)}
        disabled={alreadyper}
      />
      
      </>,
      
    },{
      title: "สถานะ",
      dataIndex: "activate",
      width: 50,
      render: (text) => <><div className={`truncate  w-fit px-2 flex items-center h-6  rounded-full shadow duration-500 text-white ${text ? 'bg-green-400':'bg-red-400'}`} >
        {text ? 'เปิดใช้งาน':'ปิดใช้งาน'}</div></>,
        
    },


  ];


  return (
   <>
      {/* <Spin spinning={loading}> */}
      <Table
      className="border rounded-lg  "
      columns={columns}
      dataSource={tabledatapage}
      
      pagination={{
      pageSize: 10,  // กำหนดให้แสดงแถวต่อหน้า 5 แถว
      }}
      scroll={{ x: 860, y: true }} 
      />
        {/* </Spin> */}
    </>
  );
}