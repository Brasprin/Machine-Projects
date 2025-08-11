const { getCompanyID } = require("./sampleAccounts");
const sampleEmployees = [];

async function createSampleEmployees() {
    try {
        const dlsuCompanyID = await getCompanyID("DLSU");
        const openAICompanyID = await getCompanyID("OpenAI");

        sampleEmployees.push(
            { // DLSU Employees
                employee_id: "110",
                company: dlsuCompanyID,
                status: "Active",
                fname: "Admin",
                middleName: "A",
                lname: "User",
                department: "HR",
                position: "Professor",
                designation: "CCS",
                basicSalary: 100000,
                overtimeRate: 200,
                bankAccount: {
                    bankName: "BDO",
                    accountNumber: "0000000001",
                    branch: "Main"
                },
                dateHired: new Date("2020-01-01"),
                phone: "09100000000",
                email: "admin@example.com",
                rbacProfile: 0
            },
            {
                employee_id: "111",
                company: dlsuCompanyID,
                status: "Active",
                fname: "John",
                middleName: "A",
                lname: "Doe",
                department: "IT",
                position: "Developer",
                designation: "Software Engineer",
                basicSalary: 8385,
                overtimeRate: 200,
                bankAccount: {
                    bankName: "BDO",
                    accountNumber: "0000000111",
                    branch: "Quezon City"
                },
                dateHired: new Date("2001-10-10"),
                phone: "09100000000",
                email: "jdoe@gmail.com",
                rbacProfile: 1
            },
            {
                employee_id: "112",
                company: dlsuCompanyID,
                status: "Active",
                fname: "Iker",
                middleName: "A",
                lname: "Ventura",
                department: "Marketing",
                position: "Assistant",
                designation: "Marketing Assistant",
                basicSalary: 9385,
                overtimeRate: 200,
                bankAccount: {
                    bankName: "BPI",
                    accountNumber: "0000000112",
                    branch: "Manila"
                },
                dateHired: new Date("2001-10-10"),
                phone: "09100000000",
                email: "iventura@gmail.com",
                rbacProfile: 1
            },
            {
                employee_id: "113",
                company: dlsuCompanyID,
                status: "Active",
                fname: "Zora",
                middleName: "A",
                lname: "Scott",
                department: "Finance",
                position: "Clerk",
                designation: "Finance Staff",
                basicSalary: 11485,
                overtimeRate: 200,
                bankAccount: {
                    bankName: "Landbank",
                    accountNumber: "0000000113",
                    branch: "Cebu"
                },
                dateHired: new Date("2001-10-10"),
                phone: "09100000000",
                email: "zscott@gmail.com",
                rbacProfile: 1
            }, // End of DLSU Employees
            { // OpenAI employees
                employee_id: "201",
                company: openAICompanyID,
                status: "Active",
                fname: "Alice",
                middleName: "B",
                lname: "Tan",
                department: "Engineering",
                position: "QA Analyst",
                designation: "Software QA",
                basicSalary: 70000,
                overtimeRate: 200,
                bankAccount: {
                    bankName: "BPI",
                    accountNumber: "0000000210",
                    branch: "Makati"
                },
                dateHired: new Date("2022-06-15"),
                phone: "09181234567",
                email: "alice.tan@technova.com",
                rbacProfile: 1
            } // End of OpenAI Employees
        );

    } catch (error) {
        console.error("Error creating sample employees:", error);
    }
}

async function initializeEmployee() {
    await createSampleEmployees();
    return sampleEmployees;
}

module.exports = { initializeEmployee };
