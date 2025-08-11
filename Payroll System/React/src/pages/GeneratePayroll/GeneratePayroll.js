
import jsPDF from 'jspdf';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL, ConfigContext } from '../../ConfigContext';
import global from '../../global.module.css';
import { calculatePayroll } from '../_calculatePayroll/CalculatePayroll';
import DeductionsInfo from '../_deductionsInfo/DeductionsInfo';
import Header from '../_header/Header';
import PayrollInfo from '../_payrollInfo/PayrollInfo';
import ResultsInfo from '../_resultsInfo/ResultsInfo';
import Sidebar from '../_sidebar/Sidebar';
import styles from './GeneratePayroll.module.css';

const GeneratePayroll = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    const dateToday = `${yyyy}-${mm}-${dd}`;
    const { id, fname, lname } = useParams();
    const { config, createUserPayment } = useContext(ConfigContext);
    const [showResults, setShowResults] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');
    const [showDownloadButtons, setShowDownloadButtons] = useState(false);
    const [placeholderFile, setPlaceholderFile] = useState(null);
    const [savedStatus, setSavedStatus] = useState(null);
    const [ email, setEmail ] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const { setSelectedEmployeeId } = useContext(ConfigContext);
    

    useEffect(() => {
    const employee_index_id = { employee_index_id: id };
    
    setSelectedEmployeeId(id);
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


    const [payrollInfo, setPayrollInfo] = useState({
        date: dateToday,
        ot: 0,
        salaryIncrease: 0,
        mealAllow: 0,
        bdayBonus: 0,
        incentive: 0,
        otherPayrollInfo: 0
    });
    const [deductions, setDeductions] = useState({
        sss: 0,
        philHealth: 0,
        pagIbig: 0,
        cashAdvance: 0,
        healthCard: 0,
        lateHours: 0,
        absentDays: 0,
        otherDeductions: 0
    });
    const [results, setResults] = useState({
        payroll: 0,
        deductions: 0,
        total: 0
    });


    const otHours = parseFloat(payrollInfo.ot) || 0;
    const basic = parseFloat(config.basic) || 0;
    const workingDays = parseFloat(config.workingDaysPerMonth) || 22;
    const workHoursPerDay = parseFloat(config.workHoursPerDay) || 8;
    const multiplier = parseFloat(config.overtimeMultiplier) || 1.25;

    const hourlyRate = basic / (workingDays * workHoursPerDay);
    const otRate = hourlyRate * multiplier;
    const otTotal = otHours * otRate;
    
    const saveToDB = () => {
    console.log("💬 Saving payroll for employee:", id);
    console.log("💬 Current results:", results);

    // 1) Build the nested allowances object from your form state
    const allowances = {
        overtimePay: otTotal,
        mealAllowance:  payrollInfo.mealAllow,
        birthdayBonus:  payrollInfo.bdayBonus,
        incentives:     payrollInfo.incentive,
        otherAdditions: payrollInfo.otherPayrollInfo
    };

    // 3) Pull your computed numbers out of `results`
    const basicSalary    = parseFloat(config.basic)     || 0;
    const additionsTotal = results.payroll - basicSalary;
    const grossSalary     = results.payroll;
    const totalDeductions = results.deductions;
    const total           = results.total;

    // 4) Build the nested deductions object
    const nestedDeductions = {
        tax:             0,                  // flat zero, unless you have a tax field
        sss:             deductions.sss,
        philHealth:      deductions.philHealth,
        pagIbig:         deductions.pagIbig,
        healthCard:      deductions.healthCard,
        cashAdvance:     deductions.cashAdvance,
        lateHours:      deductions.lateHours,
        absentDays:     deductions.absentDays,
        otherDeductions: deductions.otherDeductions
    };

    // 5) A simple payslipId — must be unique per date/employee
    const payslipId = `PS${id}-${payrollInfo.date.replace(/-/g, "")}-${today}`;


    // 6) Compose final payload
    const payload = {
        employee:         id,                    
        payDate:          payrollInfo.date,      // e.g. "2025-07-04"
        payrollTimeframe: "Monthly",             // or wire this up to a dropdown
        allowances,
        overtimeDetails: {
            hours: otHours,
            rate:  otRate,
            total: otTotal
        },
        grossSalary,
        deductions:       nestedDeductions,
        totalDeductions,
        total,
        paymentMode:      "Bank Transfer",       // or wire to UI
        payslipId,
        isApproved:       true,                  // default approval
        dateGenerated:    payrollInfo.date,
        isDeleted:        false,
        company: sessionStorage.getItem('company')
    };

    console.log("📤 POST payload:", payload);

    fetch(`${BASE_URL}/addPayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
        .then(res => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        return res.json();
        })
        .then(data => {
        console.log("Saved payroll:", data);
        setSavedStatus('Saved to Database!');
        handleFadeOut();
        })
        .catch(err => {
        console.error("Error saving payroll:", err);
        setSavedStatus('Save failed');
        handleFadeOut();
        });
    };

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
        } = calculatePayroll(payrollInfo, deductions, config);
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

    const sendEmail = () => {
        const hardcodedEmail = email; // hardcoded for testing purposes, change if you want to try out
        console.log(email);

        const subject = "Payroll Slip";
        const body = "Please see attached file";

        const encodedEmail = encodeURIComponent(hardcodedEmail);
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedBody}`;
        window.open(gmailUrl, '_blank');
    };

    const showPayrollResults = () => {
        setResults(calculatePayroll(payrollInfo, deductions, config));
        setShowResults(true);
        setShowDownloadButtons(false); // Reset the visibility of download/email buttons
        setSavedStatus('');
    };

    const createUserPaymentData = () => {
        const newData = { payrollInfo, deductions };
        createUserPayment(id, newData);
        setSavedMessage(true);
        setTimeout(() => {
            setSavedMessage(false);
        }, 5000);
    };
    const handleFadeOut = () => {
        setIsVisible(false); 
        setTimeout(() => setIsVisible(true)); 
      };

    return (
        <div className={global.wrapper}>
            <Sidebar></Sidebar>
            <div>
                <Header></Header>
                <div className={`${styles.container} ${global.mainContent}`}>
                    <h1><span className={global.title}>Generate Payroll for {fname} {lname}</span></h1>

                    <div className={styles.box}>
                        <span id={styles.infoTitle}>INPUT ALL THE INFORMATION NEEDED</span>
                        <div className={styles.infoSection}>
                            <div className={styles.formsSection}>
                                <PayrollInfo payrollInfo={payrollInfo} setPayrollInfo={setPayrollInfo} />
                                <DeductionsInfo deductions={deductions} setDeductions={setDeductions} />
                                <div className={styles.buttonContainer}>
                                    <button className={styles.button} onClick={() => { showPayrollResults(); }}>
                                        CALCULATE
                                    </button>
                                </div>
                            </div>

                            <div className={styles.resultSection}>
                                {showResults && (<ResultsInfo results={results} />)}
                                {showResults && (
                                    <div>
                                    <div className={styles.buttonContainer}>
                                        <button className={styles.button} onClick={() => { generateEmail(); createUserPaymentData(); saveToDB(); handleFadeOut();}}>Download/Email/Save</button>
                                    </div>
                                        <span className={`${styles.buttonContainer} ${isVisible ? global.fadeOut : global.opacity0}`}>{savedStatus}</span>
                                    </div>
                                )}
                                {showResults && showDownloadButtons && placeholderFile && (
                                    <div className={styles.buttonContainer}>
                                        <button className={styles.button}>
                                            <a href={placeholderFile} download="PayrollSlip.pdf" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                Download Payroll Slip
                                            </a>
                                        </button>
                                    </div>
                                )}
                                {showResults && showDownloadButtons && placeholderFile && (
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

export default GeneratePayroll;
