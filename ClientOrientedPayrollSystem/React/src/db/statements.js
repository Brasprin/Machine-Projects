const db = require('better-sqlite3')('employee.db')

const createEmployeeTable = () => {
    const sql = `
        CREATE TABLE employee (
	        id int(11) NOT NULL,
	        employee_id varchar(11) DEFAULT NULL,
	        status tinyint(1) NOT NULL DEFAULT 1,
	        fname varchar(255) NOT NULL,
	        mname varchar(255) NOT NULL,
	        lname varchar(255) NOT NULL,
	        phone varchar(50) DEFAULT NULL,
	        email varchar(255) DEFAULT NULL,
	        designation varchar(50) NOT NULL,
	        position varchar(100) NOT NULL,
	        date_hired date DEFAULT NULL,
	        rbacProfile int(11) NOT NULL
	)
    `
    db.prepare(sql).run()
}

const createEmployeeFinancialTable = () => {
    const sql = `
        CREATE TABLE employee_financial (
	        id INTEGER PRIMARY KEY AUTOINCREMENT,
	        employee_id varchar(11) DEFAULT NULL,
            Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	        overtime int(11) NOT NULL,
	        incentive int(11) NOT NULL,
	        salary_increase int(11) DEFAULT NULL,
	        meal_allowance int(11) DEFAULT NULL,
	        bday_bonus int(11) DEFAULT NULL,
	        other_bonus int(11) DEFAULT NULL,
	        cash_advance int(11) DEFAULT NULL,
	        health_card int(11) NOT NULL,
            sss_benfit int(11) NOT NULL,
            philhealth_benfit int(11) NOT NULL,
            late int(11) DEFAULT NULL,
            absent int(11) DEFAULT NULL
	)
    `
    db.prepare(sql).run()
}

const insertEmployee = (id, employee_id, status, fname, mname, lname, phone, email, designation, position, date_hired, rbacProfile) => {
	const sql = `
	INSERT INTO employee (id, employee_id, status, fname, mname, lname, phone, email, designation, position, date_hired, rbacProfile)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	db.prepare(sql).run(id, employee_id, status, fname, mname, lname, phone, email, designation, position, date_hired, rbacProfile)
}

const selectEmployee = () => {
    
}

insertEmployee(2, "2", 1, "Lebron", "Raymone", "James", "09183057126", "king@gmail.com", "Senior Management", "Vice President", null, 313)
insertEmployee(3, "3", 1, "Jack", "Kurt", "Scott", "09163456125", "JackScott@gmail.com", "Employee", "Pest Man", null, 323)