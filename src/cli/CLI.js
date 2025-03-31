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
        console.log(' Manage your company\'s departments, roles, and employees.');
        mainMenu(); // Start the main menu after displaying ASCII
    });
}

async function mainMenu() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Main Menu: What would you like to do?',
        choices: [
          'Manage Departments',
          'Manage Roles',
          'Manage Employees',
          'Exit'
        ]
      }
    ]);
  
    switch (action) {
      case 'Manage Departments':
        await departmentMenu();
        break;
      case 'Manage Roles':
        await roleMenu();
        break;
      case 'Manage Employees':
        await employeeMenu();
        break;
      case 'Exit':
        console.log(' Goodbye!');
        process.exit(0);
    }
  
    // Return to main menu after the submenu is done
    await mainMenu();
  }
  async function departmentMenu() {
    const { deptAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'deptAction',
        message: 'Department Menu: What would you like to do?',
        choices: [
          'View All Departments',
          'Add Department',
          'Delete Department',
          'View Total Salaries in Department',
          'Back to Main'
        ]
      }
    ]);
  
    switch (deptAction) {
      case 'View All Departments':
        await viewDepartments(); // from queries.js
        break;
      case 'Add Department':
        await promptAddDepartment();
        break;
      case 'Delete Department':
        await promptDeleteDepartment();
        break;
      case 'View Total Salaries in Department':
        await promptViewDepartmentBudget();
        break;
      case 'Back to Main':
        return; // This exits departmentMenu() and goes back to mainMenu()
    }
  
    // Loop back to the department menu until the user chooses "Back to Main"
    await departmentMenu();
  }
  async function roleMenu() {
    const { roleAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'roleAction',
        message: 'Role Menu: What would you like to do?',
        choices: [
          'View All Roles',
          'Add Role',
          'Delete Role',
          'Back to Main'
        ]
      }
    ]);
  
    switch (roleAction) {
      case 'View All Roles':
        await viewRoles(); // from queries.js
        break;
      case 'Add Role':
        await promptAddRole();
        break;
      case 'Delete Role':
        await promptDeleteRole();
        break;
      case 'Back to Main':
        return;
    }
  
    // Return to the role menu until user chooses “Back”
    await roleMenu();
  }
  async function employeeMenu() {
    const { empAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'empAction',
        message: 'Employee Menu: What would you like to do?',
        choices: [
          'View All Employees',
          'Add Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'View Employees by Manager',
          'View Employees by Department',
          'Delete Employee',
          'Back to Main'
        ]
      }
    ]);
  
    switch (empAction) {
      case 'View All Employees':
        await viewEmployees();
        break;
      case 'Add Employee':
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
      case 'Delete Employee':
        await promptDeleteEmployee();
        break;
      case 'Back to Main':
        return;
    }
  
    // After action, stay in the Employee Menu
    await employeeMenu();
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
