import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../_sidebar/Sidebar'
import global from '../../global.module.css';
import Header from '../_header/Header';
import styles from './MainMenu.module.css';

const MainMenu = () => {
    const handleExit = () => {
        sessionStorage.removeItem('userValid');
    };

    return (
      <div className={global.wrapper}>
        <Sidebar></Sidebar>
        <div>
          <Header></Header>
          <div className={global.mainContent}>
            <h1><span className={global.title}>MAIN MENU</span></h1>
            <div className={styles.links}>
              <Link to="/SetDefaults"> Set Default Rates </Link> <br></br>
              <Link to="/SearchEmployee/ViewPayrollHistory"> View Payroll History </Link> <br></br>
              <Link to="/SearchEmployee/CalculatePayroll"> Generate Employee Payroll </Link> <br></br>
              <Link to="/" onClick={handleExit}> Exit </Link> <br></br>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default MainMenu;