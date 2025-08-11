import React from 'react';
import logo from './logo.svg';
import setting from './setting.svg';
import styles from './Header.module.css';
import SettingsMenu from './SettingsMenu';
import {useState} from 'react';

const Header = () => {
  const [openBtn, setOpenBtn] = useState(false);

  const handleSetting= () => {
    setOpenBtn(true);
  };

    return (
      <div className={styles.background}>
        <img className={styles.logo} src={logo}></img>
        <img className={styles.setting} src={setting} onClick={handleSetting}></img>
        <SettingsMenu trigger={openBtn} setTrigger={setOpenBtn}></SettingsMenu>
      </div>
    );
};
  
export default Header;