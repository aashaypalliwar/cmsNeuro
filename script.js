//This file was written only to autenticate users using fake emails bulkly

const express = require("express");
const app = require('./app');
const bcrypt = require('bcryptjs');
const db = require('./model/dbModel/database');
const authController = require('./controller/authController');

exports.fakeSignup  = async(req,res,next) =>{
    try {
        const name = "binod Super";
    const role = "admin";
    const password = "12345";
    let email;

    for (let i = 14; i < 18 ;i++) {
        email = `${i+1}@iitbbs.ac.in`;
        const hashedPassword = await bcrypt.hash(password, 12);
        const timeStamp = Date.now();

        const queryParams = [name,email,role,timeStamp,hashedPassword,"core"];

        await db.query(
            `INSERT INTO users (name, email, role,timestamp, password,designation) VALUES (?, ?, ?,?,?,?)`,
            queryParams
          );
          console.log(i+1);
        
    }
    console.log("Hello World");
    } catch (error) {
       console.log(error); 
    }
} 