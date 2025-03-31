const db = require('../db/connection');

// View all departments
const viewDepartments = async () => {
    const result = await db.query('SELECT * FROM departments');
    console.table(result.rows);
};

// View all roles
const viewRoles = async () => {
    const result = await db.query(`
        SELECT roles.id, roles.title, roles.salary, departments.name AS department 
        FROM roles
        JOIN departments ON roles.department_id = departments.id
    `);
    console.table(result.rows);
};

// View all employees
const viewEmployees = async () => {
    const result = await db.query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
               departments.name AS department, roles.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    `);
    console.table(result.rows);
};

// Add a department
const addDepartment = async (name) => {
    await db.query('INSERT INTO departments (name) VALUES ($1)', [name]);
    console.log(`Department "${name}" added successfully!`);
};

// Add a role
const addRole = async (title, salary, departmentId) => {
    await db.query(
        'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
        [title, salary, departmentId]
    );
    console.log(`Role "${title}" added successfully!`);
};

// Add an employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
    await db.query(
        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
        [firstName, lastName, roleId, managerId || null]
    );
    console.log(`Employee "${firstName} ${lastName}" added successfully!`);
};

// Update employee role
const updateEmployeeRole = async (employeeId, roleId) => {
    await db.query(
        'UPDATE employees SET role_id = $1 WHERE id = $2',
        [roleId, employeeId]
    );
    console.log(`Employee updated successfully!`);
};

module.exports = {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};
