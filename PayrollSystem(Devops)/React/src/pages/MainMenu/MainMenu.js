import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import global from '../../global.module.css';
import Header from '../_header/Header';
import Sidebar from '../_sidebar/Sidebar';
import styles from './MainMenu.module.css';

const MainMenu = () => {
  const { logout } = useAuth();
  const handleExit = async () => {
    await logout();
  };

  return (
    <div className={global.wrapper}>
      <Sidebar></Sidebar>
      <div>
        <Header></Header>
        <div className={global.mainContent}>
          {/* <h1><span className={global.title}>MAIN MENU</span></h1> */}
          <div className={styles.menuWrapper}>
            <div className={styles.gridContainer}>
              <Link to="/EditCompanyRate" id="set-default-button">
                <div className={styles.imageSwapContainer}>
                  <img src='/images/set-greyed.png' alt='set rates grayed' className={styles.imageGray} />
                  <img src='/images/set.png' alt='set rates hovered' className={styles.imageColor} />
                </div>
                <span>Set Company Rates</span>
              </Link>
              <Link to="/SearchEmployee/CalculatePayroll" id="calculate-payroll-button">
                <div className={styles.imageSwapContainer}>
                  <img src='/images/generate-greyed.png' alt='set rates grayed' className={styles.imageGray} />
                  <img src='/images/generate.png' alt='set rates hovered' className={styles.imageColor} />
                </div>
                <span>Calculate Employee Payroll</span>
              </Link>
              <Link to="/SearchEmployee/ViewPayrollHistory" id="view-payroll-button">
                <div className={styles.imageSwapContainer}>
                  <img src='/images/history-greyed.png' alt='set rates grayed' className={styles.imageGray} />
                  <img src='/images/history.png' alt='set rates hovered' className={styles.imageColor} />
                </div>
                <span>View Payroll History</span>
              </Link>
              <Link to="/AddEmployee" id="add-employee-button">
                <div className={styles.imageSwapContainer}>
                  <img src='/images/add-greyed.png' alt='add employee grayed' className={styles.imageGray} />
                  <img src='/images/add.png' alt='add employee hovered' className={styles.imageColor} />
                </div>
                <span>Add Employee</span>
              </Link>
              <Link to="/EditEmployee" id="edit-employee-button">
                <div className={styles.imageSwapContainer}>
                  <img src='/images/edit-greyed.png' alt='edit employee grayed' className={styles.imageGray} />
                  <img src='/images/edit.png' alt='edit employee hovered' className={styles.imageColor} />
                </div>
                <span>Edit Employee</span>
              </Link>
              <Link to="/" onClick={handleExit} id="exit-button">
                <div className={styles.imageSwapContainer}>
                  <img src='/images/exit-greyed.png' alt='set rates grayed' className={styles.imageGray} />
                  <img src='/images/exit.png' alt='set rates hovered' className={styles.imageColor} />
                </div>
                <span>Exit</span>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
