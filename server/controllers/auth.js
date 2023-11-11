import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sql from 'mssql';
import env from 'dotenv';
import moment from 'moment-timezone';
import {connection} from '../models/Connection.js';
env.config()
export const register = async(req , res ) =>{
    //   try {
        const {username , firstname , lastname , password , department , position , configavatar} = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);
        const Requestsql = new sql.Request(connection);

        const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        // CHECK double
        const selectcheck = await Requestsql.query(`SELECT username FROM UserAccount WHERE username = '${username}'`)
        
        if (selectcheck.recordset.length > 0){
            res.status(400).json('Username or email already exists');
            return;
        }else{
            const account_no = await Requestsql.query(`SELECT TOP 1 account_no FROM UserAccount ORDER BY id DESC`)
            let latestAcc_no = '';
            if(account_no.recordset.length > 0) {
                latestAcc_no = account_no.recordset[0].account_no;
                let accNo = parseInt(latestAcc_no.substring(3));
                accNo++;
                latestAcc_no = `acc${accNo.toString().padStart(3,'0')}`;
            }else{
                latestAcc_no = 'acc001'
            }

            await Requestsql.query(`INSERT INTO UserAccount (account_no , username  , password , lastlogin ,  create_date  ) 
            VALUES ('${latestAcc_no}' , '${username}',  '${passwordHash}', '${localTime}' , '${localTime}' )`);
            

            const SelectID = await Requestsql.query(`SELECT id  FROM UserAccount WHERE username = '${username}' `)
            const SelectPer = await Requestsql.query(`SELECT id FROM permissionGroup WHERE per_name = 'user'`)
            
            await Requestsql.query(`INSERT INTO Employees (user_account , firstname , lastname  , department_id , position_id , permission_id , avatar , create_date , create_byid) 
            VALUES (${SelectID.recordset[0].id}, '${firstname}', '${lastname}',  ${department}, ${position},  ${SelectPer.recordset[0].id}, '${JSON.stringify(configavatar)}' , '${localTime}' , ${SelectID.recordset[0].id} )`);


            
            const selectres = await Requestsql.query(`SELECT Employees.* , Department.department , Position.position , PermissionGroup.per_name , PermissionGroup.per_detail 
            FROM Employees
            JOIN Department ON Employees.department_id = Department.id
            JOIN Position ON Employees.position_id = Position.id
            JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id
            WHERE user_account = '${SelectID.recordset[0].id}'`)


            const token =  jwt.sign({id:selectres.recordset[0].id}, process.env.SECRET,{ expiresIn: '4h' })
            res.cookie('token',token).status(201).json(selectres.recordset[0])
        }   
    //   }catch(err){

    //      res.status(500).json({error: err.massage})
    //  }
}


export const login = async (req,res) => {
     try{
        const {username , password} = req.body;
        const Requestsql = new sql.Request(connection);
        // const selectlogin = await Requestsql.query(`SELECT * FROM UserAccount WHERE username = '${username}'`)

        const selectlogin = await Requestsql.query(`SELECT UserAccount.* , Employees.firstname FROM UserAccount
        JOIN Employees ON Employees.user_account = UserAccount.id
        WHERE UserAccount.username = '${username}'`);



        const localTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');


        if (selectlogin.recordset.length > 0){
            const passwordcompare = await bcrypt.compare(password , selectlogin.recordset[0].password);
    
            if(passwordcompare){
                
                if(!selectlogin.recordset[0].activate_login) {
                    res.status(401).json('')
                    return
                }
                const selectemploy = await Requestsql.query(`SELECT Employees.* , Department.department , Position.position , PermissionGroup.per_name , PermissionGroup.per_detail 
                FROM Employees
                JOIN Department ON Employees.department_id = Department.id
                JOIN Position ON Employees.position_id = Position.id
                JOIN PermissionGroup ON Employees.permission_id = PermissionGroup.id
                WHERE user_account = '${selectlogin.recordset[0].id}'`)

                if (selectemploy.recordset.length < 0){
                    res.status(500).json('Not Found Users')
                    return;
                }

                
                const token =  jwt.sign({id:selectlogin.recordset[0].id}, process.env.SECRET,{ expiresIn: '4h' })
                    
                
                await Requestsql.query(`UPDATE UserAccount SET lastlogin = '${localTime}' WHERE id = ${selectlogin.recordset[0].id}`)
                res.cookie('token',token).status(200).json(selectemploy.recordset[0]);

            }else{
                res.status(400).json("Password is incorrect")
            }
    
        }else{
            res.status(404).json('Not Found Users')
            return;
        }
     }catch(err){
         res.status(500).json({error: err.massage})
     }

}

export const department = async (req,res) => {
   const sqlRequest = new sql.Request(connection);
   const department = await sqlRequest.query(`SELECT * FROM Department`);
   const position = await sqlRequest.query(`SELECT * FROM Position`);

   res.status(200).json({department: department.recordset , position : position.recordset});
}


export const logout = async (req,res) =>{
    const {token} = req.cookies;
    return res.clearCookie('token').status(403).send('Access Deied')
}