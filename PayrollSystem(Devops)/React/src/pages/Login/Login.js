import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import { ConfigContext, BASE_URL } from '../../ConfigContext';
import officeImage from '../Login/office.jpg';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const { setUsername, setCompany } = useContext(ConfigContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   sessionStorage.removeItem('userValid');
  //   sessionStorage.removeItem('company');
  //   sessionStorage.removeItem('companyName');
  //   sessionStorage.removeItem('username');
  // }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('🔍 Attempting login with:', { userName, BASE_URL });
    
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // RE-ENABLE THIS for cookies
      body: JSON.stringify({ username: userName, password: userPassword })
    });

    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);

    if (res.status == 200) {
      const { username, company } = await res.json();
      console.log('✅ Login successful:', { username, company });
      
      // Keep sessionStorage for immediate UI updates
      sessionStorage.setItem('userValid', 'true');
      sessionStorage.setItem('company', company.id);
      sessionStorage.setItem('companyName', company.name);
      sessionStorage.setItem('username', userName);

      setUsername(username);
      navigate('/MainMenu');
    } else if (res.status === 401) {
      const errorData = await res.json();
      console.log('❌ 401 Error data:', errorData);
      setErrMessage('Invalid username or password');
    } else {
      const errorData = await res.json();
      console.log('❌ Other error:', res.status, errorData);
      setErrMessage('Login failed. Please try again.');
    }
  } catch (err) {
    console.error('❌ Login error (full details):', err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error stack:', err.stack);
    setErrMessage('Something went wrong. Please try again.');
  }
};

  return (
    <div className={styles.background}>
      <div className={styles.rect}>
        <div className={styles.leftrect}>
          <img src={officeImage} alt='bruh'></img>
        </div>
        <div className={styles.rightrect}>
          <span className={styles.prompt}>Login to your system</span>
          <form className={styles.formSection} onSubmit={handleSubmit}>
            <input className={styles.usernameHolder}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
            />
            <input className={styles.passwordHolder}
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Password"
            />
            <span className={styles.errMessage}>{errMessage}</span><br></br>

            <button id="login-button" className={styles.submitButton} type="submit">LOGIN</button>
            <Link to="/AccountRegistration"> <button className={styles.submitButton} type="button">Register</button></Link>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Login;