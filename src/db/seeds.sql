-- Insert data into departments
INSERT INTO departments (name) VALUES
('Engineering'),
('Finance'),
('Human Resources'),
('Marketing'),
('Sales'),
('Customer Support'),
('Legal'),
('IT'),
('Operations'),
('Research & Development');

-- Insert data into roles
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 85000, 1),
('Senior Software Engineer', 105000, 1),
('Accountant', 70000, 2),
('Financial Analyst', 75000, 2),
('HR Manager', 90000, 3),
('Recruiter', 65000, 3),
('Marketing Specialist', 60000, 4),
('SEO Analyst', 62000, 4),
('Sales Representative', 55000, 5),
('Sales Manager', 95000, 5),
('Customer Support Specialist', 45000, 6),
('Support Manager', 70000, 6),
('Legal Advisor', 110000, 7),
('Paralegal', 65000, 7),
('IT Support Technician', 50000, 8),
('Network Administrator', 80000, 8),
('Operations Manager', 95000, 9),
('Logistics Coordinator', 62000, 9),
('Research Scientist', 120000, 10),
('Lab Technician', 55000, 10);

-- Insert data into employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
-- Engineering Team
('Julian', 'Casablancas', 1, NULL),
('Albert', 'Hammond', 2, 1),
('Nick', 'Valensi', 1, 1),
('Nikolai', 'Fraiture', 2, 1),
('Fabrizio', 'Moretti', 1, 1),
('Ryan', 'Gentles', 2, 1),
-- Finance Team
('Kevin', 'Anderson', 3, NULL),
('Emily', 'Taylor', 4, 7),
('James', 'Thomas', 3, 7),
('Sophia', 'Hernandez', 4, 7),
-- HR Team
('Olivia', 'Moore', 5, NULL),
('Liam', 'Clark', 6, 11),
('Mason', 'Lewis', 5, 11),
('Ava', 'Hall', 6, 11),
-- Marketing Team
('Ethan', 'Allen', 7, NULL),
('Mia', 'Young', 8, 15),
('Noah', 'King', 7, 15),
('Isabella', 'Wright', 8, 15),
-- Sales Team
('Lucas', 'Scott', 9, NULL),
('Amelia', 'Adams', 10, 19),
('Benjamin', 'Baker', 9, 19),
('Charlotte', 'Gonzalez', 10, 19),
-- Customer Support Team
('William', 'Nelson', 11, NULL),
('Ella', 'Carter', 12, 23),
('Alexander', 'Mitchell', 11, 23),
('Harper', 'Perez', 12, 23),
-- Legal Team
('Henry', 'Roberts', 13, NULL),
('Evelyn', 'Turner', 14, 27),
('Jack', 'Phillips', 13, 27),
('Lily', 'Campbell', 14, 27),
-- IT Team
('Daniel', 'Evans', 15, NULL),
('Aria', 'Edwards', 16, 31),
('Matthew', 'Collins', 15, 31),
('Chloe', 'Stewart', 16, 31),
-- Operations Team
('Sebastian', 'Sanchez', 17, NULL),
('Zoey', 'Morris', 18, 35),
('Jackson', 'Rogers', 17, 35),
('Penelope', 'Reed', 18, 35),
-- R&D Team
('Samuel', 'Cook', 19, NULL),
('Grace', 'Morgan', 20, 39),
('Leo', 'Bell', 19, 39),
('Avery', 'Murphy', 20, 39);
