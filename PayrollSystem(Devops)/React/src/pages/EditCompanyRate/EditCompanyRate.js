import { useState, useEffect } from 'react';
import { BASE_URL } from '../../ConfigContext';
import global from '../../global.module.css';
import Header from '../_header/Header';
import Sidebar from '../_sidebar/Sidebar';
import { useNavigate } from 'react-router-dom'; 
import styles from './EditCompanyRate.module.css';

const EditCompanyRate = () => {
  
  const companyId = sessionStorage.getItem('company');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('');
  const [workHoursPerDay, setWorkHoursPerDay] = useState('');
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCurrentRates();
  }, []);

  const fetchCurrentRates = async () => {
    try {
      if (!companyId || companyId.length !== 24) {
        alert('Company ID is missing or invalid. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/getCompanyRates?companyID=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setOvertimeMultiplier(data.overtimeMultiplier || '');
        setWorkHoursPerDay(data.workHoursPerDay || '');
        setWorkingDaysPerMonth(data.workingDaysPerMonth || '');
      } else {
        console.log('No existing data found, starting with defaults');
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      alert('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRates = async () => {
    if (!companyId || companyId.length !== 24) {
      alert('Company ID is missing or invalid. Please log in again.');
      return;
    }

    if (
      overtimeMultiplier === '' ||
      workHoursPerDay === '' ||
      workingDaysPerMonth === ''
    ) {
      alert('Please fill in all fields');
      return;
    }

    if (
      Number(overtimeMultiplier) <= 0 ||
      Number(workHoursPerDay) <= 0 ||
      Number(workingDaysPerMonth) <= 0
    ) {
      alert('Values must be positive numbers');
      return;
    }

    const data = {
      company: companyId,
      overtimeMultiplier: Number(overtimeMultiplier),
      workHoursPerDay: Number(workHoursPerDay),
      workingDaysPerMonth: Number(workingDaysPerMonth),
    };

    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/updateCompanyRates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
    
    } catch (error) {
      console.error('Error updating rates:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={global.wrapper}>
      <Sidebar />
      <div>
        <Header />
        <div className={global.mainContent}>
          <div className={styles.rateContainer}>
            <div className={styles.rateBox}>
              <h3>Company Rate Configuration</h3>
              <div className={styles.inputContainer}>
                <div className={styles.inputGroup}>
                  <label htmlFor="overtimeMultiplier">Overtime Multiplier</label>
                  <input
                    id="overtimeMultiplier"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Enter overtime multiplier"
                    value={overtimeMultiplier}
                    onChange={(e) => setOvertimeMultiplier(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="workHoursPerDay">Work Hours Per Day</label>
                  <input
                    id="workHoursPerDay"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="Enter work hours per day"
                    value={workHoursPerDay}
                    onChange={(e) => setWorkHoursPerDay(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="workingDaysPerMonth">Working Days Per Month</label>
                  <input
                    id="workingDaysPerMonth"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="Enter working days per month"
                    value={workingDaysPerMonth}
                    onChange={(e) => setWorkingDaysPerMonth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.ratePreview}>
              <h4>Rate Preview</h4>
              <div className={styles.previewItem}>
                <span>Overtime Multiplier:</span>
                <span>{Number(overtimeMultiplier || 1).toFixed(2)}</span>
              </div>
              <div className={styles.previewItem}>
                <span>Work Hours Per Day:</span>
                <span>{Number(workHoursPerDay || 8)}</span>
              </div>
              <div className={styles.previewItem}>
                <span>Working Days Per Month:</span>
                <span>{Number(workingDaysPerMonth || 22)}</span>
              </div>
            </div>
          </div>

         <div className={styles.buttonContainer}>
            <button 
              id="save-rates-btn" 
              className={styles.saveButton} 
              onClick={handleSaveRates}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Rates'}
            </button>
            
            {/* <button 
              className={styles.cancelButton} 
              onClick={() => navigate('/MainMenu')}
              disabled={saving}
            >
              Cancel
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyRate;
