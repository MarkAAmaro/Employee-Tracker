const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

const main = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Ardrias1!',  // use your MySQL password here
        database: 'my_db'
    });