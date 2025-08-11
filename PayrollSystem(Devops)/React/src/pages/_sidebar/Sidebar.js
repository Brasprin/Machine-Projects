
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import styles from './Sidebar.module.css';
const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenu = () => {
    navigate('/MainMenu');
  };

  const handleDefa = () => {
    navigate('/EditCompanyRate');
  };

  const handleHist = () => {
    navigate('/SearchEmployee/ViewPayrollHistory');
  };

  const handleCalc = () => {
    navigate('/SearchEmployee/CalculatePayroll');
  };
  const handleAddEmployee = () => {
    navigate('/AddEmployee');
  };

  const handleEditEmployee = () => {
    navigate('/EditEmployee');
  };
  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles.background}>
      <div className={styles.content}>

        <button className={`${styles.iconGroup} ${styles.menuButton}`} onClick={handleMenu}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}><span>MAIN MENU</span></div>
        </button>

        <button className={`${styles.iconGroup} ${styles.defaButton}`} onClick={handleDefa}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}>SET COMPANY RATES</div>
        </button>

        <button className={`${styles.iconGroup} ${styles.histButton}`} onClick={handleHist}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}>PAYROLL HISTORY</div>
        </button>

        <button className={`${styles.iconGroup} ${styles.calcButton}`} onClick={handleCalc}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}>CALCULATE PAYROLL</div>
        </button>

        <button className={`${styles.iconGroup} ${styles.addButton}`} onClick={handleAddEmployee}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}>ADD EMPLOYEE</div>
        </button>

        <button className={`${styles.iconGroup} ${styles.editButton}`} onClick={handleEditEmployee}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}>EDIT EMPLOYEE</div>
        </button>

        <button className={`${styles.iconGroup} ${styles.prevButton}`} onClick={handleBack}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}>BACK</div>
        </button>

        <button className={`${styles.iconGroup} ${styles.logoutButton}`} onClick={handleLogout}>
          <div className={styles.iconImage}></div>
          <div className={styles.label}>EXIT</div>
        </button>
        
      </div>
    </div>
  );
};

export default Header;
