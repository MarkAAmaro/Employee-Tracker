
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
    ('Jane', 'Smith', (SELECT id FROM role WHERE title = 'Software Engineer'), @manager_id),
    ('Emily', 'Johnson', (SELECT id FROM role WHERE title = 'HR Specialist'), @manager_id),
    ('Michael', 'Brown', (SELECT id FROM role WHERE title = 'Marketing Director'), @manager_id);