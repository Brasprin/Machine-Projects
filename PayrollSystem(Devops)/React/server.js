const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const { Employee, Payroll, Account, Company, Config } = require("./models/payrollSchema.js");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectToMongo = require('./src/scripts/conn.js');
const populateDatabase = require("./models/populatePayroll.js");
require('dotenv').config();

const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET
console.log('🚀 Server starting...');
console.log('🔑 JWT_SECRET exists:', !!JWT_SECRET);
console.log('🔗 MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('🏢 DB_NAME:', process.env.DB_NAME);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

// Check if JWT_SECRET is undefined and crash early with better error
if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  console.error('Available env vars:', Object.keys(process.env).filter(key => !key.includes('SECRET')));
  // Don't crash in serverless, but log the issue
}

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,
      /^https:\/\/.*\.vercel\.app$/, 
      /^https:\/\/.*\.onrender\.com$/, 
      /^https:\/\/.*\.netlify\.app$/
    ];
    
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}; 

async function database() {
  try {
    console.log('🔌 Attempting database connection...');
    await connectToMongo();
    console.log('✅ Database connected successfully');
    
    console.log('📊 Attempting database population...');
    await populateDatabase();
    console.log('✅ Database populated successfully');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('❌ Full error:', error);
    // Don't crash in serverless
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

async function checkPassword(sentPassword, passwordFromDB) {
    try {
        return await bcrypt.compare(sentPassword, passwordFromDB);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}

app.use(express.static(path.join(__dirname, 'build')));
const ensureDb = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('🔌 Connecting to database...');
      await connectToMongo();
      console.log('✅ Database connected');
    }
    next();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};

// Apply ensureDb to ALL database routes:
app.use('/admin/*', ensureDb);
app.use('/api/*', ensureDb);
app.use('/employee*', ensureDb);
app.use('/payments*', ensureDb);
app.use('/getPayment*', ensureDb);
app.use('/deletePayment*', ensureDb);
app.use('/addPayment', ensureDb);
app.use('/editPayment*', ensureDb);
app.use('/addEmployee', ensureDb);
app.use('/getEmail', ensureDb);
app.use('/savePassword', ensureDb);
app.use('/changePassword', ensureDb);
app.use('/getEmployeeDetails*', ensureDb);
app.use('/getCompanyRates', ensureDb);
app.use('/updateCompanyRates', ensureDb);

app.get('/', (req, res) => {
  res.json("from backend side");
});

// FIXED: Updated to use companyID directly
// FIXED: Updated to use companyID directly and handle ObjectId format
app.get('/employee', async (req, res) => {
  const { company: companyId } = req.query; 

  
  if (!companyId) {
    return res.status(400).json({ error: 'Company ID is required' });
  }


  try {
    // Try both string and ObjectId formats to handle any inconsistencies
    const employees = await Employee.find({ 
      $and: [
        {
          $or: [
            { company: companyId },  // String format
            { company: new mongoose.Types.ObjectId(companyId) }  // ObjectId format
          ]
        },
        { 
          $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
          ]
        }
      ]
    }).lean();
  
    res.json(employees);
  } catch (err) {
    console.error("Error in GET /employee:", err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/payments/:employee_id', async (req, res) => {
  try {
    const { company } = req.query;

    if (!company) {
      return res.status(400).json({ error: 'Missing company parameter' });
    }

    const employee = await Employee.findOne({
      employee_id: req.params.employee_id,
      company                
    });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const payments = await Payroll.find({
      employee: employee._id,
      isDeleted: false
    }).lean();

    payments.forEach(p => {
      p.formatted_date = p.payDate.toISOString().slice(0, 10);
    });

    res.json(payments);
  } catch (err) {
    console.error("Error in GET /payments/:employee_id:", err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.get('/getPayment/:payment_id', async (req, res) => {
  try {
    const { company } = req.query;

    const payment = await Payroll.findById(req.params.payment_id).lean();
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const employeeBelongs = await Employee.exists({
      _id: payment.employee,
      company: company
    });

    if (!employeeBelongs) {
      return res.status(403).json({ error: 'Access denied' });
    }

    payment.formatted_date = new Date(payment.payDate).toISOString().slice(0, 10);
    res.json(payment);
  } catch (err) {
    console.error("Error in GET /getPayment/:payment_id:", err);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

app.post('/deletePayment/:payment_id', async (req, res) => {
  try {
    const { company } = req.query;
    if (!company) {
      return res.status(400).json({ error: 'Missing company parameter' });
    }

    const payment = await Payroll.findById(req.params.payment_id).lean();
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const employeeBelongs = await Employee.exists({
      _id: payment.employee,
      company: company
    });
    if (!employeeBelongs) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Payroll.findByIdAndUpdate(req.params.payment_id, { isDeleted: true });
    res.json({ message: 'Payment marked as deleted' });
  } catch (err) {
    console.error("Error in POST /deletePayment/:payment_id:", err);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

app.post("/getEmail", async (req, res) => {
  try {
    const employee = await Employee.findOne({ employee_id: req.body.employee_index_id });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json([{ email: employee.email }]);
  } catch (err) {
    console.error("Error in /getEmail:", err);
    res.status(500).json(err);
  }
});

app.post('/savePassword', async (req, res) => {
  try {
    const { password } = req.body;
    await PayrollAppConfig.findOneAndUpdate({}, { password }, { upsert: true });
    res.json({ message: 'Password saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save password' });
  }
});

app.post('/editPayment/:payment_id', async (req, res) => {
  try {
    const {
      payrollInfo = {},
      deductions = {},
      grossSalary,
      totalDeductions,
      total,
      overtimeDetails = {},
      payDate,
      paymentMode = 'Bank Transfer',
      isApproved = true
    } = req.body;

    console.log('⛔ payload.payrollInfo:', req.body.payrollInfo);
    console.log('⛔ payload.deductions: ', req.body.deductions);

    const parsed = new Date(payDate);
    if (isNaN(parsed)) {
      return res.status(400).json({ error: 'Invalid payDate' });
    }

    const update = {
      $set: {
        payDate: parsed,
        allowances: {
          overtimePay: overtimeDetails.total,
          mealAllowance: payrollInfo.mealAllow,
          birthdayBonus: payrollInfo.bdayBonus,
          incentives: payrollInfo.incentive,
          otherAdditions: payrollInfo.otherPayrollInfo
        },
        grossSalary,
        deductions: {
          tax: 0,
          sss: deductions.sss,
          philHealth: deductions.philHealth,
          pagIbig: deductions.pagIbig,
          healthCard: deductions.healthCard,
          cashAdvance: deductions.cashAdvance,
          lateHours: deductions.lateHours,
          absentDays: deductions.absentDays,
          otherDeductions: deductions.otherDeductions
        },
        totalDeductions,
        total,
        overtimeDetails,
        paymentMode,
        isApproved
      }
    };

    const updated = await Payroll.findByIdAndUpdate(
      req.params.payment_id,
      update,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Payroll not found' });
    }

    res.json({ message: 'Payment updated', updated });
  } catch (err) {
    console.error("❌ EditPayment Error:", err);
    res.status(500).json({ error: 'Failed to update payment', details: err.message });
  }
});

app.post('/addPayment', async (req, res) => {
  try {
    const {
      employee, payDate, payrollTimeframe,
      overtimeDetails = {},
      allowances, deductions, grossSalary,
      totalDeductions, total, paymentMode,
      payslipId, isApproved, isDeleted, dateGenerated,
      company
    } = req.body;

    if (!company) {
      return res.status(400).json({ error: 'Missing company in request' });
    }
    
    const emp = await Employee.findOne({ employee_id: employee, company }).lean();
    if (!emp) {
      return res.status(400).json({ error: `Employee ${employee} not found in company ${company}` });
    }

    const exists = await Payroll.findOne({ payslipId });
    if (exists) {
      return res.status(400).json({ error: "Duplicate payslipId. Payment already exists." });
    }

    const newPayment = new Payroll({
      employee: emp._id,
      overtimeDetails,
      payDate,
      payrollTimeframe,
      allowances,
      deductions,
      grossSalary,
      totalDeductions,
      total,
      paymentMode,
      payslipId,
      isApproved,
      isDeleted,
      dateGenerated
    });

    const saved = await newPayment.save();
    res.status(201).json({ message: "Payment added successfully", id: saved._id });

  } catch (err) {
    console.error("Error in POST /addPayment:", err);
    res.status(500).json({ error: 'Failed to add payment', details: err.message });
  }
});

app.post('/admin/login', async (req, res) => {
 try {
    console.log('🔍 Login endpoint hit!');
    console.log('🔑 JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('🔗 MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('🔍 Login request received:', req.body);
    const { username, password } = req.body;

    const admin = await Account.findOne({
      username,
      role: 'Administrator',
      isDeleted: false
    }).populate('company');

    if (!admin) {
      console.log('❌ Admin not found for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      console.log('❌ Password mismatch for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login successful, creating JWT token...');

    // CREATE JWT TOKEN
    const token = jwt.sign(
      { 
        username: admin.username, 
        companyId: admin.company._id,
        companyName: admin.company.name,
        userId: admin._id
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    console.log('✅ Sending response...');

    res.json({ username: admin.username, company: {name: admin.company.name, id: admin.company._id}});
  } catch (err) {
    console.error("❌ FULL ERROR in POST /admin/login:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/verify-auth', verifyToken, (req, res) => {
  res.json({ 
    success: true, 
    user: { 
      username: req.user.username, 
      companyId: req.user.companyId,
      companyName: req.user.companyName
    } 
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true, message: 'Logged out successfully' });
});
app.post('/changePassword', async (req, res) => {
  try {
    const { username, oldPass, newPass } = req.body;
    const account = await Account.findOne({ username: username });
    const comparePass = await checkPassword(oldPass, account.passwordHash);

    if(!comparePass){
      return res.status(401).send("Wrong old password");
    }

    if( oldPass == newPass ){
      return res.status(402).send("Same password");
    }

    const hashedPassword = await hashPassword(newPass);
    account.passwordHash = hashedPassword;
    await account.save();
    return res.status(200).send("Success");
  } catch (error) {
    console.error("Error in POST /changePassword:", error);
    return res.status(500).send("Server Error");
  }
});

// FIXED: Remove duplicate routes - keep only one
app.post('/admin/register', async (req, res) => {
  try {
    const { username, password, company } = req.body;
    if (!username || !password || !company) {
      return res.status(400).json({ error: 'username, password and company are all required' });
    }

    const userExists = await Account.findOne({
      username: { $regex: `^${username}$`, $options: 'i' }
    });
    if (userExists) {
      return res.sendStatus(409);
    }

    const hashedPassword = await hashPassword(password);
    const companyDoc = await Company
      .findOne({ name: company })
      .collation({ locale: 'en', strength: 2 })
      .select('_id');
    const account = new Account({ username: username, passwordHash: hashedPassword, company: companyDoc });

    await account.save();

    return res.status(201).json({
      username: account.username,
      company: account.company
    });
  } catch (err) {
    console.error("Error in POST /admin/register:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// FIXED: Remove duplicate - keep only one
app.get('/getEmployeeDetails/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let employee = null;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      employee = await Employee.findById(id).lean();
    }

    if (!employee) {
      employee = await Employee.findOne({ employee_id: req.params.id }).lean();
    }

    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    res.json({
      basicSalary: employee.basicSalary,
      overtimeRate: employee.overtimeRate,
    });
  } catch (err) {
    console.error("Error fetching employee details:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addEmployee', async (req, res) => {
  try {
    const {
      employee_id,
      company,
      status = 'Active',
      fname,
      middleName = '',
      lname,
      department,
      position,
      designation,
      basicSalary,
      bankAccount: {
        bankName,
        accountNumber,
        branch = ''
      },
      dateHired,
      phone,
      email,
      rbacProfile
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }

    const workingDaysInMonth = 22;
    const workHoursPerDay = 8;
    const overtimeMultiplier = 1.25;

    const dailyRate = basicSalary / workingDaysInMonth;
    const hourlyRate = dailyRate / workHoursPerDay;
    const overtimeRate = hourlyRate * overtimeMultiplier;

    const newEmployee = new Employee({
      employee_id,
      company: new mongoose.Types.ObjectId(company),
      status,
      fname,
      middleName,
      lname,
      department,
      position,
      designation,
      basicSalary,
      overtimeRate,
      bankAccount: {
        bankName,
        accountNumber,
        branch
      },
      dateHired: new Date(dateHired),
      phone,
      email,
      rbacProfile
    });

    const saved = await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully', id: saved._id });
  } catch (err) {
    console.error('Error in POST /addEmployee:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/editEmployee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee', details: error.message });
  }
});


app.get('/getCompanyRates', async (req, res) => {
  try {
    const { companyID } = req.query;
    if (!companyID) {
      return res.status(400).json({ error: 'Missing required query parameter `companyID`' });
    }
    if (!mongoose.Types.ObjectId.isValid(companyID)) {
      return res.status(400).json({ error: 'Invalid `companyID` format' });
    }

    // Fetch company info directly
    const company = await Company.findById(companyID).lean();
    if (!company) {
      return res.status(404).json({ error: `Company not found with id ${companyID}` });
    }

    const rates = {
      overtimeMultiplier: company.overtimeMultiplier || 1.25,
      workHoursPerDay: company.workHoursPerDay || 8,
      workingDaysPerMonth: company.workingDaysPerMonth || 22
    };

    return res.status(200).json(rates);
  } catch (err) {
    console.error('getCompanyRates error:', err);
    return res.status(500).json({ error: 'Internal server error in getCompanyRates' });
  }
});

app.post('/updateCompanyRates', async (req, res) => {
  try {
    const { company, overtimeMultiplier, workHoursPerDay, workingDaysPerMonth } = req.body;

    if (!company || !mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ error: 'Invalid or missing company ID' });
    }

    // Find company document
    const companyDoc = await Company.findById(company);
    if (!companyDoc) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Validate input (optional but recommended)
    if (overtimeMultiplier === undefined || workHoursPerDay === undefined || workingDaysPerMonth === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    companyDoc.overtimeMultiplier = Number(overtimeMultiplier);
    companyDoc.workHoursPerDay = Number(workHoursPerDay);
    companyDoc.workingDaysPerMonth = Number(workingDaysPerMonth);

    await companyDoc.save();

    return res.json({ message: 'Company rates updated successfully' });
  } catch (error) {
    console.error('Error updating company rates:', error);
    res.status(500).json({ error: 'Failed to update company rates', details: error.message });
  }
});





/* app.listen(port, async function() {
  await database();
  console.log(`Server: Running on http://localhost:${port}`);
}); */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 4000;
  app.listen(port, async function() {
    await database();
    console.log(`Server: Running on http://localhost:${port}`);
  });
}