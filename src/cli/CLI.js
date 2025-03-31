const inquirer = require('inquirer');
const {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
} = require('../utils/queries');

async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add a Department':
            await promptAddDepartment();
            break;
        case 'Add a Role':
            await promptAddRole();
            break;
        case 'Add an Employee':
            await promptAddEmployee();
            break;
        case 'Update Employee Role':
            await promptUpdateEmployeeRole();
            break;
        case 'Exit':
            console.log('Exiting...');
            process.exit(0);
    }

    mainMenu(); // Return to the main menu
}

// Add Department Prompt
async function promptAddDepartment() {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter department name:' }
    ]);
    await addDepartment(name);
}

// Add Role Prompt
async function promptAddRole() {
    const { title, salary, departmentId } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter role title:' },
        { type: 'input', name: 'salary', message: 'Enter role salary:' },
        { type: 'input', name: 'departmentId', message: 'Enter department ID:' }
    ]);
    await addRole(title, salary, departmentId);
}

// Add Employee Prompt
async function promptAddEmployee() {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: "Enter employee's first name:" },
        { type: 'input', name: 'lastName', message: "Enter employee's last name:" },
        { type: 'input', name: 'roleId', message: "Enter employee's role ID:" },
        { type: 'input', name: 'managerId', message: "Enter manager's ID (optional):" }
    ]);
    await addEmployee(firstName, lastName, roleId, managerId);
}

// Update Employee Role Prompt
async function promptUpdateEmployeeRole() {
    const { employeeId, roleId } = await inquirer.prompt([
        { type: 'input', name: 'employeeId', message: 'Enter employee ID to update:' },
        { type: 'input', name: 'roleId', message: 'Enter new role ID:' }
    ]);
    await updateEmployeeRole(employeeId, roleId);
}

module.exports = mainMenu;