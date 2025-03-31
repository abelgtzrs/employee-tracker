const figlet = require('figlet');
const inquirer = require('inquirer');
const db = require('../db/connection');

const {
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
} = require('../utils/queries');

// Display ASCII Welcome Message
function displayWelcome() {
    figlet('Employee Tracker', (err, data) => {
        if (err) {
            console.error('Error generating ASCII art:', err);
            mainMenu(); // If figlet fails, go to main menu
            return;
        }
        console.log(data);
        console.log('🚀 Manage your company\'s departments, roles, and employees easily!');
        mainMenu(); // Start the main menu after displaying ASCII
    });
}

// Main Menu for CLI
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
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'View Total Salaries of a Department',
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
        case 'Update Employee Manager':
            await promptUpdateEmployeeManager();
            break;
        case 'View Employees by Manager':
            await promptViewEmployeesByManager();
            break;
        case 'View Employees by Department':
            await promptViewEmployeesByDepartment();
            break;
        case 'Delete Department':
            await promptDeleteDepartment();
            break;
        case 'Delete Role':
            await promptDeleteRole();
            break;
        case 'Delete Employee':
            await promptDeleteEmployee();
            break;
        case 'View Total Salaries of a Department':
            await promptViewDepartmentBudget();
            break;
        case 'Exit':
            console.log('👋 Goodbye!');
            process.exit(0);
    }

    mainMenu(); // Return to the main menu after each action
}

//PROMPTS

//Prompt for Addings departments
async function promptAddDepartment() {

    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the new department name:'
      }
    ]);
  
    // Call your SQL function
    await addDepartment(name);
    console.log(`Department "${name}" created!`);
  }

//Prompts for Adding Roles
  async function promptAddRole() {
    const departmentRes = await db.query('SELECT id, name FROM departments');
    const departmentChoices = departmentRes.rows.map(dept => ({
      name: dept.name,
      value: dept.id
    }));
  
    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the new role title:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the role salary (number):'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department this role belongs to:',
        choices: departmentChoices
      }
    ]);
    await addRole(title, salary, departmentId);
    console.log(`Role "${title}" created!`);
  }

//Prompt for Adding Employees
async function promptAddEmployee() {
    const roleRes = await db.query('SELECT id, title FROM roles');
    const roleChoices = roleRes.rows.map(r => ({
      name: r.title,
      value: r.id
    }));
  
    const employeeRes = await db.query('SELECT id, first_name, last_name FROM employees');
    const managerChoices = employeeRes.rows.map(e => ({
      name: `${e.first_name} ${e.last_name}`,
      value: e.id
    }));
    managerChoices.unshift({ name: 'No Manager', value: null });
  
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:"
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:"
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the employee’s role:',
        choices: roleChoices
      },
      {
        type: 'list',
        name: 'managerId',
        message: "Select the employee's manager:",
        choices: managerChoices
      }
    ]);
  
    await addEmployee(firstName, lastName, roleId, managerId);
    console.log(`Employee "${firstName} ${lastName}" created!`);
  }

// Prompt for Updating Employee Role
async function promptUpdateEmployeeRole() {
    const employeeRes = await db.query('SELECT id, first_name, last_name FROM employees');
    const employeeChoices = employeeRes.rows.map(e => ({
      name: `${e.first_name} ${e.last_name}`,
      value: e.id
    }));
  
    const roleRes = await db.query('SELECT id, title FROM roles');
    const roleChoices = roleRes.rows.map(r => ({
      name: r.title,
      value: r.id
    }));
  
    const { employeeId, newRoleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee you want to update:',
        choices: employeeChoices
      },
      {
        type: 'list',
        name: 'newRoleId',
        message: 'Select the new role:',
        choices: roleChoices
      }
    ]);
  
    await updateEmployeeRole(employeeId, newRoleId);
    console.log('Employee role updated!');
  }
  
// Prompt for Updating Employee Manager
async function promptUpdateEmployeeManager() {
    const employeeRes = await db.query('SELECT id, first_name, last_name FROM employees');
    const employees = employeeRes.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));
    const managerRes = await db.query('SELECT id, first_name, last_name FROM employees');
    const managers = managerRes.rows.map(mgr => ({
        name: `${mgr.first_name} ${mgr.last_name}`,
        value: mgr.id
    }));

    managers.unshift({ name: 'No Manager', value: null });

    const { employeeId, managerId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose manager you want to update:',
            choices: employees
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the new manager:',
            choices: managers
        }
    ]);

    await updateEmployeeManager(employeeId, managerId);
}
// Promt for View Employees by Manager
async function promptViewEmployeesByManager() {
    const managerRes = await db.query(`
      SELECT DISTINCT m.id, m.first_name, m.last_name
      FROM employees e
      JOIN employees m ON e.manager_id = m.id
      ORDER BY m.last_name
    `);

    const managers = managerRes.rows.map(mgr => ({
        name: `${mgr.first_name} ${mgr.last_name}`,
        value: mgr.id
    }));

    const { managerId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'managerId',
            message: 'Select a manager to see their direct reports:',
            choices: managers
        }
    ]);

    await viewEmployeesByManager(managerId);
}

//Prompt for View Employees by Deparment
async function promptViewEmployeesByDepartment() {
    const deptRes = await db.query('SELECT id, name FROM departments');
    const departments = deptRes.rows.map(dept => ({
        name: dept.name,
        value: dept.id
    }));

    const { departmentId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select a department:',
            choices: departments
        }
    ]);

    await viewEmployeesByDepartment(departmentId);
}

//Promt for Delete Department
async function promptDeleteDepartment() {
    const deptRes = await db.query('SELECT id, name FROM departments');
    const departments = deptRes.rows.map(d => ({ name: d.name, value: d.id }));

    const { deptId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'deptId',
            message: 'Select the department to delete:',
            choices: departments
        }
    ]);

    await deleteDepartment(deptId);
}

//Promt for Delete Role
async function promptDeleteRole() {
    const roleRes = await db.query('SELECT id, title FROM roles');
    const roles = roleRes.rows.map(r => ({ name: r.title, value: r.id }));
  
    const { roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the role to delete:',
        choices: roles
      }
    ]);
  
    await deleteRole(roleId);
  }
  
//Prompt for Delete Employee
  async function promptDeleteEmployee() {
    const empRes = await db.query('SELECT id, first_name, last_name FROM employees');
    const employees = empRes.rows.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
  
    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to delete:',
        choices: employees
      }
    ]);
  
    await deleteEmployee(employeeId);
  }
  

  async function promptViewDepartmentBudget() {
    const deptRes = await db.query('SELECT id, name FROM departments');
    const departments = deptRes.rows.map(d => ({ name: d.name, value: d.id }));
  
    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its total salary:',
        choices: departments
      }
    ]);
  
    await viewDepartmentBudget(departmentId);
  }
  

module.exports = displayWelcome;
