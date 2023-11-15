import {connection} from '../models/Connection.js';
import sql from 'mssql';
import moment from 'moment-timezone';


export const newTicket = async (req , res) =>{
    // try{
        function getNextRunningNumber(lastRun) {
            let prefix = dept;
            let currentYear = moment().format('YY');
            let currentMonth = moment().format('MM');
            
            if (lastRun) {
                let lastRunArr = lastRun.split('-');
                let lastRunMonth = lastRunArr[0].slice(4, 6); // รับเดือนจากเลขรันล่าสุด
                let lastRunNum = parseInt(lastRunArr[1]); // รับเลขรันจากเลขรันล่าสุด
        
                // ตรวจสอบว่าเป็นเดือนเดียวกันกับเดือนล่าสุดหรือไม่
                if (currentMonth === lastRunMonth) {
                    let nextRunNum = String(lastRunNum + 1).padStart(4, '0');
                    return `${prefix}${currentYear}${currentMonth}-${nextRunNum}`;
                }
            }
        
    
            return `${prefix}${currentYear}${currentMonth}-0001`;
        }
    const {subject , description , dept , codedevice , style , id , select_doc} = req.body;
    const sqlRequest = new sql.Request(connection)
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');


    const Num = await sqlRequest.query(`SELECT TOP 1 tik_no FROM Tickets WHERE tik_to = '${dept}' ORDER BY id DESC`)

    let runnumber = null
    if(Num.recordset.length >0) {
        runnumber = getNextRunningNumber(Num.recordset[0].tik_no)
    }else{
        runnumber = getNextRunningNumber()
    }
    console.log(runnumber)

    await sqlRequest.query(`INSERT INTO Tickets (tik_no , doc_type , tik_subject , tik_typejob , tik_description , tik_to , status , tik_assets , create_by , create_date) 
    VALUES ('${runnumber}' , '${select_doc}' , '${subject}' , '${style}' , '${description}' , '${dept}' , 'open' , ${codedevice ? `'${codedevice}'` : "NULL"} , ${id} , '${localTime}')`)

    const select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE tik_no = '${runnumber}' `)
    // console.log(select_tik.recordset)

    res.status(200).json(select_tik.recordset)
    
// }catch(err){
//     res.json(404).json({ message: err.message })
// }

}

export const getTicket = async (req , res) => {
    try{
        const {id} = req.body
        const sqlRequest = new sql.Request(connection)

        const select_user = await sqlRequest.query(`SELECT Employees.id , Department.department  
        FROM UserAccount 
        JOIN Employees ON Employees.user_account = UserAccount.id
        JOIN Department ON Employees.department_id = Department.id
        WHERE Employees.user_account = ${id}`)

        let select_tik = null
        if(select_user.recordset[0].department === 'IT' || select_user.recordset[0].department === 'PE' ){
            select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE tik_to = '${select_user.recordset[0].department}' ORDER BY id DESC`)
        }else{
            select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE create_by = ${id} ORDER BY id DESC`)
        }

        res.status(200).json(select_tik.recordset)


        // const selectall_tik = await sqlRequest.query(`SELECT * FROM Tickets`)
        
        
    }catch(err){
        res.json(404).json({ message: err.message })
    }
}

export const getAllAssets = async (req , res) =>{
    // try{
    const {dept} = req.body
    const sqlRequest = new sql.Request(connection)

    const select_id = await sqlRequest.query(`SELECT 
    C.id,
    C.cate_no,
    C.cate_name,
    D.department
FROM 
    Categories C

JOIN 
    Employees E ON C.create_by = E.user_account
JOIN 
    Department D ON E.department_id = D.id
    WHERE department = '${dept}'`)

   if(select_id.recordset.length > 0 ){

    const ids = select_id.recordset.map(item=>item.id).join(',')

    const select_assets = await sqlRequest.query(`SELECT id , item_no , item_name FROM Assets WHERE categories_id IN(${ids}) `)

    res.status(200).json(select_assets.recordset)
   }
// }catch(err){
//     res.json(404).json({ message: err.message })
// }
}

export const already_read = async (req , res) =>{
    const {idticket , id} = req.body
    const idArray = [id]

    const sqlRequest = new sql.Request(connection)

    const select_userread = await sqlRequest.query(`SELECT already_read FROM Tickets WHERE id = ${idticket}`)
    if(select_userread.recordset[0].already_read){
        const check_user = JSON.parse(select_userread.recordset[0].already_read)
        if(!check_user.includes(id)){
            check_user.push(id)
            await sqlRequest.query(`UPDATE Tickets SET already_read = '${JSON.stringify(check_user)}' WHERE id = ${idticket}`)
        }
    }else{
        await sqlRequest.query(`UPDATE Tickets SET already_read = '${JSON.stringify(idArray)}' WHERE id = ${idticket}`)

    }

    const select_res = await sqlRequest.query(`SELECT * FROM Tickets WHERE id = ${idticket}`)
    res.status(200).json(select_res.recordset)
}

export const approved = async (req , res) =>{
    const {selectapp , t_id , appdetail , id , sender , receiver } = req.body
    // console.log(req.body)
    let ap = null
    const sqlRequest = new sql.Request(connection)
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    if(selectapp === 'yes'){
        ap = true
    }else{
        ap = false
    }
    console.log(ap)

    if(ap){
        await sqlRequest.query(`UPDATE Tickets SET tik_approved = '${ap}' , approved_by = ${id} , approved_date = '${localTime}' WHERE id = ${t_id}`)

        await sqlRequest.query(`INSERT INTO Messages (ms_type , tik_id , sender , receiver , text , create_date) 
        VALUES ('status' , ${t_id} , '${sender}' , ${receiver}, '${`เรื่องของคุณได้รับการอนุมัติให้แก้ไขแล้ว`}' , '${localTime}')`)
    }else{
        await sqlRequest.query(`UPDATE Tickets SET status = 'close' ,  tik_approved = '${ap}' , approved_by = ${id} , approved_date = '${localTime}' ,  closing_by = ${id} , closing_date = '${localTime}' WHERE id = ${t_id}`)

        await sqlRequest.query(`INSERT INTO Messages (ms_type , tik_id , sender , receiver , text , create_date) 
        VALUES ('status' , ${t_id} , '${sender}' , ${receiver}, '${`เรื่องของคุณไม่ผ่านการอนุมัติให้แก้ไข เนื่องจาก ${appdetail}`}' , '${localTime}')`)


    }

    const select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE id = ${t_id}`)
    

    res.status(200).json(select_tik.recordset)
    
}

export const summary = async (req , res) =>{
    const {t_id , cause , parts , solvedetail , id} = req.body
    const sqlRequest = new sql.Request(connection)
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    await sqlRequest.query(`UPDATE Tickets SET tik_cause = '${cause}' ,  tik_solvedetail = ${solvedetail.trim() ? `'${solvedetail}'` : "NULL"} , tik_parts = ${parts.trim() ? `'${parts}'` : "NULL"} 
    WHERE id = ${t_id}`)

    const select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE id = ${t_id}`)

    res.status(200).json(select_tik.recordset)
}