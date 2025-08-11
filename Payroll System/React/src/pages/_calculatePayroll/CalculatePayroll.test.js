import { calculatePayroll } from './CalculatePayroll';

describe('calculatePayroll', () => {
  const config = {
    basic: 20000,
    workingDaysPerMonth: 20,
    workHoursPerDay: 8,
    overtimeMultiplier: 1.25,
  };

  const payrollInfo = {
    ot: 10,
    mealAllow: 500,
    bdayBonus: 1000,
    incentive: 1500,
    otherPayrollInfo: 200,
  };

  const deductions = {
    tax: 1000,
    sss: 500,
    philHealth: 300,
    pagIbig: 200,
    cashAdvance: 1000,
    healthCard: 400,
    lateHours: 2,
    absentDays: 1,
    otherDeductions: 250,
  };

  it('calculates payroll correctly with full data', () => {
    const result = calculatePayroll(payrollInfo, deductions, config);

    const hourlyRate = 20000 / (20 * 8); // 125
    const dailyRate = 20000 / 20; // 1000
    const overtimeRate = hourlyRate * 1.25; // 125 * 1.25 = 156.25
    const otPay = 10 * 156.25; // 1562.5
    const additions = 1562.5 + 500 + 1000 + 1500 + 200; // 4762.5
    const payrollTotal = 20000 + additions; // 24762.5

    const lateDeduction = 2 * 125; // 250
    const absentDeduction = 1 * 1000; // 1000
    const deductionTotal = 1000 + 500 + 300 + 200 + 1000 + 400 + 250 + 1000 + 250; // 4900

    const expectedTotal = payrollTotal - deductionTotal; // 19862.5

    expect(result.basic).toBe(20000);
    expect(result.additions).toBeCloseTo(4762.5);
    expect(result.payroll).toBeCloseTo(24762.5);
    expect(result.deductions).toBeCloseTo(4900);
    expect(result.total).toBeCloseTo(19862.5);

    expect(result.overtimeDetails).toEqual({
      hours: 10,
      rate: 156.25,
      total: 1562.5,
    });

    expect(result.hourlyRate).toBeCloseTo(125);
    expect(result.dailyRate).toBeCloseTo(1000);
    expect(result.lateDeduction).toBeCloseTo(250);
    expect(result.absentDeduction).toBeCloseTo(1000);
  });

  it('handles missing or zero inputs correctly', () => {
    const result = calculatePayroll({}, {}, {});

    expect(result.basic).toBe(0);
    expect(result.additions).toBe(0);
    expect(result.payroll).toBe(0);
    expect(result.deductions).toBe(0);
    expect(result.total).toBe(0);
    expect(result.overtimeDetails).toEqual({ hours: 0, rate: 0, total: 0 });
    expect(result.hourlyRate).toBe(0);
    expect(result.dailyRate).toBe(0);
    expect(result.lateDeduction).toBe(0);
    expect(result.absentDeduction).toBe(0);
  });

  it('handles string inputs by parsing them to numbers', () => {
    const result = calculatePayroll(
      { ot: '2', mealAllow: '100' },
      { tax: '50', lateHours: '1', absentDays: '1' },
      { basic: '8000', workingDaysPerMonth: '20', workHoursPerDay: '8', overtimeMultiplier: '2' }
    );

    const hourlyRate = 8000 / (20 * 8); // 50
    const dailyRate = 8000 / 20; // 400
    const overtimeRate = 50 * 2; // 100
    const otPay = 2 * 100; // 200

    const additions = 200 + 100; // 300
    const payrollTotal = 8000 + 300; // 8300
    const lateDeduction = 1 * 50; // 50
    const absentDeduction = 1 * 400; // 400
    const deductionsTotal = 50 + 50 + 400; // 500

    const expectedTotal = 8300 - 500; // 7800

    expect(result.total).toBeCloseTo(7800);
    expect(result.hourlyRate).toBeCloseTo(50);
    expect(result.dailyRate).toBeCloseTo(400);
    expect(result.overtimeDetails.total).toBeCloseTo(200);
  });
});
