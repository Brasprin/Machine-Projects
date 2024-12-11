import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../_sidebar/Sidebar';
import Header from '../_header/Header';
import global from '../../global.module.css'
import styles from './SearchEmployee.module.css';
import {BASE_URL} from '../../ConfigContext';

const SearchEmployee = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchType } = useParams(); 
    const title = (searchType === 'ViewPayrollHistory' ? 'View Payroll History of an Employee' : 'Calculate Payroll for an Employee');
    const buttonText = (searchType === 'ViewPayrollHistory' ? 'View' : 'Calculate');
    const [searchID, setSearchID] = useState('');
    const [searchFName, setSearchFName] = useState('');
    const [searchLName, setSearchLName] = useState('');
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState(employees);
    
    useEffect (()=>{
      fetch(`${BASE_URL}/employee`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data)
        setFilteredEmployees(data);
      })
      .catch(err => console.log(err));
    }, [])

    useEffect(() => {
      setSearchID('');
      setSearchFName('');
      setSearchLName('');
    }, [location]); 


    const handleSearchID = (e) => {
      setSearchID(e.target.value);
    };

    const handleSearchFName = (e) => {
      setSearchFName(e.target.value);
    };

    const handleSearchLName = (e) => {
      setSearchLName(e.target.value);
    };

    const handleButton = (id, fname, lname) => {
        searchType === 'ViewPayrollHistory' ? navigate(`../ViewPayment/${id}/${fname}/${lname}`) : navigate(`../GeneratePayroll/${id}/${fname}/${lname}`);
    };

    const handleSearchButtonID = () => {
      const filtered = searchID
        ? employees.filter(employee => employee.id.toString().includes(searchID))
        : employees;
  
      setFilteredEmployees(filtered);
      setSearchFName('');
      setSearchLName('');
    };

    const handleSearchButtonFName = () => {
      const filtered = searchFName
        ? employees.filter(employee => employee.fname.toLowerCase().includes(searchFName.toLowerCase()))
        : employees;
  
      setFilteredEmployees(filtered);
      setSearchID('');
      setSearchLName('');
    };

    const handleSearchButtonLName = () => {
      const filtered = searchLName
        ? employees.filter(employee => employee.lname.toLowerCase().includes(searchLName.toLowerCase()))
        : employees;
  
      setFilteredEmployees(filtered);
      setSearchID('');
      setSearchFName('');
    };
    
    // Note: change to SQL implementation later
    return (
      <div className={global.wrapper}>
        <Sidebar></Sidebar>
      <div>
        <Header></Header>

      <div className={global.mainContent}>
      <h1><span className={global.title}>{title}</span></h1>

    <div className = {styles.searchBox}>
      <div className = {styles.searchContainer}>
        <input
        type="text"
        value={ searchID }
        onChange={ handleSearchID }
        ></input>
        <button onClick={ handleSearchButtonID }>Search by ID</button>
      </div>

      <div className = {styles.searchContainer}>
        <input
        type="text"
        value={ searchFName }
        onChange={ handleSearchFName }
        ></input>
        <button onClick={ handleSearchButtonFName }>Search by First Name</button>
      </div>

      <div className = {styles.searchContainer}>
        <input
        type="text"
        value={ searchLName }
        onChange={ handleSearchLName }
        ></input>
        <button onClick={ handleSearchButtonLName }>Search by Last Name</button>
      </div>
    </div>
    
    <div className={styles.tableContainer}>
      {filteredEmployees.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.fname}</td>
                <td>{employee.lname}</td>
                <td>{employee.email}</td>
                <td>
                  <button className={styles.actionButton} onClick={() => handleButton(employee.id, employee.fname, employee.lname)}>
                    {buttonText}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.noRecord}>
          No results found for the search criteria
        </div>
      )}
      </div>
    </div>
  </div>
</div>
    );
  };
  
export default SearchEmployee;