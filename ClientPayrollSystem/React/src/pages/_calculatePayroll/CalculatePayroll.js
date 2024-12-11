export const calculatePayroll = (payrollInfo, deductions, config) => {
    const { ot, salaryIncrease, mealAllow, bdayBonus, incentive, otherPayrollInfo } = payrollInfo;
    const { sss, philhealth, pagibig, cashAdvance, healthCard, absences, otherDeductions } = deductions;
    const payroll_total = parseFloat(ot * config.rate) + parseFloat(salaryIncrease) + parseFloat(mealAllow) +
        parseFloat(bdayBonus) + parseFloat(incentive) + parseFloat(otherPayrollInfo)
        + parseFloat(config.basic);
    const deductions_total = parseFloat(sss) + parseFloat(philhealth) + parseFloat(pagibig) + parseFloat(cashAdvance) + parseFloat(healthCard) +
        parseFloat(absences) + parseFloat(otherDeductions);
    const total = payroll_total - deductions_total;

    return {
        payroll: payroll_total,
        deductions: deductions_total,
        total: total,
    };
};
