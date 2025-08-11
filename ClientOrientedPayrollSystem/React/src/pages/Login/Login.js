import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import {ConfigContext} from '../../ConfigContext';

const Login = () => {
  const [userPassword, setUserPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const navigate = useNavigate();

  const {password, setPassword} = useContext(ConfigContext);

  useEffect (()=>{
    sessionStorage.removeItem('userValid');
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userPassword === password) {
      sessionStorage.setItem('userValid', true);
      navigate('/MainMenu');
    } else {
      setErrMessage('Password is incorrect.');
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.rect}>
        <text className={styles.prompt}>ENTER PASSWORD</text>
        <form className={styles.formSection}onSubmit={handleSubmit}>
          <input className={styles.passwordHolder}
            type="password" 
            value={userPassword} 
            onChange={(e) => setUserPassword(e.target.value)} 
            placeholder="Admin Password" 
          /> 
          <span className={styles.errMessage}>{errMessage}</span><br></br>
          <button className={styles.submitButton} type="submit">LOGIN</button>
        </form>
      </div>
    </div>
    
  );
};

export default Login;
