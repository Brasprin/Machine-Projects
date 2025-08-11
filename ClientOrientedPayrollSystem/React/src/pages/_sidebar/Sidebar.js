import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Header = () => {
    const navigate = useNavigate();

    const handleMenu= () => {
        navigate('/MainMenu');
    };

    const handleDefa= () => {
        navigate('/SetDefaults');
    };

    const handleHist= () => {
        navigate('/SearchEmployee/ViewPayrollHistory');
    };

    const handleCalc= () => {
        navigate('/SearchEmployee/CalculatePayroll');
    };

    const handleBack= () => {
        navigate(-1);
    };

    const handleLogout= () => {
        sessionStorage.removeItem('userValid');
        navigate('/');
    };

    return (
      <div className={styles.background}>
        <div className={styles.content}>

          <div className={styles.iconGroup}>
            <button className={styles.menuButton} onClick={handleMenu}>  </button> <br></br>
            <div className={styles.label}> MAIN MENU </div>
          </div>

          <div className={styles.iconGroup}> 
            <button className={styles.defaButton} onClick={handleDefa}>  </button> <br></br>
            <div className={styles.label}> SET DEFAULT RATES </div>
          </div>

          <div className={styles.iconGroup}> 
            <button className={styles.histButton} onClick={handleHist}>  </button> <br></br>
            <div className={styles.label}> PAYROLL HISTORY </div>
          </div>

          <div className={styles.iconGroup}> 
            <button className={styles.calcButton} onClick={handleCalc}>  </button> <br></br>
            <div className={styles.label}> CALCULATE PAYROLL </div>
          </div>

          <div className={styles.iconGroup}>
            <button className={styles.prevButton} onClick={handleBack}>  </button> <br></br>
            <div className={styles.label}> BACK </div>
          </div>

          <div className={styles.iconGroup}>
            <button className={styles.logoutButton} onClick={handleLogout}>  </button> <br></br>
            <div className={styles.label}> LOGOUT </div>
          </div>
            
        </div>
      </div>
    );
  };
  
export default Header;