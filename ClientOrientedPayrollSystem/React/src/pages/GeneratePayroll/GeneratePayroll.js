import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../_sidebar/Sidebar';
import PayrollInfo from '../_payrollInfo/PayrollInfo';
import DeductionsInfo from '../_deductionsInfo/DeductionsInfo';
import ResultsInfo from '../_resultsInfo/ResultsInfo';
import { calculatePayroll } from '../_calculatePayroll/CalculatePayroll';
import styles from './GeneratePayroll.module.css';
import global from '../../global.module.css';
import Header from '../_header/Header';
import { ConfigContext, BASE_URL } from '../../ConfigContext';
import jsPDF from 'jspdf';

const GeneratePayroll = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    const dateToday = `${yyyy}-${mm}-${dd}`;
    const { id, fname, lname } = useParams();
    const { config, createUserPayment } = useContext(ConfigContext);
    const [showResults, setShowResults] = useState(false);
    const [savedMessage, setSavedMessage] = useState(false);
    const [showDownloadButtons, setShowDownloadButtons] = useState(false);
    const [placeholderFile, setPlaceholderFile] = useState(null);
    const [savedStatus, setSavedStatus] = useState(null);
    const [ email, setEmail ] = useState();
    const [isVisible, setIsVisible] = useState(false);

    useEffect (()=>{
        const employee_index_id = {employee_index_id:id};
        fetch(`${BASE_URL}/getEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee_index_id),
        })
        .then(res => res.json())
        .then(data => {
          setEmail(data[0].email);
        })
        .catch(err => console.log(err));
      }, [])

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
        philhealth: 0,
        pagibig: 0,
        cashAdvance: 0,
        healthCard: 0,
        absences: 0,
        otherDeductions: 0
    });
    const [results, setResults] = useState({
        payroll: 0,
        deductions: 0,
        total: 0
    });

    const generateEmail = () => {
        const doc = new jsPDF();

        // Can change payslip format and design here
        // Title and Header
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Payslip", 105, 15, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(10, 20, 200, 20);

        // Employee Information
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Employee Name: ${fname} ${lname}`, 10, 30);
        doc.text(`Date: ${payrollInfo.date}`, 150, 30);

        // Payroll Information Section
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Payroll Information", 10, 40);
        doc.setLineWidth(0.2);
        doc.line(10, 42, 200, 42);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        let yPosition = 50;
        const payrollDetails = [
            `Overtime: ${payrollInfo.ot}`,
            `Salary Increase: ${payrollInfo.salaryIncrease}`,
            `Meal Allowance: ${payrollInfo.mealAllow}`,
            `Birthday Bonus: ${payrollInfo.bdayBonus}`,
            `Incentive: ${payrollInfo.incentive}`,
            `Other Payroll Info: ${payrollInfo.otherPayrollInfo}`
        ];

        payrollDetails.forEach(detail => {
            doc.text(detail, 12, yPosition);
            yPosition += 10;
        });

        // Deductions Section
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Deductions", 10, yPosition + 5);
        doc.line(10, yPosition + 7, 200, yPosition + 7);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        yPosition += 15;
        const deductionDetails = [
            `SSS: ${deductions.sss}`,
            `PhilHealth: ${deductions.philhealth}`,
            `Pag-IBIG: ${deductions.pagibig}`,
            `Cash Advance: ${deductions.cashAdvance}`,
            `Health Card: ${deductions.healthCard}`,
            `Absences: ${deductions.absences}`,
            `Other Deductions: ${deductions.otherDeductions}`
        ];

        deductionDetails.forEach(detail => {
            doc.text(detail, 12, yPosition);
            yPosition += 10;
        });

        // Summary Section
        doc.setLineWidth(0.5);
        doc.line(10, yPosition + 5, 200, yPosition + 5);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Summary", 10, yPosition + 15);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        yPosition += 25;
        doc.text(`Total Payroll: ${results.payroll.toFixed(2)}`, 12, yPosition);
        doc.text(`Total Deductions: ${results.deductions.toFixed(2)}`, 12, yPosition + 10);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`Net Pay: ${results.total.toFixed(2)}`, 12, yPosition + 25);

        // Border around Net Pay
        doc.setLineWidth(1);
        doc.rect(10, yPosition + 15, 190, 20);

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

    const saveToDB = () => {
        const newPayment = {
            employee_index_id: id,
            rate: config.rate,
            basic: config.basic,
            payrollInfo, 
            deductions,
            results
        };
        console.log(JSON.stringify(newPayment));
        fetch(`${BASE_URL}/addPayment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPayment),
        })
        .then((res) => res.json())
        .then((data) => {
            setSavedStatus('Saved to Database!');
            console.log(data);
        })
        .catch((err) => console.log(err));
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
