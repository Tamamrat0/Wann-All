import {  useState , useEffect } from "react";
import { Divider, Radio, Table , Spin} from "antd";

// UI LIBRARY
import Avatar from "react-nice-avatar";

// API
import axios from "axios";


export default function TableUser({userselect}) {
  const [loading , setLoading] = useState(false)
  const [resultselect , setResultselect] = useState(null);

console.log(userselect)
  useEffect(()=>{
   axios.post('/permiss/permiss_user' , {userselect} ).then(({data})=>{
      console.log(data)
      setResultselect(data.map((item) => ({
        ...item ,
        key: JSON.stringify(item.id)
      })))
   }).catch((err)=>{

   }) 
  },[])

  console.log(resultselect)
//   useEffect(()=>{
//     setLoading(true)
//     axios.get('/users/usersall').then(({data})=>{

//     setDatausers(data.map(items => ({
//       ...items,
//        key: JSON.stringify(items.id)
//     })))
      
//       setLoading(false)

//     }).catch((err)=>{
     
//       setLoading(false)
    
//     })
//   },[])
const fakedata = [{firstname : 'tammarat' , key:'1'} ]

  const columns = [
    {
      title: "Account",
      dataIndex: "firstname",
      width: 80,
      align:'center',
      render:(text ,record) => <>
      <div className="flex gap-3 items-center">
        <p><Avatar className="w-10 h-10 border-4 border-white  "{...JSON.parse(record?.avatar)}/></p>
        <p>{record?.firstname}</p>
        <p>{record?.lastname}</p>
        <p>{record?.department}</p>
        </div></>
    },

  ]
  return (
   <>
      {/* <Spin spinning={loading}> */}
      <Table
      className="border rounded-lg  "

        // rowSelection={{
        //   type: 'radio',
        //   ...rowSelection,
        //   selectedRowKeys : [selectrow?.key],
        // }}
          columns={columns}
         dataSource={resultselect }
        pagination={{
          pageSize: 5,  // กำหนดให้แสดงแถวต่อหน้า 5 แถว
        }}

    //     onRow={(record , rowIndex) => {
    //         return {
    //             onClick: () => {
    //               setSelectrow(record);
    //             },
    //         };
    //     }
    //   }
      // scroll={{ x: 860, y: true }} 
        />
        {/* </Spin> */}
    </>
  );
}