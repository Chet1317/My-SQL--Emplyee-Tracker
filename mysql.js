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
        name: "managementOptions", message: "What would you like to manage?", type: "list",
        choices: ["Departments", "Roles", "Employees"]
    }])


   if( answers.managementOptions=="Departments" ){
        let employerList = await db.query( 
            "SELECT CONCAT(e.first_name,' ',e.last_name) AS employeeName,"+
            "CONCAT(m.first_name,' ',m.last_name) AS managerName,r.title,r.salary "+
            "FROM employee AS e "+
            "LEFT JOIN employee AS m ON(e.manager_id=m.id) "+
            "LEFT JOIN role AS r ON(e.role_id=r.id)") 
            console.table( employerList )

            answers = await inquirer.prompt([
                {name: "managementOptions", message: "What would you like to do?", type: "list",
                choices: [{ name: "Add Employees", value: "add" },
                { name: "View Employees", value: "view" },
                { name: "Update Employee Roles", value: "update" }
                ]
                }])
    
   if( answers.managementOptions=="Employees" ){
    let employerList1 = await db.query( 
        "SELECT CONCAT(e.first_name,' ',e.last_name) AS employeeName,"+
        "CONCAT(m.first_name,' ',m.last_name) AS managerName,r.title,r.salary "+
        "FROM employee AS e "+
        "LEFT JOIN employee AS m ON(e.manager_id=m.id) "+
        "LEFT JOIN role AS r ON(e.role_id=r.id)") 
        console.table( employerList1 )

        answers = await inquirer.prompt([
            {name: "managementOptions", message: "What would you like to do?", type: "list",
            choices: [{ name: "Add Employees", value: "add" },
            { name: "View Employees", value: "view" },
            { name: "Update Employee Roles", value: "update" }
            ]
            }])
        
   if( answers.managementOptions=="Roles" ){
    let employerList2 = await db.query( 
        "SELECT CONCAT(e.first_name,' ',e.last_name) AS employeeName,"+
        "CONCAT(m.first_name,' ',m.last_name) AS managerName,r.title,r.salary "+
        "FROM employee AS e "+
        "LEFT JOIN employee AS m ON(e.manager_id=m.id) "+
        "LEFT JOIN role AS r ON(e.role_id=r.id)") 
        console.table( employerList2 )
                
        answers = await inquirer.prompt([
            {name: "managementOptions", message: "What would you like to do?", type: "list",
            choices: [{ name: "Add Employees", value: "add" },
            { name: "View Employees", value: "view" },
            { name: "Update Employee Roles", value: "update" }
            ]
            }])
    if (answers.managementOptions == "add"){
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
}
   }
}
}

mainApp()