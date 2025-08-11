
import jsPDF from 'jspdf';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL, ConfigContext } from '../../ConfigContext';
import global from '../../global.module.css';
import { calculatePayroll } from '../_calculatePayroll/CalculatePayroll';
import DeductionsInfo from '../_deductionsInfo/DeductionsInfo';
import Header from '../_header/Header';
import PayrollInfo from '../_payrollInfo/PayrollInfo';
import ResultsInfo from '../_resultsInfo/ResultsInfo';
import Sidebar from '../_sidebar/Sidebar';
import styles from './EditPayroll.module.css';

const EditPayroll = () => {
  const navigate = useNavigate();
  const { id, payment_id, fname, lname } = useParams();  // params passed from previous pages
  const { config } = useContext(ConfigContext);
  const defaultPayrollInfo = {
    date: '',
    ot: 0,
    salaryIncrease: 0,
    mealAllow: 0,
    bdayBonus: 0,
    incentive: 0,
    otherPayrollInfo: 0
  };

  const defaultDeductions = {
    sss: 0,
    philHealth: 0,
    pagIbig: 0,
    cashAdvance: 0,
    healthCard: 0,
    lateHours: 0,
    absentDays: 0,
    otherDeductions: 0
  };

  const [payrollInfo, setPayrollInfo] = useState(defaultPayrollInfo);
  const [deductions, setDeductions] = useState(defaultDeductions);

  const [results, setResults] = useState({ payroll: 0, deductions: 0, total: 0 });
  const [defaults, setDefaults] = useState(config);
  const [savedStatus, setSavedStatus] = useState("Saved to Database!");
  const [isVisible, setIsVisible] = useState(false);
  const [showDownloadButtons, setShowDownloadButtons] = useState(false);
  const [placeholderFile, setPlaceholderFile] = useState(null);
  const [email, setEmail] = useState();

  const otHours = parseFloat(payrollInfo.ot) || 0;
  const otRate = parseFloat(defaults.rate) || 0;
  const otTotal = otHours * otRate;

  // Fetch employee email
  useEffect(() => {
    if (!id) return;
    
    const employee_index_id = { employee_index_id: id };
    
    fetch(`${BASE_URL}/getEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee_index_id),
    })
        .then(res => res.json())
        .then(data => {
        if (data.length > 0 && data[0].email) {
            setEmail(data[0].email);
        } else {
            console.warn("No email found for employee");
        }
        })
        .catch(err => console.log("Error fetching email:", err));
  }, [id]);

  // save new values to DB
  const saveUserPayrollData = () => {
    const newResults = calculatePayroll(payrollInfo, deductions, defaults);
    setResults(newResults);

    const editedPayment = {
      payDate: payrollInfo.date,  
      basicSalary:   newResults.basic,  
      additions:     newResults.additions,
      allowances: {
          overtimePay: otTotal,
          mealAllowance: payrollInfo.mealAllow,
          birthdayBonus: payrollInfo.bdayBonus,
          incentives: payrollInfo.incentive,
          otherAdditions: payrollInfo.otherPayrollInfo
        },
        overtimeDetails: {
          hours: otHours,
          rate: otRate,
          total: otTotal
        },
      grossSalary:    newResults.payroll,
      totalDeductions:newResults.deductions,

      deductions: {
        tax:           0,               
        sss:           deductions.sss,
        philHealth:    deductions.philHealth,
        pagIbig:       deductions.pagIbig,
        healthCard:    deductions.healthCard,
        cashAdvance:   deductions.cashAdvance,
        lateHours:    deductions.lateHours,
        absentDays:     deductions.absentDays,
        otherDeductions: deductions.otherDeductions
      },

      total:         newResults.total,    
      paymentMode:   defaults.paymentMode || 'Bank Transfer',
      isApproved:    true,

      payrollInfo,
      deductions
    };

    fetch(`${BASE_URL}/editPayment/${payment_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedPayment)
    })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);

    handleFadeOut();
  };

  // Generate PDF function (same as GeneratePayroll)
  const generateEmail = () => {
    const {
      basic:        basicSalary,
      additions:    additionsTotal,
      payroll:      grossSalary,
      deductions:   totalDeductions,
      total,
      hourlyRate,
      dailyRate,
      lateDeduction,
      absentDeduction,
      overtimeDetails
    } = calculatePayroll(payrollInfo, deductions, defaults);
    
    const doc = new jsPDF({
        unit: 'mm', 
        format: [216, 330], 
        orientation: 'portrait'
    });

    // Can change payslip format and design here
    // Title and Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Payslip", 105, 15, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(10, 20, 205, 20);

    // Employee Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Employee Name: ${fname} ${lname}`, 10, 30);
    doc.text(`Date: ${payrollInfo.date}`, 170, 30);

    // Payroll Information Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Payroll Information", 10, 40);
    doc.setLineWidth(0.2);
    doc.line(10, 42, 205, 42);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let yPosition = 50;
    const payrollDetails = [
        `Overtime Hours: ${otHours}`,
         `Overtime Pay: ${otTotal.toFixed(2)}`,
        `Meal Allowance: ${parseFloat(payrollInfo.mealAllow).toFixed(2)}`,
        `Birthday Bonus: ${parseFloat(payrollInfo.bdayBonus).toFixed(2)}`,
        `Incentive: ${parseFloat(payrollInfo.incentive).toFixed(2)}`,
        `Other Payroll Info: ${parseFloat(payrollInfo.otherPayrollInfo).toFixed(2)}`  
    ];

    payrollDetails.forEach(detail => {
        doc.text(detail, 12, yPosition);
        yPosition += 10;
    });

    // Deductions Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Deductions", 10, yPosition + 5);
    doc.line(10, yPosition + 7, 205, yPosition + 7);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    yPosition += 15;
    const deductionDetails = [
        `SSS: ${parseFloat(deductions.sss).toFixed(2)}`,
        `philHealth: ${parseFloat(deductions.philHealth).toFixed(2)}`,
        `Pag-IBIG: ${parseFloat(deductions.pagIbig).toFixed(2)}`,
        `Cash Advance: ${parseFloat(deductions.cashAdvance).toFixed(2)}`,
        `Health Card: ${parseFloat(deductions.healthCard).toFixed(2)}`,
        `Late Hours: ${deductions.lateHours}`,
        `Late Deduction: ${lateDeduction.toFixed(2)}`,
        `Day Absents: ${deductions.absentDays}`,
        `Absent Deduction ${absentDeduction.toFixed(2)}`,
        `Other Deductions: ${parseFloat(deductions.otherDeductions).toFixed(2)}`
    ];

    deductionDetails.forEach(detail => {
        doc.text(detail, 12, yPosition);
        yPosition += 10;
    });

    // Summary Section
    doc.setLineWidth(0.5);
    doc.line(10, yPosition + 5, 205, yPosition + 5);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 10, yPosition + 15);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    yPosition += 25;
    // UPDATED to use the computed values:
    doc.text(`Basic Salary: ${basicSalary.toFixed(2)}`,         10, yPosition);
    doc.text(`Additions / Allowances: ${additionsTotal.toFixed(2)}`, 10, yPosition + 10);
    doc.text(`Gross Salary: ${grossSalary.toFixed(2)}`,         10, yPosition + 20);
    doc.text(`Deductions: ${totalDeductions.toFixed(2)}`,       10, yPosition + 30);

    // Highlight Net Pay
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Pay: ${total.toFixed(2)}`,                    157, yPosition + 57);

    // Border around Net Pay
    doc.setLineWidth(1);
    doc.rect(10, yPosition + 40, 200, 30);

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPlaceholderFile(url);

    // Show the download/email buttons
    setShowDownloadButtons(true);
  };

  // Send email function (same as GeneratePayroll)
  const sendEmail = () => {
    const hardcodedEmail = email;
    console.log(email);

    const subject = "Payroll Slip";
    const body = "Please see attached file";

    const encodedEmail = encodeURIComponent(hardcodedEmail);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, '_blank');
  };

  // setup prev values into input boxes
  useEffect(() => {
    if (!payment_id) return;
    
    const company = sessionStorage.getItem('company');

    fetch(`${BASE_URL}/getPayment/${payment_id}?company=${encodeURIComponent(company)}`)
      .then(res => res.json())
      .then(data => {
        const prevPayroll = {
          date: new Date(data.payDate).toISOString().slice(0,10),
          ot: data.overtimeDetails?.hours ?? 0,
          salaryIncrease: data.salaryIncrease ?? 0,
          mealAllow: data.allowances?.mealAllowance ?? 0,
          bdayBonus: data.allowances?.birthdayBonus ?? 0,
          incentive: data.allowances?.incentives ?? 0,
          otherPayrollInfo: data.allowances?.otherAdditions ?? 0,
        };

        const prevDeductions = {
          sss: data.deductions?.sss ?? 0,
          philHealth: data.deductions?.philHealth ?? 0,
          pagIbig: data.deductions?.pagIbig ?? 0,
          cashAdvance: data.deductions?.cashAdvance ?? 0,
          healthCard: data.deductions?.healthCard ?? 0,
          lateHours: data.deductions?.lateHours ?? 0,
          absentDays: data.deductions?.absentDays ?? 0,
          otherDeductions: data.deductions?.otherDeductions ?? 0,
        };

        // Fetch the employee's current config using `data.employee`
        if (data.employee) {
          fetch(`${BASE_URL}/getEmployeeDetails/${data.employee}`)
            .then(res => res.json())
            .then(emp => {
              const empConfig = {
                basic: emp.basicSalary  ?? 0,
                rate:  emp.overtimeRate ?? 0,
  
                workingDaysPerMonth: config.workingDaysPerMonth,
                workHoursPerDay:     config.workHoursPerDay,
                overtimeMultiplier:  config.overtimeMultiplier
              };

              const calc = calculatePayroll(prevPayroll, prevDeductions, empConfig);

              setPayrollInfo(prevPayroll);
              setDeductions(prevDeductions);
              setResults(calc);
              setDefaults(empConfig);
            });
        } else {
          console.warn("⚠️ No employee ID found in payment record");
        }
      })
      .catch(err => console.error("❌ Error fetching payment:", err));
  }, [payment_id]);

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
                <div className={styles.buttonContainer}>
                  <button className={styles.button} onClick={generateEmail}>Generate PDF</button>
                </div>
              </div>
              <div className={styles.resultSection}>
                <ResultsInfo results={results} />
                <div className={`${styles.formGroup} ${isVisible ? global.fadeOut : global.opacity0}`}>
                    <span> {savedStatus} </span>
                </div>
                
                {/* Download and Email buttons - only show when PDF is generated */}
                {showDownloadButtons && placeholderFile && (
                  <div className={styles.buttonContainer}>
                    <button className={styles.button}>
                      <a href={placeholderFile} download="PayrollSlip.pdf" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Download Payroll Slip
                      </a>
                    </button>
                  </div>
                )}
                {showDownloadButtons && placeholderFile && (
                  <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={sendEmail}>Email File</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditPayroll;
