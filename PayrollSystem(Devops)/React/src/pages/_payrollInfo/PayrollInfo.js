import styles from './PayrollInfo.module.css';

const checkNumberInput = (e, setState, field) => {
  let value = Math.max(0, parseFloat(e.target.value).toFixed(2) || 0);
  setState((prevState) => ({
    ...prevState,
    [field]: value,
  }));
};

const handleBlur = (e, setState, field) => {
  if (isNaN(parseFloat(e.target.value).toFixed(2))) {
    setState((prevState) => ({
      ...prevState,
      [field]: 0,
    }));
  }
};

const PayrollInfo = ({ payrollInfo, setPayrollInfo }) => (
  <div className={styles.formSection}>
    <div className={styles.formGroup}>
      <label htmlFor="date">Date:</label>
      <input
        id="date"
        type="date"
        value={payrollInfo.date ?? ''}
        onChange={(e) => setPayrollInfo({ ...payrollInfo, date: e.target.value })}
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="ot">Overtime (in Hours):</label>
      <input
        id="ot"
        type="number"
        value={payrollInfo.ot ?? 0}
        onChange={(e) => checkNumberInput(e, setPayrollInfo, "ot")}
        onBlur={(e) => handleBlur(e, setPayrollInfo, "ot")}
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="mealAllow">Meal Allowance:</label>
      <input
        id="mealAllow"
        type="number"
        value={payrollInfo.mealAllow ?? 0}
        onChange={(e) => checkNumberInput(e, setPayrollInfo, "mealAllow")}
        onBlur={(e) => handleBlur(e, setPayrollInfo, "mealAllow")}
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="bdayBonus">Birthday Bonus:</label>
      <input
        id="bdayBonus"
        type="number"
        value={payrollInfo.bdayBonus ?? 0}
        onChange={(e) => checkNumberInput(e, setPayrollInfo, "bdayBonus")}
        onBlur={(e) => handleBlur(e, setPayrollInfo, "bdayBonus")}
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="incentive">Incentive:</label>
      <input
        id="incentive"
        type="number"
        value={payrollInfo.incentive ?? 0}
        onChange={(e) => checkNumberInput(e, setPayrollInfo, "incentive")}
        onBlur={(e) => handleBlur(e, setPayrollInfo, "incentive")}
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="otherPayrollInfo">Others:</label>
      <input
        id="otherPayrollInfo"
        type="number"
        value={payrollInfo.otherPayrollInfo ?? 0}
        onChange={(e) => checkNumberInput(e, setPayrollInfo, "otherPayrollInfo")}
        onBlur={(e) => handleBlur(e, setPayrollInfo, "otherPayrollInfo")}
      />
    </div>
 
  </div>
);

export default PayrollInfo;

