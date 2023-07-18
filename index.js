const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

const main = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Ardrias1!',  // use your MySQL password here
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
    ]);

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

    // Start over
    main();
}

const viewAllDepartments = async (connection) => {
    const [rows] = await connection.execute('SELECT * FROM department');
    console.table(rows);
}

const viewAllRoles = async (connection) => {
    const [rows] = await connection.execute('SELECT * FROM role');
    console.table(rows);
}

const viewAllEmployees = async (connection) => {
    try {
        const query = `
            SELECT 
                e.id, 
                e.first_name, 
                e.last_name, 
                r.title AS role,
                d.name AS department,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
        `;
        
        const [rows] = await connection.execute(query);
        console.table(rows);
    } catch (error) {
        console.error("Error in viewAllEmployees function:", error.message);
    }
}

const addDepartment = async (connection) => {
    const { departmentName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:',
        }
    ]);
    
    await connection.execute('INSERT INTO department (name) VALUES (?)', [departmentName]);
    console.log("Department added successfully");
}

const addRole = async (connection) => {
    const departmentList = await connection.execute('SELECT id, name FROM department');
    const { roleTitle, roleSalary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary of the role:'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does the role belong to?',
            choices: departmentList[0].map(department => ({
                name: department.name,
                value: department.id
            }))
        }
    ]);
    
    await connection.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleTitle, roleSalary, departmentId]);
    console.log("Role added successfully");
}

const addEmployee = async (connection) => {
    const roleList = await connection.execute('SELECT id, title FROM role');
    const employeeList = await connection.execute('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role does the employee have?',
            choices: roleList[0].map(role => ({
                name: role.title,
                value: role.id
            }))
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Who is the manager of the employee?',
            choices: [...employeeList[0].map(employee => ({
                name: employee.name,
                value: employee.id
            })), { name: 'None', value: null }]
        }
    ]);
    
    await connection.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    console.log("Employee added successfully");
}

const updateEmployeeRole = async (connection) => {
    const employeeList = await connection.execute('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    const roleList = await connection.execute('SELECT id, title FROM role');
    const { employeeId, newRoleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee\'s role do you want to update?',
            choices: employeeList[0].map(employee => ({
                name: employee.name,
                value: employee.id
            }))
        },
        {
            type: 'list',
            name: 'newRoleId',
            message: 'What is the new role for the employee?',
            choices: roleList[0].map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]);
    
    await connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
    console.log("Employee's role updated successfully");
}

main()
    .catch(err => console.error(err));
