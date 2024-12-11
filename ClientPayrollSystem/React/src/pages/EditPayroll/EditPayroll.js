import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../_sidebar/Sidebar';
import PayrollInfo from '../_payrollInfo/PayrollInfo';
import DeductionsInfo from '../_deductionsInfo/DeductionsInfo';
import ResultsInfo from '../_resultsInfo/ResultsInfo';
import { calculatePayroll } from '../_calculatePayroll/CalculatePayroll';
import styles from './EditPayroll.module.css'
import Header from '../_header/Header';
import global from '../../global.module.css';
import { ConfigContext, BASE_URL } from '../../ConfigContext';

const EditPayroll = () => {
  const navigate = useNavigate();
  const { id, payment_id, fname, lname } = useParams();  // params passed from previous pages
  const { config } = useContext(ConfigContext);
  const { getUserPayment, saveUserPayment } = useContext(ConfigContext);
  const userSavedPayment = getUserPayment(id, payment_id) || { payrollInfo: {}, deductions: {} };
  const [payrollInfo, setPayrollInfo] = useState(userSavedPayment.payrollInfo);
  const [deductions, setDeductions] = useState(userSavedPayment.deductions);
  const [results, setResults] = useState(calculatePayroll(payrollInfo, deductions, config));
  const [defaults, setDefaults] = useState(config);
  const [savedStatus, setSavedStatus] = useState("Saved to Database!");
  const [isVisible, setIsVisible] = useState(false);

  // save new values to DB
  const saveUserPayrollData = () => {
    // show results on UI
    const newResults = calculatePayroll(payrollInfo, deductions, defaults);
    setResults(newResults);

    // save to DB
    const editedPayment = {
      employee_index_id: id,
      rate: defaults.rate,
      basic: defaults.basic,
      payrollInfo, 
      deductions,
      results: newResults
    };
    fetch(`${BASE_URL}/editPayment/${payment_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedPayment),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));

    handleFadeOut();

  };

  // setup prev values into input boxes
  useEffect (()=>{
    fetch(`${BASE_URL}/getPayment/${payment_id}`)
    .then(res => res.json())
    .then(data => {
      const prevPayroll = {
        date: data[0].formatted_date,
        ot: data[0].overtimeDays,
        salaryIncrease: data[0].salaryIncrease,
        mealAllow: data[0].mealAllowance, 
        bdayBonus: data[0].birthdayBonus,
        incentive: data[0].incentive,
        otherPayrollInfo: data[0].otherAdditions
      }
      const prevDeductions = {
        sss: data[0].sss,
        philhealth: data[0].philHealth,
        pagibig: data[0].pagIbig,
        cashAdvance: data[0].cashAdvance,
        healthCard: data[0].healthCard, 
        absences: data[0].lateAbsent,
        otherDeductions: data[0].otherDeductions
      }
      const results = {
        payroll: data[0].payroll,
        deductions: data[0].deductions,
        total: data[0].total
      }
      const defaults = {
        rate: data[0].rate,
        basic: data[0].basic
      }
      setPayrollInfo(prevPayroll);
      setDeductions(prevDeductions);
      setResults(results);
      setDefaults(defaults);
      console.log(data);
    })
    .catch(err => console.log(err));
  }, [])


  const handleFadeOut = () => {
    setIsVisible(false); 
    setTimeout(() => setIsVisible(true)); 
  };

  const checkNumberInput = (e, setState, field) => {
    const value = Math.max(0, parseFloat(e.target.value).toFixed(2) || 0);
    setState((prevState) => ({
        ...prevState,
        [field]: value,
    }));
  };

  const handleBlur = (e, setState, field) => {
      if (isNaN(parseFloat(e.target.value).toFixed(2))) {
          console.log('pain');
          setState((prevState) => ({
              ...prevState,
              [field]: 0,
          }));
      }
  };

  return (
    <div className={global.wrapper}>
      <Sidebar></Sidebar>
      <div>
        <Header></Header>

        <div className={`${styles.container} ${global.mainContent}`}>
          <h1><span className={global.title}>Edit Payroll for {fname} {lname}</span></h1>

          <div className={styles.box}>
            <span id={styles.infoTitle}>INPUT ALL THE INFORMATION NEEDED</span>
            <div className={styles.infoSection}>
              <div className={styles.formsSection}>
                <PayrollInfo payrollInfo={payrollInfo} setPayrollInfo={setPayrollInfo} />
                <DeductionsInfo deductions={deductions} setDeductions={setDeductions} />
                <div className={styles.buttonContainer}>
                  <button className={styles.button} onClick={saveUserPayrollData}>SAVE</button>
                </div>
              </div>

              <div className={styles.resultSection}>
                <div className={styles.formGroup}>
                  <label>RATE: </label>
                  <input value={defaults.rate} 
                      type='number' 
                      onChange={(e) => checkNumberInput(e, setDefaults, "rate")}
                      onBlur={(e) => handleBlur(e, setDefaults, "rate")}
                      />
                </div>
                <div className={styles.formGroup}>
                    <label>BASIC: </label>
                    <input value={defaults.basic} 
                      type="number" 
                      onChange={(e) => checkNumberInput(e, setDefaults, "basic")}
                      onBlur={(e) => handleBlur(e, setDefaults, "basic")}
                      />
                </div>
                <br></br>
                <div className={styles.formSection}><span>RESULTS</span></div>
                <ResultsInfo results={results} />
                <div className={`${styles.formGroup} ${isVisible ? global.fadeOut : global.opacity0}`}>
                    <span> {savedStatus} </span>
                </div>
              </div>
           
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditPayroll;