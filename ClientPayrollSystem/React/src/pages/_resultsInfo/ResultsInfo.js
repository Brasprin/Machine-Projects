import React from 'react';
import styles from './ResultsInfo.module.css';

const ResultsInfo = ({ results }) => {
    return (
        <div>
            <div className={styles.formGroup}>
                <label>PAYROLL: </label>
                <input value={parseFloat(results.payroll).toFixed(2)} readOnly />
            </div>
            <div className={styles.formGroup}>
                <label>DEDUCTIONS: </label>
                <input value={parseFloat(results.deductions).toFixed(2)} readOnly />
            </div>
            <div className={styles.formGroup}>
                <label>TOTAL: </label>
                <input value={parseFloat(results.total).toFixed(2)} readOnly />
            </div>
        </div>
    );
};

export default ResultsInfo;
