require('dotenv').config()

const mysql = require("mysql");
const inquirer = require("inquirer");
const { async } = require('rxjs/internal/scheduler/async');

class Database {
  constructor( config ) {
      this.connection = mysql.createConnection( config );
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  return reject( err );
              resolve( rows );
          } );
      } );
  }

close() {
    return new Promise( ( resolve, reject ) => {
        this.connection.end( err => {
            if ( err )
                return reject( err );
            resolve();
        } );
    } );
}
}
  const db = new Database({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    insecureAuth : true
  });

  let questions

  async function mainApp(){
     questions = await inquirer.prompt([{name:"response1", message:"What would you like to manage?", type:"list", 
    choices:["Departments", "Roles", "Employees"]}])
     
    let employerList = await db.query( "SELECT * FROM employee")
    console.table(employerList)

    if(questions.response1 == "Employees"){
        questions= await inquirer.prompt([{name:"response2", message:"What would you like to do?", type:"list", 
        choices:["Add Employees", "Veiw Employees", "Update Employee Roles"]}])
    }
    
    
  }
  mainApp()