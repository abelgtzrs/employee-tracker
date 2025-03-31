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
    console.log(`✅ Department "${name}" added successfully!`);
};

// Add a role
const addRole = async (title, salary, departmentId) => {
    await db.query(
        'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
        [title, salary, departmentId]
    );
    console.log(`✅ Role "${title}" added successfully!`);
};

// Add an employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
    await db.query(
        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
        [firstName, lastName, roleId, managerId || null]
    );
    console.log(`✅ Employee "${firstName} ${lastName}" added successfully!`);
};

// Update employee role
const updateEmployeeRole = async (employeeId, roleId) => {
    await db.query(
        'UPDATE employees SET role_id = $1 WHERE id = $2',
        [roleId, employeeId]
    );
    console.log(`✅ Employee role updated successfully!`);
};

// Update employee manager
const updateEmployeeManager = async (employeeId, managerId) => {
    await db.query(
      'UPDATE employees SET manager_id = $1 WHERE id = $2',
      [managerId || null, employeeId]
    );
    console.log(`✅ Employee's manager updated successfully!`);
  };

// View employees by a specific manager
const viewEmployeesByManager = async (managerId) => {
    const result = await db.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      JOIN departments d ON r.department_id = d.id
      WHERE e.manager_id = $1
    `, [managerId]);
  
    console.table(result.rows);
  };
  
// View employees by department
const viewEmployeesByDepartment = async (departmentId) => {
    const result = await db.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS role
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      WHERE r.department_id = $1
    `, [departmentId]);
  
    console.table(result.rows);
  };
  

// Delete a department
const deleteDepartment = async (deptId) => {
    await db.query('DELETE FROM departments WHERE id = $1', [deptId]);
    console.log(`Department deleted!`);
  };
  

// Delete a role
const deleteRole = async (roleId) => {
    await db.query('DELETE FROM roles WHERE id = $1', [roleId]);
    console.log(`✅ Role deleted!`);
  };  

// Delete an employee
const deleteEmployee = async (employeeId) => {
    await db.query('DELETE FROM employees WHERE id = $1', [employeeId]);
    console.log(`✅ Employee deleted!`);
  };  

// View total utilized salaries of a department
const viewDepartmentBudget = async (departmentId) => {
    const result = await db.query(`
      SELECT d.name AS department, SUM(r.salary) AS total_salary
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      JOIN departments d ON r.department_id = d.id
      WHERE d.id = $1
      GROUP BY d.name
    `, [departmentId]);
  
    console.table(result.rows);
  };
  

module.exports = {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    viewDepartmentBudget
};
