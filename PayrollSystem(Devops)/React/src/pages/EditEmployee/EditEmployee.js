import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../ConfigContext';
import global from '../../global.module.css';
import Header from '../_header/Header';
import Sidebar from '../_sidebar/Sidebar';
import styles from './EditEmployee.module.css';

const EditEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchType } = useParams();
  const title = (searchType === 'ViewPayrollHistory' ? 'View Payroll History of an Employee' : 'Calculate Payroll for an Employee');
  const buttonText = (searchType === 'ViewPayrollHistory' ? 'View' : 'Calculate');
  const [searchByName, setSearchByName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const adminCompany = sessionStorage.getItem('company');

  useEffect(() => {
    // Do not fetch if adminCompany is not yet available
    if (!adminCompany) return;

    fetch(`${BASE_URL}/employee?company=${adminCompany}`)
      .then(res => {
        // Check if the response is successful
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        // Ensure the response from the server is an array
        if (Array.isArray(data)) {
          setEmployees(data);
          setFilteredEmployees(data);
        } else {
          // If not an array, set to empty to avoid errors
          console.error("Received data is not an array:", data);
          setEmployees([]);
          setFilteredEmployees([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch employees:", err);
        // On error, set to empty arrays to prevent crashes
        setEmployees([]);
        setFilteredEmployees([]);
      });
  }, [adminCompany]);

  useEffect(() => {
    setSearchByName('');
  }, [location]);

  const handleSearchByName = (e) => {
    setSearchByName(e.target.value);
  };

  const handleSearchButtonByName = () => {
    const filtered = searchByName
      ? employees.filter(employee =>
        employee.lname.toLowerCase().includes(searchByName.toLowerCase()) ||
        employee.fname.toLowerCase().includes(searchByName.toLowerCase()))
      : employees;

    setFilteredEmployees(filtered);
  };

  const handleEdit = (id) => {
    navigate(`/EditEmployee/${id}`);
  };

  return (
    <div className={global.wrapper}>
      <Sidebar />
      <div>
        <Header />
        <div className={global.mainContent}>
          <h1><span className={global.title}>Edit Employee Records</span></h1>

          <div className={styles.searchBox}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by name"
                value={searchByName}
                onChange={handleSearchByName}
              />
              <button onClick={handleSearchButtonByName}>Search</button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {filteredEmployees.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee._id}>
                      <td>{employee.fname}</td>
                      <td>{employee.lname}</td>
                      <td>{employee.email}</td>
                      <td>
                        <button className={styles.actionButton} onClick={() => handleEdit(employee._id)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noRecord}>
                No results found for the search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;

