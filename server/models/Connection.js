import mysql from "mssql";
import dotenv from "dotenv";
dotenv.config();


const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options: {
      trustServerCertificate: true,
      trustedConnection: true,
      encrypt: true,
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
    }
    }
  };


  export const connection = mysql.connect(config,(err) =>{
  if (err) {
    console.error('Connect error', err);
  }
  else{
     console.log('Connection SQL success');

  }
  });