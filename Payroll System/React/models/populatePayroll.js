
const mongoose = require("mongoose");
require('dotenv').config(); 
const bcrypt = require("bcrypt");

const {
  Employee,
  Payroll,
  Account,
  Company,
  Config
} = require("./payrollSchema.js");

const sampleCompanies = require("./sampleData/sampleCompanies.js");
const { initializeAccount, getCompanyID } = require("./sampleData/sampleAccounts");
const { initializeEmployee } = require("./sampleData/sampleEmployees.js");
const { initializeRates } = require("./sampleData/sampleRates.js");

async function dropDatabase() {
    try {
        await mongoose.connection.dropDatabase();
        console.log('Database: Old DB Dropped successfully');
    } catch (error) {
        console.error('Database: Error dropping database', error);
    }
}

async function hashPassword(password){
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
      } catch (error) {
        console.error('Error hashing password:', error);
      }
}

async function populateDatabase() {
    try {
      await dropDatabase();

      //================Populating of company================
      for (const company of sampleCompanies) {
        await Company.create(company);
        console.log("Database: Inserted company " + company.name + '.');
      }
      //======================================================


      //================Populating of accounts================
      const sampleAccounts = await initializeAccount();
      for (const acc of sampleAccounts) {
        acc.passwordHash = await hashPassword(acc.passwordHash);
        const accDoc = new Account(acc);

        await accDoc.save();
        console.log("Database: Inserted account " + acc.username + '.');
      }
      //======================================================

      //================Populating of employees================
      const sampleEmployees = await initializeEmployee();

      for (const emp of sampleEmployees) {
        await Employee.create(emp);
        console.log("Database: Inserted employee " + emp.employee_id + '.');
      }
      //======================================================
      
      //========================Config========================
      const sampleRates = await initializeRates();

      for (const rate of sampleRates){
        await Config.create(rate);
        console.log("Database: Inserted config for company " + rate.company + '.');
      }
      /*
      await Config.create({
        standardRate: 645,
        holidayRate: 800,
        weekendRate: 700
      });
      */
      console.log("Database: Inserted payroll config.");
      //======================================================



      
  // at the top of your file
  const PAYROLL_TIMEFRAMES = ['Weekly','Bi-Monthly','Monthly'];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomPayDate() {
    const day = randomInt(1, 30);
    return new Date(2024, 9, day);
  }

  // main routine
  async function seedPayroll() {
    const dlsuCompanyID = await getCompanyID("DLSU");
    const employees = await Employee.find({ company: dlsuCompanyID }).lean();

    const payrollData = employees.map(emp => {
      // 1) pick timeframe & payDate
      const payrollTimeframe = PAYROLL_TIMEFRAMES[randomInt(0, PAYROLL_TIMEFRAMES.length - 1)];
      const payDate = randomPayDate();

      // 2) random allowances
      const allowances = {
        overtimePay: randomInt(100, 500),
        mealAllowance: randomInt(100, 500),
        birthdayBonus: randomInt(0, 1000),
        incentives: randomInt(0, 2000),
        otherAdditions: randomInt(0, 500)
      };

      // 3) compute gross = base + allowances + OT
      const grossSalary = emp.basicSalary + allowances.mealAllowance
        + allowances.birthdayBonus + allowances.incentives
        + allowances.otherAdditions;

      // 4) random deductions
      const deductions = {
        tax: +(grossSalary * (randomInt(10, 20) / 100)).toFixed(2),
        sss: randomInt(200, 800),
        philHealth: randomInt(200, 800),
        pagIbig: randomInt(100, 500),
        healthCard: randomInt(50, 200),
        cashAdvance: randomInt(0, 1000),
        lateHours: randomInt(0, 300),
        absentDays: randomInt(0, 300),
        otherDeductions: randomInt(0, 300)
      };
      const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
      const total = +(grossSalary - totalDeductions).toFixed(2);

      return {
        employee: emp._id,
        payDate,
        payrollTimeframe,
        allowances,
        grossSalary: +grossSalary.toFixed(2),
        deductions,
        totalDeductions,
        total,
        paymentMode: ['Bank Transfer','Cash','Check'][randomInt(0,2)],
        payslipId: `PS${emp.employee_id}-${payDate.toISOString().slice(0,10)}`,
        isApproved: Math.random() < 0.8,  // 80% chance approved
        dateGenerated: payDate,
        isDeleted: false
      };
    });

      try {
        const result = await Payroll.insertMany(payrollData, { ordered: false });

        console.log(`Inserted ${result.length} payroll entries.`);
      } catch (err) {
        console.error("Insert error:", err);
        if (err.writeErrors) {
          err.writeErrors.forEach(e => console.error(e.errmsg));
        }
      }
  }
      await seedPayroll().catch(console.error);
      console.log('Database: Population function completed');
    } catch (error) {
      console.error('Database: Error populating database', error);
    }
}

module.exports = populateDatabase;

