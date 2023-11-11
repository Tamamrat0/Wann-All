import { connection } from '../models/Connection.js';
import sql from 'mssql';
import bcrypt from 'bcrypt';
// const moment = require('moment-timezone');
import moment from 'moment-timezone';
export const getUser = async (req, res) => {
    try {

        const { id } = req.params;
        const requestselect = new sql.Request(connection);
        requestselect.input('id', sql.Int, id)
        const queryselect = `SELECT * FROM USERS WHERE id = @id`
        const user = await requestselect.query(queryselect);
        delete user.recordset[0].password;
        // user.recordset[0].friends = JSON.parse(user.recordset[0].friends);
        res.status(200).json(user.recordset[0]);


    } catch (err) {
        res.json(404).json({ message: err.message })
    }
}



export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const requestselect = new sql.Request(connection);
        //  requestselect.input('id' , sql.Int , id)
        // const queryselect = `SELECT * FROM USERS WHERE id = @id`

        // const user = await requestselect.query(queryselect);
        const user = await requestselect.query(`SELECT * FROM Users WHERE Id = ${id}`);
        delete user.recordset[0].password;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const friendIdsString = JSON.parse(user.recordset[0].friends);
        const friendIdsObject = JSON.parse(friendIdsString);

        const friendPromises = friendIdsObject.map((friendId) => requestselect.query(`SELECT * FROM Users WHERE Id = ${friendId}`));
        const friendResults = await Promise.all(friendPromises);
        const finalResults = friendResults.map((result) => result.recordset[0]);
        const formattedFriends = finalResults.map(
            ({ Id, firstName, lastname, occupation, location, picturePath }) => {
                return { Id, firstName, lastname, occupation, location, picturePath }
            }
        )
        res.status(200).json(formattedFriends)
    } catch (err) {

        res.json(404).json({ message: err.message })
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const sqlRequest = new sql.Request(connection);

        const user = await sqlRequest.query(`SELECT * FROM Users WHERE Id = ${id}`);
        const friend = await sqlRequest.query(`SELECT * FROM USERS WHERE Id = ${friendId}`)

        let userIdString = JSON.parse(user.recordset[0].friends);
        let userIdObject = JSON.parse(userIdString);
        let friendIdString = JSON.parse(friend.recordset[0].friends);
        let friendIdObject = JSON.parse(friendIdString);





        if (userIdObject.includes(parseInt(friendId))) {

            userIdObject = userIdObject.filter((result) => result !== parseInt(friendId));

            friendIdObject = friendIdObject.filter((result) => result !== parseInt(id))
        }
        else {
            userIdObject.push(parseInt(friendId))
            friendIdObject.push(parseInt(id))
        }



        await sqlRequest.query(`UPDATE users 
        SET friends = '${JSON.stringify(JSON.stringify(userIdObject))}'
        WHERE id = ${id}`);

        await sqlRequest.query(`UPDATE users 
        SET friends = '${JSON.stringify(JSON.stringify(friendIdObject))}'
        WHERE id = ${friendId}`);

        const userPromises = userIdObject.map((result) => sqlRequest.query(`SELECT * FROM Users WHERE Id = ${result}`));
        const userResults = await Promise.all(userPromises);
        const finalResults = userResults.map((result) => result.recordset[0]);
        const formattedFriends = finalResults.map(
            ({ Id, firstName, lastname, occupation, location, picturePath }) => {
                return { Id, firstName, lastname, occupation, location, picturePath }
            })
        res.status(200).json(formattedFriends);
    } catch (err) {

        res.json(404).json({ message: err.message })
    }

}

export const auth = async (req, res) => {
    try{
    const {id} = req.body;
     console.log(id)
    const sqlRequest = new sql.Request(connection);
    const selectuser = await sqlRequest.query(`SELECT Employees.* , Department.department , Position.position , PermissionGroup.per_name , PermissionGroup.per_detail 
            FROM Employees
            JOIN Department ON Employees.department_id = Department.id
            JOIN Position ON Employees.position_id = Position.id
            JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id
            WHERE Employees.user_account = ${id}`);
    // const resdata = { ...selectuser.recordset[0]};
    // delete resdata.password ;

    res.status(200).json(selectuser.recordset[0])
    }catch(err){
        res.json(404).json({message: err.message})
    }

}

export const getUserAll = async (req, res) => {
    const sqlRequest = new sql.Request(connection);
    const selectuser = await sqlRequest.query(`SELECT Employees.* , Department.department , 
    Position.position , UserAccount.username , UserAccount.activate_login ,PermissionGroup.per_name
    FROM Employees
    LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id
    LEFT JOIN Department ON Employees.department_id = Department.id
    LEFT JOIN Position ON Employees.position_id = Position.id
    LEFT JOIN UserAccount ON Employees.user_account = UserAccount.id`);
    // console.log(selectuser.recordset)
    res.status(200).json(selectuser.recordset)
}

export const getAccountAll = async (req , res) => {
    
    const sqlRequest = new sql.Request(connection)
    const selectAcc = await sqlRequest.query(`SELECT Employees.id , Employees.user_account , Employees.firstname , Department.department , Position.position , Employees.avatar 
    FROM UserAccount 
    JOIN Employees ON Employees.user_account = UserAccount.id
	JOIN Department ON Employees.department_id = Department.id
	JOIN Position ON Employees.position_id = Position.id`)

    res.status(200).json(selectAcc.recordset)
}

export const addUser = async (req, res) => {
    const { userid, firstname, lastname, email, department, position, permission , configavatar } = req.body;

   
    const sqlRequest = new sql.Request(connection);
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    // เช็คซ้ำ
    // console.log(req.body)
    // console.log(userid,firstname , lastname ,email , department , position , configavatar)

    const checkselect = await sqlRequest.query(`SELECT id FROM Employees WHERE emp_no = '${userid}'`);

    if (checkselect.recordset.length > 0) {
        res.status(400).json('Username or email already exists');
        // console.log('Username or email already exists')
        return;
    }
    // เพิ่มข้อมูล
    await sqlRequest.query(`INSERT INTO Employees (emp_no , firstname , lastname , email , department_id ,position_id , permission_id ,avatar ,create_date , create_byid  ) 
    VALUES ('${userid}' , '${firstname}' , '${lastname}' , '${email ? email : null}' , ${department} , ${position} , ${permission} , '${JSON.stringify(configavatar)}' , '${localTime}' , ${req.body.id})`);

   
    const selectdata = await sqlRequest.query(`SELECT Employees.* , Department.department , Position.position , 
    UserAccount.username, UserAccount.activate_login , PermissionGroup.per_name
        FROM Employees
        LEFT JOIN Department ON Employees.department_id = Department.id
        LEFT JOIN Position ON Employees.position_id = Position.id
        LEFT JOIN UserAccount ON Employees.user_account = UserAccount.id
        LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id`);

    res.status(201).json(selectdata.recordset);
}

export const activateEmployees = async (req, res) => {
    try {
        const { idemploy, value, detail, id } = req.body
        const sqlRequest = new sql.Request(connection);
        const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

        const dataupdate = [];
        let resultdata = null;

        // const selectuser = await sqlRequest.query(`SELECT firstname , update_detail FROM Employees WHERE user_account = ${id}`)
        const selectuser = await sqlRequest.query(`SELECT id ,  update_detail  FROM Employees WHERE id = ${idemploy} `)
        const selecteditor = await sqlRequest.query(`SELECT Employees.firstname , UserAccount.id
        FROM Employees
        JOIN UserAccount ON Employees.user_account = UserAccount.id
        WHERE UserAccount.id = ${id}`)

        if (!selectuser.recordset[0].update_detail) {

            let newdata = {
                date: localTime,
                detail: detail,
                editor: selecteditor.recordset[0].firstname
            }
            resultdata = [...dataupdate, newdata];


        } else {

            let newdata = {
                date: localTime,
                detail: detail,
                editor: selecteditor.recordset[0].firstname
            }
            resultdata = [...JSON.parse(selectuser.recordset[0].update_detail), newdata];


        }
        // console.log(resultdata)


        await sqlRequest.query(`UPDATE Employees
    SET activate = '${value}' , update_detail = '${JSON.stringify(resultdata)}'
    WHERE id = ${idemploy}`)

    const selectemploy = await sqlRequest.query(`SELECT Employees.* , Department.department , Position.position , 
    UserAccount.username, UserAccount.activate_login , PermissionGroup.per_name
        FROM Employees
        LEFT JOIN Department ON Employees.department_id = Department.id
        LEFT JOIN Position ON Employees.position_id = Position.id
        LEFT JOIN UserAccount ON Employees.user_account = UserAccount.id
        LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id`);

 
        res.status(200).json(selectemploy.recordset)
    } catch {
        res.json(404).json({ message: err.message })
    }
}

export const activateLogin = async (req, res) => {
    try {
        const { idlogin, value} = req.body
        const sqlRequest = new sql.Request(connection);

    await sqlRequest.query(`UPDATE UserAccount
    SET activate_login = '${value}' WHERE id = ${idlogin}`)

    const selectemploy = await sqlRequest.query(`SELECT Employees.* , Department.department , Position.position , 
    UserAccount.username, UserAccount.activate_login , PermissionGroup.per_name
        FROM Employees
        LEFT JOIN Department ON Employees.department_id = Department.id
        LEFT JOIN Position ON Employees.position_id = Position.id
        LEFT JOIN UserAccount ON Employees.user_account = UserAccount.id
        LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id`);

        res.status(200).json(selectemploy.recordset)
    } catch {
        res.json(404).json({ message: err.message })
    }
}

export const editEmployees = async (req, res) => {
    try{
    const {userid , idselectuser , firstname , lastname , email , department , position , permission , resultdata ,id} = req.body;
    // console.log(userid , idselectuser , firstname , lastname , email , department , position , permission , resultdata ,id)
    const sqlRequest = new sql.Request(connection);
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const dataupdate = [];
    let resulttext = null;


    

    const selectlastupdate = await sqlRequest.query(`SELECT id ,  update_detail  FROM Employees WHERE id = ${idselectuser} `)
    const selecteditor = await sqlRequest.query(`SELECT Employees.firstname , UserAccount.id
    FROM Employees
    JOIN UserAccount ON Employees.user_account = UserAccount.id
    WHERE UserAccount.id = ${id}`)
   

     if (!selectlastupdate.recordset[0].update_detail) {

        let newdata = {
            date: localTime,
            detail: resultdata,
            editor: selecteditor.recordset[0].firstname
        }

        resulttext = [...dataupdate, newdata];

     }else{

        let newdata = {
            date: localTime,
            detail: resultdata,
            editor: selecteditor.recordset[0].firstname
        }

        resulttext = [...JSON.parse(selectlastupdate.recordset[0].update_detail), newdata];
     }



    await sqlRequest.query(`UPDATE Employees SET emp_no = '${userid}', firstname = '${firstname}' , lastname = '${lastname}' , email = '${email ? email : null}'
    , department_id = ${department} , position_id = ${position} , permission_id = ${permission} , update_detail = '${JSON.stringify(resulttext)}'
    WHERE id = ${idselectuser}`)

    //  const resselect = await sqlRequest.query(`SELECT * FROM Employees  WHERE id = ${idselectuser} `)

     const resselect = await sqlRequest.query(`SELECT Employees.* , Department.department , Position.position , 
     UserAccount.username, UserAccount.activate_login , PermissionGroup.per_name
         FROM Employees
         LEFT JOIN Department ON Employees.department_id = Department.id
         LEFT JOIN Position ON Employees.position_id = Position.id
         LEFT JOIN UserAccount ON Employees.user_account = UserAccount.id
         LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id`);

    //   WHERE Employees.id = ${idselectuser}

     res.status(200).json(resselect.recordset)
     
    }catch{
        res.json(404).json({ message: err.message })
    }
}

export const history_edit = async (req , res) => {
    const {idemploy} = req.body
    const sqlRequest = new sql.Request(connection);
    
    const select_updatedetail = await sqlRequest.query(`SELECT update_detail FROM Employees WHERE id = ${idemploy}`)


    if(!!select_updatedetail.recordset[0].update_detail){
        const sortedData = JSON.parse(select_updatedetail.recordset[0].update_detail).sort((a, b) => new Date(b.date) - new Date(a.date));
        res.status(200).json(sortedData)
        return
    }
    res.status(205).json('')
}

export const resetpassword = async (req,res)=>{
    const {id , idlogin , password} = req.body;
    const sqlRequest = new sql.Request(connection);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password,salt);
    await sqlRequest.query(`UPDATE UserAccount SET password = '${passwordHash}' where id = ${idlogin}`)

    res.status(200).json('ok')
}

export const addaccount = async (req,res) => {
    const {id , idemploy , username , password} = req.body;
    const sqlRequest = new sql.Request(connection);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password,salt);
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    const checkuser = await sqlRequest.query(`SELECT id FROM UserAccount WHERE username = '${username}'`)

    if (checkuser.recordset.length > 0 ){
        res.status(400).json('Username or email already exists');
        return;
    }else{
        await sqlRequest.query(`INSERT INTO UserAccount (username , password , create_date , create_byid)
        VALUES ('${username}' , '${passwordHash}' , '${localTime}' , ${id} ) `)
        
        const iduser_account = await sqlRequest.query(`SELECT id FROM UserAccount WHERE username = '${username}' `)
        
        await sqlRequest.query(`UPDATE Employees SET user_account = ${iduser_account.recordset[0].id} 
        WHERE id = ${idemploy}`)

        const resdata = await sqlRequest.query(`SELECT Employees.* , Department.department , Position.position , 
        UserAccount.username, UserAccount.activate_login , PermissionGroup.per_name
            FROM Employees
            LEFT JOIN Department ON Employees.department_id = Department.id
            LEFT JOIN Position ON Employees.position_id = Position.id
            LEFT JOIN UserAccount ON Employees.user_account = UserAccount.id
            LEFT JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id`);
        

        res.status(200).json(resdata.recordset)
    }
}

