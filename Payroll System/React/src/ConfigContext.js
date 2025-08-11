import { createContext, useEffect, useState } from 'react';
export const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';

// Context setup
export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({ // Using Default Values
    rate:                 0,   
    basic:                0,   
    workingDaysPerMonth: 22,    
    workHoursPerDay:       8,   
    overtimeMultiplier:  1.25, 
  });
  const [passwordHash, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    
    if (storedUsername && !username) {
      setUsername(storedUsername);
    }
    }, [username]);

  useEffect(() => {
      const companyId = sessionStorage.getItem('company');
      if (!companyId) return;

      fetch(`${BASE_URL}/getCompanyRates?companyID=${companyId}`)
        .then(res => {
          if (!res.ok) throw new Error(`Server error: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setConfig(prev => ({
            ...prev,
            overtimeMultiplier: Number(data.overtimeMultiplier) || prev.overtimeMultiplier,
            workHoursPerDay: Number(data.workHoursPerDay) || prev.workHoursPerDay,
            workingDaysPerMonth: Number(data.workingDaysPerMonth) || prev.workingDaysPerMonth,
          }));
        })
        .catch(err => {
          console.error("Error fetching company config:", err.message);
        });
    }, []);

  useEffect(() => {
    if (!selectedEmployeeId) {
      return;
    }

    fetch(`${BASE_URL}/getEmployeeDetails/${selectedEmployeeId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
       setConfig(prev => ({
          ...prev,
          basic: data.basicSalary  ?? prev.basic,
          rate:  data.overtimeRate ?? prev.rate,
        }));
      })
      .catch(err => {
        console.error("Error fetching employee config:", err.message);
      });
  }, [selectedEmployeeId]);


  //payroll configs
  const [userPayroll, setUserPayroll] = useState({
    payrollInfo: {
      date: '',
      ot: 0,
      salaryIncrease: 0,
      mealAllow: 0,
      bdayBonus: 0,
      incentive: 0,
      otherPayrollInfo: 0,
    },
    deductions: {
      sss: 0,
      philhealth: 0,
      pagibig: 0,
      cashAdvance: 0,
      healthCard: 0,
      lateHours: 0,
      absentDays: 0,
      otherDeductions: 0,
    },
  });

  const createUserPayment = (userId, paymentData) => {
    const userPayments = userPayroll[userId] || [];
    const paymentId = Date.now(); //payment id is timestamp to make it unique
    const newPayment = { paymentId, ...paymentData };
    setUserPayroll((payroll) => ({
      ...payroll,
      [userId]: [...userPayments, newPayment]
    }));
    console.log("Created new Payment", userId, paymentId, newPayment); //for debugging
  };

  // get all payments
  const getAllUserPayments = (userId) => userPayroll[userId] || [];

  //get user payment by ids
  const getUserPayment = (userId, paymentId) => {
    const userPayments = getAllUserPayments(userId);
    console.log("All payments of", paymentId, userPayments);
    const pay = userPayments.find(payment => { return payment.paymentId === paymentId; }) || null;
    console.log("Found Payment:", pay);  //for debugging
    return pay;
  };

  const saveUserPayment = (userId, paymentId, newData) => {
    setUserPayroll((payroll) => ({
      ...payroll,
      [userId]: payroll[userId].map((payment) =>
        payment.paymentId === paymentId ? { ...payment, ...newData } : payment
      ),
    }));
  };
  const deleteUserPayment = (userId, paymentId) => {
    setUserPayroll((payroll) => ({
      ...payroll,
      [userId]: payroll[userId].filter(payment => payment.paymentId !== paymentId)
    }));
    console.log("Deleted Payment", userId, paymentId);   //for debugging
  };


  return (
    <ConfigContext.Provider value={{
      config, setConfig,
      selectedEmployeeId, setSelectedEmployeeId,
      userPayroll, setUserPayroll, createUserPayment,
      getAllUserPayments, getUserPayment, saveUserPayment, deleteUserPayment,
      passwordHash, setPassword, username, setUsername
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
