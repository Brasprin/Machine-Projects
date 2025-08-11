

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../_sidebar/Sidebar';
import Header from '../_header/Header';
import global from '../../global.module.css';
import styles from '../EditEmployee/EditEmployeeForm.module.css';
import { BASE_URL } from '../../ConfigContext';

const EditEmployeeForm = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetch(`${BASE_URL}/getEmployeeDetails/${id}`)
      .then(res => res.json())
      .then(data => {
        setFName(data.fname);
        setMName(data.middleName || '');
        setLName(data.lname);
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setDepartment(data.department || '');
        setPosition(data.position || '');
        setDesignation(data.designation || '');
        setBasicSalary(data.basicSalary || '');
        setDateHired(data.dateHired?.slice(0, 10) || '');
        setBankAccount({
          bankName: data.bankAccount?.bankName || '',
          accountNumber: data.bankAccount?.accountNumber || '',
          branch: data.bankAccount?.branch || ''
        });
      })
      .catch(err => {
        console.error('Error loading employee:', err);
        alert('Failed to load employee data.');
      });
  }, [id]);

  const handleBankAccount = (e) => {
    const { name, value } = e.target;
    setBankAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEmployee = async () => {
    const updatedData = {
      fname: fName,
      middleName,
      lname: lName,
      phone,
      email,
      department,
      position,
      designation,
      basicSalary: Number(basicSalary),
      dateHired,
      bankAccount
    };

    try {
      const res = await fetch(`${BASE_URL}/editEmployee/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Employee updated!");
        navigate('/EditEmployee');
      } else {
        alert(`❌ Failed to update: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("An error occurred while updating.");
    }
  };

  return (
    <div className={global.wrapper}>
      <Sidebar />
      <div>
        <Header />
        <div className={global.mainContent}>
          <h1><span className={global.title}>Edit Employee</span></h1>
          <div className={styles.infoContainer}>
            <div className={styles.searchBox}>
              <h3>Employee Personal Info</h3>
              <div className={styles.searchContainer}>
                <input type="text" placeholder="First Name" value={fName} onChange={(e) => setFName(e.target.value)} />
                <input type="text" placeholder="Middle Name" value={middleName} onChange={(e) => setMName(e.target.value)} />
                <input type="text" placeholder="Last Name" value={lName} onChange={(e) => setLName(e.target.value)} />
                <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className={styles.searchBox}>
              <h3>Employee Company Info</h3>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => (e.target.type = 'text')}
                  placeholder="Date Hired"
                  value={dateHired}
                  onChange={(e) => setDateHired(e.target.value)}
                />
                <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                <input type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
                <input type="text" placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                <input type="number" placeholder="Basic Salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
              </div>
            </div>

            <div className={styles.searchBox}>
              <h3>Employee Bank Info</h3>
              <div className={styles.searchContainer}>
                <input name="bankName" type="text" placeholder="Bank Name" value={bankAccount.bankName} onChange={handleBankAccount} />
                <input name="accountNumber" type="number" placeholder="Account Number" value={bankAccount.accountNumber} onChange={handleBankAccount} />
                <input name="branch" type="text" placeholder="Branch" value={bankAccount.branch} onChange={handleBankAccount} />
              </div>
            </div>
          </div>
          <button className={styles.buttonDesign} onClick={handleUpdateEmployee}>Update Employee</button>
        </div >
      </div >
    </div >
  );
};

export default EditEmployeeForm;
