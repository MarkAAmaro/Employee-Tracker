const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
require('dotenv').config();

const main = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

const main = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Ardrias1!', 
        database: 'my_db'
    });

    console.log('Connected to the database.');

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]);}
    switch(action) {
        case 'View all departments':
            await viewAllDepartments(connection);
            break;
        case 'View all roles':
            await viewAllRoles(connection);
            break;
        case 'View all employees':
            await viewAllEmployees(connection);
            break;
        case 'Add a department':
            await addDepartment(connection);
            break;
        case 'Add a role':
            await addRole(connection);
            break;
        case 'Add an employee':
            await addEmployee(connection);
            break;
        case 'Update an employee role':
            await updateEmployeeRole(connection);
            break;
        case 'Exit':
            connection.end();
            process.exit(0);
        default:
            console.log('Action not recognized!');
    }

    
    main();
}
    main()
    .catch(err => console.error(err));