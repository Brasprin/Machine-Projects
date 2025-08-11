export const calculatePayroll = (payrollInfo = {}, deductions = {}, config = {}) => {
  const toNumber = (val) => parseFloat(val) || 0;

  // Destructure config defaults
  const basic           = toNumber(config.basic);
  const workingDays     = toNumber(config.workingDaysPerMonth);
  const workHoursPerDay = toNumber(config.workHoursPerDay);
  const otMultiplier    = toNumber(config.overtimeMultiplier);

  // Derived rates
  const hourlyRate = (workingDays && workHoursPerDay)
    ? basic / (workingDays * workHoursPerDay)
    : 0;

  const dailyRate = workingDays
    ? basic / workingDays
    : 0;
  const overtimeRate = hourlyRate * otMultiplier;

  // Overtime
  const otHours = toNumber(payrollInfo.ot);
  const otPay   = otHours * overtimeRate;

  // Allowances/Additions
  const meal     = toNumber(payrollInfo.mealAllow);
  const bday     = toNumber(payrollInfo.bdayBonus);
  const incent   = toNumber(payrollInfo.incentive);
  const otherAdd = toNumber(payrollInfo.otherPayrollInfo);

  const payroll_total = basic + otPay + meal + bday + incent + otherAdd;

  // Raw deductions
  const tax           = toNumber(deductions.tax);
  const sss           = toNumber(deductions.sss);
  const philHealth    = toNumber(deductions.philHealth);
  const pagIbig       = toNumber(deductions.pagIbig);
  const cashAdvance   = toNumber(deductions.cashAdvance);
  const healthCard    = toNumber(deductions.healthCard);
  const lateHours     = toNumber(deductions.lateHours);
  const absentDays    = toNumber(deductions.absentDays);
  const otherDeducts  = toNumber(deductions.otherDeductions);

  // Money‐amount deductions
  const lateDeduction   = lateHours  * hourlyRate;
  const absentDeduction = absentDays * dailyRate;

  const deductions_total =
    tax + sss + philHealth + pagIbig +
    cashAdvance + healthCard +
    lateDeduction + absentDeduction +
    otherDeducts;

  const total = payroll_total - deductions_total;

  return {
    basic,                             
    additions: payroll_total - basic,   
    payroll: payroll_total,
    deductions: deductions_total,
    total,
    overtimeDetails: { hours: otHours, rate: overtimeRate, total: otPay },
    hourlyRate,                       
    dailyRate,                     
    lateDeduction,                   
    absentDeduction                 
  };
};

