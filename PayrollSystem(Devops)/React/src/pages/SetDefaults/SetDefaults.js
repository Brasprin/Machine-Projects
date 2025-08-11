import { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../../ConfigContext';
import global from '../../global.module.css';
import TempHeader from '../_header/Header';
import Sidebar from '../_sidebar/Sidebar';
import styles from './SetDefaults.module.css';

const SetDefaults = () => {
    const {config, setConfig} = useContext(ConfigContext);
    const [isVisible, setIsVisible] = useState(false);
    const [newConfig, setNewConfig] = useState({
        rate: '',
        basic: '',
    });
    const [statusMsg, setStatusMsg] = useState();

    useEffect(() => {
      setNewConfig(config);
    }, [config]);

    const handleSubmit = (e) => {
      if (parseFloat(newConfig.rate) >= 0 && parseFloat(newConfig.basic) >=0) {
        setConfig((prevConfig) => ({
          ...prevConfig,
          rate: parseFloat(newConfig.rate).toFixed(2),
          basic: parseFloat(newConfig.basic).toFixed(2),
        }));
        setStatusMsg('Saved!');
        saveToDB(newConfig.rate, newConfig.basic)
      } else {
        setStatusMsg('Invalid values!');
      }
      handleFadeOut();
    };

    const handleFadeOut = () => {
      setIsVisible(false); 
      setTimeout(() => setIsVisible(true)); 
    };

  const saveToDB = async (rate, basic) => {
    const nc = { rate, basic };

    try {
        const response = await fetch(`/saveConfig`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nc),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error saving config:', errorData);
          alert('Failed to save configuration. Please try again.');
          return;
        }

        const data = await response.json();
        console.log(data); // You can display this data in the UI as needed
        alert('Configuration saved successfully!'); // Show success message
      } catch (err) {
        console.error('Error in fetch request:', err);
        alert('An error occurred while saving the configuration. Please try again.');
      }
  };


    return (
      <div className={global.wrapper}>
        <Sidebar></Sidebar>
        <div>
          <TempHeader></TempHeader>
          <div className={global.mainContent}>
            <h1><span className={global.title}>SET DEFAULT RATES</span></h1>

              <div className={styles.content}>
              <div className={`${styles.payroll} ${styles.group}`}>
                <span>PAYROLL</span>
                <div>

                  <div className={styles.inputField}>
                  <label>Rate</label><br></br>
                  <input id="rate-field" type='number' min='0' value={newConfig.rate} step='any' onChange={(e)=>setNewConfig({...newConfig, rate: e.target.value})}></input><br></br>
                  </div>
                  
                  <div className={styles.inputField}>
                  <label>Basic</label><br></br>
                  <input id="basic-field" type='number' min='0' value={newConfig.basic} step='any' onChange={(e)=>setNewConfig({...newConfig, basic: e.target.value})}></input>
                  </div>

                  <div className={`${styles.status} ${isVisible ? global.fadeOut : global.opacity0}`}> {statusMsg} </div>
                
                </div>
              </div>

              <button id="confirm-button" className={styles.confirm} onClick={handleSubmit}> CONFIRM CHANGES </button><br/>
              </div>
          </div>
        </div>
      </div>
    );
  };
  
export default SetDefaults;