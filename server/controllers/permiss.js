import { connection } from '../models/Connection.js';
import sql from 'mssql';
import moment from 'moment-timezone';

export const pageall = async (req, res) => {
    const sqlRequest = new sql.Request(connection);
    const selectuser = await sqlRequest.query(`SELECT * FROM PageAll`);
    res.status(200).json(selectuser.recordset)
}

export const getpermission_group = async (req, res) => {
    try{
    const sqlRequest = new sql.Request(connection);

    const selectpermiss = await sqlRequest.query(`SELECT * FROM PermissionGroup`);
    
    const idper = selectpermiss.recordset.map((item)=>item.id).join(', ');

    const selectpermiss_user = await sqlRequest.query(`SELECT Employees.firstname , Employees.id , Employees.permission_id , 
    Employees.avatar , Department.department FROM Employees 
    LEFT JOIN Department ON Employees.department_id = Department.id
    WHERE permission_id IN(${idper})`);
   
    const resdatapage = [{
        pageall:selectpermiss.recordset,
        pageuser:selectpermiss_user.recordset
    }]
        res.status(200).json(resdatapage)
    }catch(err){
        res.json(404).json({ message: err.message })
    }
}

export const addpermission_group = async (req , res) => {
    try{
    const {pernamegroup , userselect  , permissioncheck , editdetail, id} = req.body
    const sqlRequest = new sql.Request(connection);
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    const select_check = await sqlRequest.query(`SELECT per_name FROM PermissionGroup WHERE per_name = '${pernamegroup}'`)
    if(select_check.recordset.length > 0){
        res.status(400).json('Namegroup already exist')
        return
    }else{
        const per_no = await sqlRequest.query(`SELECT TOP 1 per_no FROM PermissionGroup ORDER BY id DESC`)
        let latestPerNo = '';
        if(per_no.recordset.length > 0){
            latestPerNo = per_no.recordset[0].per_no;
            let perNoNumber = parseInt(latestPerNo.substring(3)); 
            perNoNumber++; 
            latestPerNo = `per${perNoNumber.toString().padStart(3, '0')}`;
        }else{
            latestPerNo ='per001'
        }
            await sqlRequest.query(`INSERT INTO PermissionGroup (per_no , per_name , per_detail  , create_date , create_byid) 
            VALUES ('${latestPerNo}' , '${pernamegroup}' , '${JSON.stringify(permissioncheck)}' , '${localTime}' , ${id})`)

            
                const select_per_check = userselect.map((item) =>  sqlRequest.query(`SELECT Employees.id , Employees.firstname , Employees.update_detail ,PermissionGroup.per_name FROM Employees 
                LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id
                WHERE Employees.id = ${item}`))
                const select_resultall = await Promise.all(select_per_check)
                const select_finalresults = select_resultall.map((item)=>item.recordset[0])
                const check_per_null = select_finalresults.filter((item)=>item.per_name !== null)
                // console.log(check_per_null)

                if(check_per_null.length > 0){ //เช็คว่าผู้ใช้มีสิทธิแล้วรึยัง
                    res.status(409).json(check_per_null)
                    return
                }

                //  const select_per_name = await sqlRequest.query(`SELECT id FROM PermissionGroup WHERE  per_name = '${pernamegroup}'`)
                //  const selecteditor = await sqlRequest.query(`SELECT Employees.firstname , UserAccount.id
                //  FROM Employees
                //  JOIN UserAccount ON Employees.user_account = UserAccount.id
                //  WHERE UserAccount.id = ${id}`)

                //  let resulttext = null
                //  const dataupdate = [];
                //  select_finalresults.map((item)=> {
                //     if(!item.update_detail){
                //         let newdata ={
                //             date: localTime,
                //             detail: editdetail,
                //             editor: selecteditor.recordset[0].firstname
                //         }

                //         resulttext = [...dataupdate, newdata];
                //     }else{
                //         let newdata ={
                //             date: localTime,
                //             detail: editdetail,
                //             editor: selecteditor.recordset[0].firstname
                //         }

                //         resulttext = [...JSON.parse(item.update_detail), newdata];
                //     }
                //     sqlRequest.query(`UPDATE Employees SET update_detail = '${JSON.stringify(resulttext)}'  WHERE id = ${item.id}`)
                //  })

                 

                // userselect.map((item)=>  sqlRequest.query(`UPDATE Employees SET permission_id = ${select_per_name.recordset[0].id} WHERE id = ${item}`))

               
                // const selectpermiss = await sqlRequest.query(`SELECT * FROM PermissionGroup`);
    
                // const idper = selectpermiss.recordset.map((item)=>item.id).join(', ');
            
                // const selectpermiss_user = await sqlRequest.query(`SELECT Employees.firstname , Employees.id , Employees.permission_id , 
                // Employees.avatar , Department.department FROM Employees 
                // LEFT JOIN Department ON Employees.department_id = Department.id
                // WHERE permission_id IN(${idper})`);
            
                // const resdatapage = [{
                //     pageall:selectpermiss.recordset,
                //     pageuser:selectpermiss_user.recordset
                // }]
                // res.status(200).json(resdatapage)

            
    }
}catch(err){
    res.json(404).json({ message: err.message })
}

}

export const addpermission_confirm =  async (req , res) =>{
    try{
    const {checkarray , pernamegroup, editdetail , id} = req.body;
    const sqlRequest = new sql.Request(connection);
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    console.log(checkarray)
    const stringArray = checkarray.join();
    // console.log(stringArray)

    if(checkarray.length > 0  ) {
      
    console.log(1)
    const select_per_id = await sqlRequest.query(`SELECT id FROM PermissionGroup WHERE per_name = '${pernamegroup}'`)
    await sqlRequest.query(`UPDATE Employees set permission_id = ${select_per_id.recordset[0].id} WHERE id IN(${stringArray})`)

    const select_user_update = await sqlRequest.query(`SELECT Employees.firstname , Employees.id , Employees.permission_id , Employees.update_detail ,PermissionGroup.per_name
    FROM Employees 
    LEFT JOIN PermissionGroup 
    ON Employees.permission_id = PermissionGroup.id
    WHERE Employees.id IN(${stringArray})`)


    const selecteditor = await sqlRequest.query(`SELECT Employees.firstname , UserAccount.id
    FROM Employees
    JOIN UserAccount ON Employees.user_account = UserAccount.id
    WHERE UserAccount.id = ${id}`)

    
    let resulttext = null
    const dataupdate = [];
    select_user_update.recordset.map((item)=> {
       if(!item.update_detail){
           let newdata ={
               date: localTime,
               detail: editdetail,
               editor: selecteditor.recordset[0].firstname
           }

           resulttext = [...dataupdate, newdata];
       }else{
           let newdata ={
               date: localTime,
               detail: editdetail,
               editor: selecteditor.recordset[0].firstname
           }

           resulttext = [...JSON.parse(item.update_detail), newdata];
       }
       sqlRequest.query(`UPDATE Employees SET update_detail = '${JSON.stringify(resulttext)}'  WHERE id = ${item.id}`)
    })

    const selectpermiss = await sqlRequest.query(`SELECT * FROM PermissionGroup`);

    const resdatapage = [{
        pageall:selectpermiss.recordset,
        pageuser:select_user_update.recordset
    }]
        res.status(200).json(resdatapage)
    }else{

        const selectpermiss = await sqlRequest.query(`SELECT * FROM PermissionGroup`);

        const resdatapage = [{
            pageall:selectpermiss.recordset,
            pageuser:[{}]
        }]
            res.status(200).json(resdatapage)

    }


}catch(err){
    res.json(404).json({ message: err.message })
}
} 

export const deletepermission = async (req , res) => {
    try{
    const {groupid , id} = req.body;
    // console.log(groupid)
    // console.log(typeof groupid)
    const sqlRequest = new sql.Request(connection);

    const select_user = await sqlRequest.query(`SELECT id , permission_id FROM Employees WHERE permission_id = ${groupid}`)
    const id_select_user = select_user.recordset.map((item) => item.id)
    console.log(id_select_user)
    if(select_user.recordset.length > 0){
        const default_permission = await sqlRequest.query(`SELECT id FROM PermissionGroup WHERE per_name = 'user'`)
        // console.log(default_permission.recordset[0].id)
        const id_users = select_user.recordset.map((item)=>item.id).join(',');
        await sqlRequest.query(`UPDATE Employees SET permission_id = ${default_permission.recordset[0].id} WHERE id in (${id_users})`)
    
    }
    const check_per_user = await sqlRequest.query(`SELECT per_name FROM PermissionGroup WHERE id = ${groupid}`)

    if(check_per_user.recordset[0].per_name === 'user'){
        res.status(403).json('Access Deied')
        return;
    } 




    await sqlRequest.query(`DELETE FROM PermissionGroup WHERE id = ${groupid}`)
    
    const selectpermiss = await sqlRequest.query(`SELECT * FROM PermissionGroup`);
    
    if(select_user.recordset.length > 0) {
        const iduser = id_select_user.map((item)=>item).join(',');
        console.log(iduser)
    
    
        const selectpermiss_user = await sqlRequest.query(`SELECT Employees.firstname , Employees.id , Employees.permission_id ,PermissionGroup.per_name
        FROM Employees 
        LEFT JOIN PermissionGroup 
        ON Employees.permission_id = PermissionGroup.id 
        WHERE Employees.id IN(${iduser})`);

        const resdatapage = [{
            pageall:selectpermiss.recordset,
            pageuser:selectpermiss_user.recordset
        }]
            res.status(200).json(resdatapage)
    }else{

    const resdatapage = [{
        pageall:selectpermiss.recordset,
        pageuser:[{}]

    }]
    res.status(200).json(resdatapage)
    }
    }catch(err){
        res.json(404).json({ message: err.message })
    }
}

export const updatepermiss = async (req, res) => {
    try{
    const {id , idper , permissuserfix , perdetailfix , pernamegroupfix} = req.body;
    // console.log(id , idper , permissuserfix , perdetailfix , pernamegroupfix)
    const sqlRequest = new sql.Request(connection);


    // NAME AND DETAIL ZONE -------------------------------------------------
    const selectolddata = await sqlRequest.query(`SELECT * FROM PermissionGroup WHERE id = ${idper}`)

    if(selectolddata.recordset[0].per_name !== pernamegroupfix){
        const select_check = await sqlRequest.query(`SELECT id FROM PermissionGroup WHERE per_name = '${pernamegroupfix}'`)
        if(select_check.recordset.length > 0){
            res.status(400).json('permission is already exists');
            return;
        }
        await sqlRequest.query(`UPDATE PermissionGroup SET per_name = '${pernamegroupfix}' WHERE id = ${idper}`)
    }


    if(selectolddata.recordset[0].per_detail !== JSON.stringify(perdetailfix)){
        await sqlRequest.query(`UPDATE PermissionGroup SET per_detail = '${JSON.stringify(perdetailfix)}' WHERE id = ${idper}`)
    }



     // USERS ZONE -------------------------------------------------
    const selectuser =  await sqlRequest.query(`SELECT id , permission_id FROM Employees WHERE permission_id  = ${idper}`)

    
    // หาผลต่างของข้อมูล
    if(permissuserfix.length > selectuser.recordset.map((item)=>item.id).length){
        // เพิ่มผู้ใช้
        const difference = permissuserfix.filter((x)=> !selectuser.recordset.map((item)=>item.id).includes(x))

    
        const iduser = difference.join(',');
        
        const select_per_check = await sqlRequest.query(`SELECT Employees.id , Employees.firstname , Employees.update_detail ,PermissionGroup.per_name FROM Employees 
        LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id
        WHERE Employees.id in (${iduser})`)

        const check_per_null = select_per_check.recordset.filter((item)=>item.per_name !== null)
        if(check_per_null.length > 0){ //เช็คว่าผู้ใช้มีสิทธิแล้วรึยัง
            res.status(409).json(check_per_null)
            return
        }

    }else{

        if(permissuserfix.length === selectuser.recordset.map((item)=>item.id).length){

            if(JSON.stringify(permissuserfix) !== JSON.stringify(selectuser.recordset.map((item)=>item.id))){
                
                const differenceid = permissuserfix.filter((element) => !selectuser.recordset.map((item)=> item.id).includes(element));
    
                await sqlRequest.query(`UPDATE Employees SET permission_id = ${idper} WHERE id = ${differenceid}`)
            }
            
        }else{
              // ลดผู้ใช้
            const defaultper = await sqlRequest.query(`SELECT id FROM PermissionGroup WHERE per_name = 'user'`)
            const difference = selectuser.recordset.map((item) => item.id).filter((x)=> !permissuserfix.includes(x))

    
            if(difference.length > 0) {
                difference.map((ids) => sqlRequest.query(`UPDATE Employees SET permission_id = ${defaultper.recordset[0].id} WHERE id = ${ids}` ))
   
            }
        }

      
        

    }

    const selectpermiss = await sqlRequest.query(`SELECT * FROM PermissionGroup`);
    
    const idpers = permissuserfix.join(',');


    const selectpermiss_user = await sqlRequest.query(`SELECT Employees.firstname , Employees.id , Employees.permission_id ,PermissionGroup.per_name
    FROM Employees 
   LEFT JOIN PermissionGroup 
   ON Employees.permission_id = PermissionGroup.id
   WHERE Employees.id IN(${idpers})`);
   
    const resdatapage = [{
        pageall:selectpermiss.recordset,
        pageuser:selectpermiss_user.recordset
    }]
    res.status(200).json(resdatapage)


    }catch(err){
        res.json(404).json({ message: err.message })
    }
}