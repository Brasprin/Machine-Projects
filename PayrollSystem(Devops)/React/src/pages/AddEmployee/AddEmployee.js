
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../ConfigContext';
import global from '../../global.module.css';
import Header from '../_header/Header';
import Sidebar from '../_sidebar/Sidebar';
import styles from './AddEmployee.module.css';

const AddEmployee = () => {
  const navigate = useNavigate();

  const [fName, setFName] = useState('');
  const [middleName, setMName] = useState('');
  const [lName, setLName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [designation, setDesignation] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [dateHired, setDateHired] = useState('');

  const [bankAccount, setBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    branch: ''
  });

  const handleBankAccount = (e) => {
    const { name, value } = e.target;
    setBankAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };
  function generateEmployeeId() {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
    return `EMP${randomNum}`;
  }
  const handeAddEmployeeButton = async () => {

    const companyId = sessionStorage.getItem('company');

    if (!companyId || companyId.length !== 24) {
      alert('Company ID is missing or invalid. Please log in again.');
      return;
    }

    const employeeData = {
      employee_id: generateEmployeeId(),
      company: companyId,
      fname: fName,
      middleName,
      lname: lName,
      department,
      position,
      designation,
      basicSalary: Number(basicSalary),
      dateHired,
      phone,
      email,
      rbacProfile: 1,
      bankAccount: {
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        branch: bankAccount.branch
      }
    };

    try {
      const response = await fetch(`${BASE_URL}/addEmployee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Employee has been added!");
        navigate('/MainMenu');
      } else {
        alert(`❌ Failed to add employee: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding employee: ", error);
      alert("Error in adding employee");
    }
  };

  const title = "Add Employee";

  return (
    <div className={global.wrapper}>
      <Sidebar />
      <div>
        <Header />
        <div className={global.mainContent}>
          <h1><span className={global.title}>{title}</span></h1>
          <div className={styles.infoContainer}>
            <div className={styles.searchBox}>
              <h3 id="outside">Employee Personal Info</h3>
              <div className={styles.searchContainer}>
                <input id="fname" type="text" placeholder="Enter employee's first name" value={fName} onChange={(e) => setFName(e.target.value)} />
                <input id="mname" type="text" placeholder="Enter employee's middle name" value={middleName} onChange={(e) => setMName(e.target.value)} />
                <input id="lname" type="text" placeholder="Enter employee's last name" value={lName} onChange={(e) => setLName(e.target.value)} />
                <input id="phone" type="tel" placeholder="Enter employee's phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input id="email" type="email" placeholder="Enter employee's email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className={styles.searchBox}>
              <h3>Employee Company Info</h3>
              <div className={styles.searchContainer}>
                <input
                  id="date"
                  type="date"
                  placeholder="Enter employee's hiring date"
                  value={dateHired}
                  onChange={(e) => setDateHired(e.target.value)}
                />
                <input id="department" type="text" placeholder="Enter employee's department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                <input id="position" type="text" placeholder="Enter employee's position" value={position} onChange={(e) => setPosition(e.target.value)} />
                <input id="designation" type="text" placeholder="Enter employee's designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                <input id="salary" type="number" placeholder="Enter employee's basic salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
              </div>
            </div>

            <div className={styles.searchBox}>
              <h3>Employee Bank Info</h3>
              <div className={styles.searchContainer}>
                <input id="bank" name="bankName" type="text" placeholder="Enter employee's bank" value={bankAccount.bankName} onChange={handleBankAccount} />
                <input id="account" name="accountNumber" type="number" placeholder="Enter bank account number" value={bankAccount.accountNumber} onChange={handleBankAccount} />
                <input id="branch" name="branch" type="text" placeholder="Enter bank branch" value={bankAccount.branch} onChange={handleBankAccount} />
              </div>
            </div>
          </div>
          <button id="add-employee-btn" className={styles.buttonDesign} onClick={handeAddEmployeeButton}>Add Employee</button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
