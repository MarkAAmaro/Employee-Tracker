USE my_db;

INSERT INTO department (name) VALUES 
    ('Sales'), 
    ('Engineering'), 
    ('HR'), 
    ('Marketing');

    INSERT INTO role (title, salary, department_id) VALUES 
    ('Sales Manager', 70000, (SELECT id FROM department WHERE name = 'Sales')), 
    ('Software Engineer', 80000, (SELECT id FROM department WHERE name = 'Engineering')),
    ('HR Specialist', 60000, (SELECT id FROM department WHERE name = 'HR')),
    ('Marketing Director', 90000, (SELECT id FROM department WHERE name = 'Marketing'));


INSERT INTO employee (first_name, last_name, role_id) VALUES 
    ('John', 'Doe', (SELECT id FROM role WHERE title = 'Sales Manager')),
    ('Jane', 'Smith', (SELECT id FROM role WHERE title = 'Software Engineer')),
    ('Emily', 'Johnson', (SELECT id FROM role WHERE title = 'HR Specialist')),
    ('Michael', 'Brown', (SELECT id FROM role WHERE title = 'Marketing Director'));
