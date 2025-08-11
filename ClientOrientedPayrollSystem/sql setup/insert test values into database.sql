            
DROP TABLE IF EXISTS payments;
CREATE TABLE IF NOT EXISTS payments (
		payment_id INT NOT NULL AUTO_INCREMENT,
        employee_index_id INT NOT NULL,
		payDate DATE NOT NULL,
		rate DECIMAL(38,2) NOT NULL,
        basic DECIMAL(38,2) NOT NULL, 
		overtimeDays INT NOT NULL,
		salaryIncrease DECIMAL(38,2) NOT NULL,
        mealAllowance DECIMAL(38,2) NOT NULL, 
        birthdayBonus DECIMAL(38,2) NOT NULL,
        incentive DECIMAL(38,2) NOT NULL,
        otherAdditions DECIMAL(38,2) NOT NULL,
        sss DECIMAL(38,2) NOT NULL,
        philHealth DECIMAL(38,2) NOT NULL,
        pagIbig DECIMAL(38,2) NOT NULL,
        cashAdvance DECIMAL(38,2) NOT NULL,
        healthCard DECIMAL(38,2) NOT NULL,
        lateAbsent DECIMAL(38,2) NOT NULL,
        otherDeductions DECIMAL(38,2) NOT NULL,
        payroll DECIMAL(38,2) NOT NULL,
        deductions DECIMAL(38,2) NOT NULL,
        total DECIMAL(38,2) NOT NULL,
        isDeleted BOOL DEFAULT FALSE NOT NULL,
		PRIMARY KEY (payment_id),
		FOREIGN KEY (employee_index_id)
			REFERENCES employee(id)
);

DELETE FROM employee;
INSERT INTO	employee
	VALUES	(1, 111, 1, 'John', 'A', 'Doe', '09100000000', 'jdoe@gmail.com', 'designation', 'position', '2001-10-10', 1),
			(2, 112, 1, 'Iker', 'A', 'Ventura', '09100000000', 'iventura@gmail.com', 'designation', 'position', '2001-10-10', 1),
			(3, 113, 1, 'Zora', 'A', 'Scott', '09100000000', 'zscott@gmail.com', 'designation', 'position', '2001-10-10', 1),           
            (4, 114, 1, 'Alice', 'A', 'Johnson', '09100000000', 'ajohnson@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (5, 115, 1, 'Bob', 'A', 'Smith', '09100000000', 'bsmith@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (6, 116, 1, 'Charlie', 'A', 'Brown', '09100000000', 'cbrown@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (7, 117, 1, 'David', 'A', 'Wilson', '09100000000', 'dwilson@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (8, 118, 1, 'Eva', 'A', 'Martinez', '09100000000', 'emartinez@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (9, 119, 1, 'Frank', 'A', 'Garcia', '09100000000', 'fgarcia@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (10, 1110, 1, 'Grace', 'A', 'Lee', '09100000000', 'glee@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (11, 1111, 1, 'Hannah', 'A', 'Walker', '09100000000', 'hwalker@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (12, 1112, 1, 'Ian', 'A', 'Hall', '09100000000', 'ihall@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (13, 1113, 1, 'Jack', 'A', 'Young', '09100000000', 'jyoung@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (14, 1114, 1, 'Karen', 'A', 'King', '09100000000', 'kking@gmail.com', 'designation', 'position', '2001-10-10', 1),
            (15, 1115, 1, 'Liam', 'A', 'Wright', '09100000000', 'lwright@gmail.com', 'designation', 'position', '2001-10-10', 1);


INSERT INTO payments
	VALUES (1, 1, '2024-10-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
	(2, 2, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (3, 3, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (4, 4, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (5, 5, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (6, 6, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (7, 7, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (8, 8, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (9, 9, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (10, 10, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (11, 11, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (12, 12, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (13, 13, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (14, 14, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (15, 15, '2024-11-16', 645, 8385, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8385, 0, 8385, FALSE),
    (16, 1, '2024-11-16', 645, 8385, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11610, 0, 11610, FALSE),
    (17, 1, '2024-12-16', 645, 8385, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11610, 0, 11610, FALSE);
    
DROP TABLE IF EXISTS payroll_app_config;
CREATE TABLE IF NOT EXISTS payroll_app_config (
		password VARCHAR(100) NOT NULL,
        rate DECIMAL(38,2) NOT NULL,
        basic DECIMAL(38,2) NOT NULL
);

INSERT INTO payroll_app_config
	VALUES ('123', 645, 8385);
