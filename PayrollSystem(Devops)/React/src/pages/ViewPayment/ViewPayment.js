import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../_sidebar/Sidebar';
import Header from '../_header/Header';
import global from '../../global.module.css';
import { ConfigContext, BASE_URL } from '../../ConfigContext';
import styles from './ViewPayment.module.css';
import Popup from './Popup';

const ViewPayment = () => {
  const navigate = useNavigate();
  const { id, fname, lname } = useParams();  // params passed from previous pages
  const { getAllUserPayments, deleteUserPayment } = useContext(ConfigContext);
  //const userPayments = getAllUserPayments(id);
  const [ userPayments, setUserPayments] = useState(null);
  const [openBtn, setOpenBtn] = useState(false);
  const [pid, setPID] = useState();

  const handleEdit = (payment_id) => {
    navigate(`../EditPayroll/${id}/${payment_id}/${fname}/${lname}`);
  };

  const handleDelete = (payment_id) => {
    setPID(payment_id);
    setOpenBtn(true);
  };
useEffect(() => {
  const company = sessionStorage.getItem('company');

  if (!company) {
    console.warn("⚠️ No company found in sessionStorage.");
    return;
  }

  fetch(`${BASE_URL}/payments/${id}?company=${encodeURIComponent(company)}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error("Expected an array, but got:", data);
        return;
      }

      const sortedData = data.sort(
        (a, b) => new Date(b.formatted_date) - new Date(a.formatted_date)
      );

      setUserPayments(sortedData);
      console.log("✅ Payments fetched:", sortedData);
    })
    .catch(err => console.error("❌ Error fetching payments:", err));
}, [id]);


  return (
    <div className={global.wrapper}>
      <Sidebar></Sidebar>
      <div>
        <Header></Header>

        <div className={global.mainContent}>
          <h1><span className={global.title}>Payroll History of {fname} {lname}</span></h1>
          <Popup trigger={openBtn} setTrigger={setOpenBtn} pid={pid} id={id} userPayments={userPayments} setUserPayments={setUserPayments}></Popup>

          {
            //added payments here for navigation to edit payroll 
          }
          <div className = {styles.tableContainer}>
            {userPayments && userPayments.length > 0 ? (
              <table>
                <tbody>
                  {userPayments?.map(payment => (
                    <tr key={payment._id}>
                      <td className={styles.date}> {new Date(payment.payDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', })} </td>
                      <td className={styles.total}>P {parseFloat(payment.total).toFixed(2)}</td>
                      <td className={styles.edit}> <button onClick={() => handleEdit(payment._id)}>EDIT</button>  </td>
                      <td className={styles.delete}> <button onClick={() => handleDelete(payment._id)}>DELETE</button> </td>
                    </tr>
                  ))}
                </tbody>
              </table>              
            ) : (
              <div className={styles.noRecord}>
                No payroll history records found.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewPayment;
