
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../ConfigContext';
import global from '../../global.module.css';
import Header from '../_header/Header';
import Sidebar from '../_sidebar/Sidebar';
import styles from './SearchEmployee.module.css';

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

  const adminCompany = sessionStorage.getItem('company'); // company

  useEffect(() => {
    if (!adminCompany) return;

    fetch(`${BASE_URL}/employee?company=${adminCompany}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEmployees(data);
          setFilteredEmployees(data);
        } else {
          console.error("Received data is not an array:", data);
          setEmployees([]);
          setFilteredEmployees([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch employees:", err);
        setEmployees([]);
        setFilteredEmployees([]);
      });
  }, [adminCompany])

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
    searchType === 'ViewPayrollHistory'
      ? navigate(`../ViewPayment/${id}/${fname}/${lname}`)
      : navigate(`../GeneratePayroll/${id}/${fname}/${lname}`);
  };

  const handleSearchButtonID = () => {
    const filtered = searchID
      ? employees.filter(employee => employee.employee_id.toString().includes(searchID))
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

  return (
    <div className={global.wrapper}>
      <Sidebar></Sidebar>
      <div>
        <Header></Header>

        <div className={global.mainContent}>
          <h1><span className={global.title}>{title}</span></h1>

          <div className={styles.searchBox}>
            <div className={styles.searchContainer}>
              <input
                id="id-field"
                type="text"
                value={searchID}
                onChange={handleSearchID}
              ></input>
              <button id="search-by-id-button" onClick={handleSearchButtonID}>Search by ID</button>
            </div>

            <div className={styles.searchContainer}>
              <input
                id="fname-field"
                type="text"
                value={searchFName}
                onChange={handleSearchFName}
              ></input>
              <button id="search-by-fname-button" onClick={handleSearchButtonFName}>Search by First Name</button>
            </div>

            <div className={styles.searchContainer}>
              <input
                id="lname-field"
                type="text"
                value={searchLName}
                onChange={handleSearchLName}
              ></input>
              <button id="search-by-lname-button" onClick={handleSearchButtonLName}>Search by Last Name</button>
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
                    <tr key={employee._id}>
                      <td>{employee.employee_id}</td>
                      <td>{employee.fname}</td>
                      <td>{employee.lname}</td>
                      <td>{employee.email}</td>
                      <td>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleButton(employee.employee_id, employee.fname, employee.lname)}
                        >
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
