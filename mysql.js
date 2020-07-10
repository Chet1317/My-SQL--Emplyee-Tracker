require('dotenv').config()

const mysql = require("mysql");
const inquirer = require("inquirer");
const { async } = require('rxjs/internal/scheduler/async');

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
const db = new Database({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    insecureAuth: true
});

let answers
let roles, department

async function mainApp() {

    answers = await inquirer.prompt([{
        name: "managementOptions", message: "What would you like to manage/view?", type: "list",
        choices: ["View Departments", "View Roles", "View Employees","add", "View All"]
    }])

    if( answers.managementOptions=="View Employees"){
        let employerList1 = await db.query( "SELECT * FROM employee")
        console.table(employerList1)
    }else if(answers.managementOptions=="View Roles"){
        let employerList1 = await db.query("SELECT * FROM role")
        console.table(employerList1)
    }else if(answers.managementOptions=="View Departments"){
        let employerList1 = await db.query("SELECT * FROM department")
        console.table(employerList1)
    }else if(answers.managementOptions=="View All"){
        let employerList1 = await db.query(
            "SELECT CONCAT(e.first_name,' ',e.last_name) AS employeeName,"+
            "CONCAT(m.first_name,' ',m.last_name) AS managerName,r.title,r.salary "+
            "FROM employee AS e "+
            "LEFT JOIN employee AS m ON(e.manager_id=m.id)"+
            "LEFT JOIN role AS r ON(e.role_id=r.id)")
        console.table(employerList1)
    }else if (answers.managementOptions == "add"){
        const dbRole = await db.query( "SELECT * FROM role")
            roles = []
            dbRole.forEach( function( item ){
                roles.push( { name: item.title, value: item.id } )
            })
            if (answers.managementOptions == "add"){
                const dbRole = await db.query( "SELECT * FROM department")
                    department = []
                    dbRole.forEach( function( item ){
                        department.push( { name: item.name, value: item.id } )
                    })
    }else{
        return mainApp()
    }
        
        console.log(answers)
        if (answers.managementOptions == "add") {
            answers = await inquirer.prompt([
                {
                    name: "employeeName",
                    message: "What is there first name?",
                    type: "input"
                },
                {
                    name: "employeeLastName",
                    message: "What is their last name",
                    type: "input"
                },
                {
                    name: "employeeRole",
                    message: "What is their role?",
                    type: "list",
                    choices:roles
                },
                {
                    name: "employeeDepartment",
                    message: "What is their department?",
                    type: "list",
                    choices:department
                }
            ])
            let employerList = await db.query("INSERT INTO employee VALUES (?, ?, ?, ?, ?)", [0, answers.employeeName, answers.employeeLastName, answers.employeeRole, answers.employeeDepartment, 1])
            console.table(employerList)
        }              
        }
    //     if (answers.managementOptions == "update"){
    //         answers.roleId = await inquirer.prompt([
    //             {
    //                 name: "whichEmployee",
    //                 message: "What is the name of the employee who's role you would like to update?",
    //                 type: "input"
    //             }])
    //             if(answers.roleId.whichEmployee ==""){
    //                let rolee = await db.query("SELECT * FROM employee")
    //                console.table()
    //                 }
    //         answers.role = await inquirer.prompt([
    //         {
    //             name: "whichEmployeeRole",
    //             message: "What role would you like to give them?",
    //             type: "list",
    //             choices:[
    //                 "Web Development", "Accountant", "Sales Rep", "Cleaner"
    //             ]
    //         }])
    //         if(answers.role.whichEmployeeRole== "Web Development", "Accountant", "Sales Rep", "Cleaner"){
    //            const employeeRoles= await db.query("UPDATE employee SET role_id=? WHERE id=?)", [answers.roleId.whichEmployee, answers.role.whichEmployeeRole])
    //             console.table(employeeRoles)
    //         }
    // }

        mainApp()
}
   
mainApp();