import {connection} from '../models/Connection.js';
import sql from 'mssql';
import moment from 'moment-timezone';

export const LoadChat  = async (req , res) =>{
    const sqlRequest = new sql.Request(connection)
    const {id , tik_id , sender}  = req.body
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    let formData = {}
    
    console.log(sender)
    const select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE id = ${tik_id}`)
    const result_tik = select_tik.recordset[0]
    const select_chat = await sqlRequest.query(`SELECT * FROM Messages WHERE tik_id = ${tik_id}`)
    if(select_chat.recordset.length < 1){
        // ไม่มีประวัติแชท
        formData = {id:result_tik.id , tik_no:result_tik.tik_no , doc_type:result_tik.doc_type ,tik_subject:result_tik.tik_subject ,tik_typejob:result_tik.tik_typejob
            ,tik_description:result_tik.tik_description , tik_assets:result_tik.tik_assets}

        await sqlRequest.query(`INSERT INTO Messages (ms_type , tik_id , sender , receiver , text , create_date) 
        VALUES ('detail' , ${tik_id} , ${sender} , '${result_tik.tik_to}', '${JSON.stringify(formData)}' , '${localTime}')`)
        

    }else{
        // มีประวัติ

    }

    const select_res = await sqlRequest.query(`SELECT * FROM Messages WHERE tik_id = ${tik_id}`)
    res.status(200).json(select_res.recordset)
} 

export const Process  = async (req , res) =>{
    const {t_id , id , sender , receiver} = req.body
    const sqlRequest = new sql.Request(connection)
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    console.log(t_id , id , sender , receiver)

    await sqlRequest.query(`UPDATE Tickets SET status = 'inprocess' , recipient_by = ${id} , recipient_date = '${localTime}' WHERE id = ${t_id}`)


    await sqlRequest.query(`INSERT INTO Messages (ms_type , tik_id , sender , receiver , text , create_date) 
    VALUES ('status' , ${t_id} , '${sender}' , ${receiver}, '${`${sender} ได้รับเรื่องของคุณแล้ว`}' , '${localTime}')`)

    const select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE id = ${t_id}`)

    res.status(200).json(select_tik.recordset)
}

export const summary = async (req , res) =>{
    const {t_id , sender , receiver , id} = req.body
    const sqlRequest = new sql.Request(connection)
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    let formDatasum = {}

    const select_tik = await sqlRequest.query(`SELECT * FROM Tickets WHERE id = ${t_id}`)
    const result_tik = select_tik.recordset[0]
    formDatasum = {tik_cause:result_tik.tik_cause , tik_solvedetail:result_tik.tik_solvedetail , tik_parts:result_tik.tik_parts}

    
    await sqlRequest.query(`UPDATE Tickets SET status = 'summary'  WHERE id = ${t_id}`)

    await sqlRequest.query(`INSERT INTO Messages (ms_type , tik_id , sender , receiver , text , create_date) 
    VALUES ('summary' , ${t_id} , '${sender}' , ${receiver}, '${JSON.stringify(formDatasum)}' , '${localTime}')`)

    const select_res = await sqlRequest.query(`SELECT * FROM Messages WHERE tik_id = ${t_id}`)
    res.status(200).json(select_res.recordset)
}