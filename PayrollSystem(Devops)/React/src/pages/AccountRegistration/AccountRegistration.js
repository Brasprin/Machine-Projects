import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AccountRegistration.module.css';
import { ConfigContext, BASE_URL } from '../../ConfigContext';
import signupImage from '../AccountRegistration/signupimage.jpg';


const AccountRegistration = () => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('userValid');
    sessionStorage.removeItem('company');
    sessionStorage.removeItem('username');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password: userPassword, company: company })
      });

      if (res.ok) {
        const { username, company } = await res.json();
        sessionStorage.setItem('userValid', 'true');
        sessionStorage.setItem('company', company);
        sessionStorage.setItem('username', username);
        navigate('/MainMenu');
      } else if (res.status === 409) {
        setErrMessage('Account already exists.');
      } else {
        setErrMessage('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.rect}>
        <div className={styles.leftrect}>
          <img src={signupImage} alt="signup"></img>
        </div>
        <div className={styles.rightrect}>
          <span className={styles.prompt}>Sign up</span>
          <p className={styles.text}>Register your company now.</p>
          <form className={styles.formSection} onSubmit={handleSubmit}>
            <input className={styles.usernameHolder}
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
            />
            <input className={styles.passwordHolder}
              id="password"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Password"
            />
            {/* idk if theres a dropdown thing pero will look for it  */}
            <input className={styles.passwordHolder}
              id="company"
              type="text"
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
            />
            <span className={styles.errMessage}>{errMessage}</span><br></br>
            <button className={styles.submitButton} type="submit">REGISTER</button>
            <Link to="/Login"><button className={styles.submitButton} type="button">LOGIN</button></Link>
          </form>
        </div>
      </div>
    </div>

  );
};

export default AccountRegistration;
