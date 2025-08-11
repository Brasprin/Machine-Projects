const mongoose = require('mongoose');
const { Schema } = mongoose;

// Employee Schema
const employeeSchema = new Schema({
  employee_id: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  fname: { type: String, required: true },
  middleName: { type: String },
  lname: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  designation: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  overtimeRate: { type: Number, required: true },
  bankAccount: {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    branch: { type: String }
  },
  dateHired: { type: Date, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  rbacProfile: { type: Number, required: true },
}, { timestamps: true });

employeeSchema.index(
  { company: 1, employee_id: 1 },
  { unique: true }
);

// Payroll Schema
const payrollSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  payDate: { type: Date, required: true },
  payrollTimeframe: { type: String, enum: ['Weekly', 'Bi-Monthly', 'Monthly'], required: true },
  overtimeDetails: {
    hours: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    total: { type: Number, default: 0 } // for clarity
  },
  allowances: {
    overtimePay: { type: Number, default: 0 },
    mealAllowance: { type: Number, default: 0 },
    birthdayBonus: { type: Number, default: 0 },
    incentives: { type: Number, default: 0 },
    otherAdditions: { type: Number, default: 0 }
  },
  
  grossSalary: { type: Number, required: true },
  deductions: {
    tax: { type: Number, default: 0 },
    sss: { type: Number, default: 0 },
    philHealth: { type: Number, default: 0 },
    pagIbig: { type: Number, default: 0 },
    healthCard: { type: Number, default: 0 },
    cashAdvance: { type: Number, default: 0 },
    lateHours: { type: Number, default: 0 },
    absentDays:     { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 }
  },
  totalDeductions: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMode: { type: String, enum: ['Bank Transfer', 'Cash', 'Check'], default: 'Bank Transfer' },
  payslipId: { type: String, required: true, unique: true },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Account' },
  dateGenerated: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, required: true, default: false }
}, { timestamps: true });

// Account Schema
const accountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'Administrator' },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Company Schema
const companySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  industry: { type: String },
  overtimeMultiplier: { type: Number, default: 1.25 },    
  workHoursPerDay: { type: Number, default: 8 },          
  workingDaysPerMonth: { type: Number, default: 22 },    
  isDeleted: { type: Boolean, default: false }
});

// Config Schema (for rate settings)
const configSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  standardRate: { type: Number, default: 0 },
  holidayRate: { type: Number, default: 0 },
  weekendRate: { type: Number, default: 0 }
});




// Models
const Employee = mongoose.model('Employee', employeeSchema);
const Payroll = mongoose.model('Payroll', payrollSchema);
const Account = mongoose.model('Account', accountSchema);
const Company = mongoose.model('Company', companySchema);
const Config = mongoose.model('Config', configSchema);


module.exports = {
  Employee,
  Payroll,
  Account,
  Company,
  Config
};

