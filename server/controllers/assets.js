import { connection } from '../models/Connection.js';
import sql from 'mssql';
import moment from 'moment-timezone';

export const allcate = async (req , res )=>{
    const sqlRequest = new sql.Request(connection)
    const {id} = req.body
    const select_all = await sqlRequest.query(`SELECT 
        C.id,
        C.cate_no,
        C.cate_name,
        C.icon,
        E.firstname,
        PG.per_name,
        D.department
    FROM 
        Categories C

    JOIN 
        Employees E ON C.create_by = E.user_account
    JOIN 
        PermissionGroup PG ON E.permission_id = PG.id
    JOIN 
        Department D ON E.department_id = D.id;`)
    
    // console.log(select_all.recordset)

    const rights = await sqlRequest.query(`SELECT 
        Employees.id,
        Employees.firstname,
        PermissionGroup.per_name,
        Department.department
    FROM 
        Employees
    LEFT JOIN 
        PermissionGroup ON Employees.permission_id = PermissionGroup.id
    LEFT JOIN 
        Department ON Employees.department_id = Department.id
    WHERE 
        Employees.user_account = ${id}`)

    if(rights.recordset[0].per_name === 'superadmin'){
        res.status(200).json(select_all.recordset)
        return
    }

    if(rights.recordset[0].department === 'IT' ){
       const deptit = select_all.recordset.filter(item => item.department === 'IT')
       res.status(200).json(deptit)
       return

    }

    if(rights.recordset[0].department === 'PE' ){
        const deptpe = select_all.recordset.filter(item => item.department === 'PE')
        res.status(200).json(deptpe)
        return

    }
}

export const allassets = async (req , res) =>{
    const sqlRequest = new sql.Request(connection)
    
    const select_all = await sqlRequest.query(`SELECT 
    A.id, A.categories_id, A.item_no, A.type_id, A.item_name, A.quantity, 
    A.receive_date, A.item_detail, A.spec, A.ipaddress, A.mac, 
    A.supplier, A.warranty_day, A.owner_id, A.remark,
    C.cate_name, T.name, E.firstname , E.avatar
    FROM Assets A
    LEFT JOIN Categories C ON A.categories_id = C.id
    LEFT JOIN Types T ON A.type_id = T.id
    LEFT JOIN Employees E ON A.owner_id = E.id `)

    res.status(200).json(select_all.recordset)
}

export const newcategory = async (req, res)=>{
    try{
    const {name , icon , id } = req.body
    console.log(name , icon , id)
    const sqlRequest = new sql.Request(connection);
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    
    const select_check = await sqlRequest.query(`SELECT cate_name FROM Categories WHERE cate_name = '${name}'`)
    
    if(select_check.recordset.length > 0){
        res.status(400).json('Name already exist')
        return
    }

    
    const select_no = await sqlRequest.query(`SELECT TOP 1 cate_no FROM Categories ORDER BY id DESC `)
    
    let cate_num = '';
    
    if(select_no.recordset.length > 0){
        cate_num = select_no.recordset[0].cate_no;
        let cate_no_string  = parseInt(cate_num.substring(4))
        cate_no_string++
        cate_num = `cate${cate_no_string.toString().padStart(3,'0')}`
    }else{
        cate_num ='cate001'
    }
    
    await sqlRequest.query(`INSERT INTO Categories (cate_no , cate_name , create_date , create_by , icon)
    VALUES ('${cate_num}' , '${name}' , '${localTime}' , ${id} , '${icon}')`)
    
    const select_res  = await sqlRequest.query(`SELECT id , cate_no , cate_name , icon FROM Categories WHERE cate_name = '${name}'`)
    res.status(200).json(select_res.recordset)
}catch(err){
    res.json(404).json({ message: err.message })
}
}

export const deletecate = async (req , res)=>{
    console.log(req.body)
    const {iditem} = req.body
    const sqlRequest = new sql.Request(connection);

// ต้องเช็คก่อนว่าใน Asset TABLE มีการใช้ cate นี้รึยัง
    
    await sqlRequest.query(`DELETE FROM Categories WHERE id = ${iditem}`)
    
    res.status(200).json('ok')

}

export const updatecate = async (req , res)=>{
    console.log(req.body)
    const {name , icon , iditem} = req.body;

    const sqlRequest = new sql.Request(connection)

    await sqlRequest.query(`UPDATE Categories SET cate_name = '${name}' , icon = '${icon}' WHERE id = ${iditem} `)

    const select_res = await sqlRequest.query(`SELECT id , cate_no , cate_name , icon FROM Categories WHERE id = ${iditem}`)

    res.status(200).json(select_res.recordset)
}

export const alltypes = async (req , res) =>{
    const sqlRequest = new sql.Request(connection)

    const selecttypes = await sqlRequest.query(`SELECT id , cate_id ,  name FROM Types `)

    res.status(200).json(selecttypes.recordset)
}

export const addtypes = async (req , res) => {
    const {cate_id , name , id} = req.body;
    const sqlRequest = new sql.Request(connection)
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    await sqlRequest.query(`INSERT INTO Types (cate_id , name , create_id , create_date) 
    VALUES (${cate_id} , '${name}' , ${id} , '${localTime}' )`)

    const selectadd = await sqlRequest.query(`SELECT id , cate_id , name FROM Types WHERE name = '${name}'`)

    res.status(200).json(selectadd.recordset)
    
}

export const delettypes = async (req , res) => {
    const {iddel} = req.body
    const sqlRequest = new sql.Request(connection)
    
    await sqlRequest.query(`DELETE FROM Types WHERE id = ${iddel}`)

    res.status(200).json('ok')
}

export const addassets = async (req , res) => {
    const {cate_id , code ,  type , name , quantity , receive , detail , spec , ip , mac , supplier , warrantyday , owner , remark , id} = req.body

    const sqlRequest = new sql.Request(connection)
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');



    await sqlRequest.query(`INSERT INTO Assets (categories_id , item_no ,type_id , item_name , quantity , receive_date , item_detail
        , spec , ipaddress , mac , supplier , warranty_day , owner_id , remark , create_date , create_by) 
        VALUES (${cate_id} , '${code}' , ${type} , '${name}' , ${quantity} , '${receive}' , ${detail.trim() ? `'${detail}'` : "NULL"}  , ${spec ? `'${spec}'` : "NULL"} 
        ,${ip.trim() ? `'${ip}'` : "NULL"} , ${mac.trim() ? `'${mac}'` : "NULL"}  , ${supplier.trim() ? `'${supplier}'` : "NULL"} , ${warrantyday ? `${warrantyday}` : "NULL"} , 
        ${owner ? `${owner}` : "NULL"} , ${remark.trim() ? `'${remark}'` : "NULL"} , '${localTime}' ,${id} )`)
   
    const select_insert = await sqlRequest.query(`SELECT 
    A.id, A.categories_id, A.item_no, A.type_id, A.item_name, A.quantity, 
    A.receive_date, A.item_detail, A.spec, A.ipaddress, A.mac, 
    A.supplier, A.warranty_day, A.owner_id, A.remark, 
    C.cate_name, T.name, E.firstname , E.avatar
    FROM Assets A
    LEFT JOIN Categories C ON A.categories_id = C.id
    LEFT JOIN Types T ON A.type_id = T.id
    LEFT JOIN Employees E ON A.owner_id = E.id
    WHERE A.item_no = '${code}'`)

    res.status(200).json(select_insert.recordset)
}