import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.background}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <img src="/images/ledger.png" alt="ledgerly" />
          </div>
          <div className={styles.navLinks}>
            <Link to="/Login" className={styles.loginBtn}>Login</Link>
            <Link to="/AccountRegistration" className={styles.signupBtn}>Sign Up</Link>
          </div>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Streamline Your <span className={styles.highlight}>Payroll Management</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Efficiently manage employee payrolls, generate detailed reports, and ensure accurate
              salary calculations with our comprehensive payroll management system.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/AccountRegistration" className={styles.primaryBtn}>
                Sign up now
              </Link>
              <Link to="/Login" className={styles.secondaryBtn}>
                Login to Your Account
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src="/images/salary.jpg" alt="Payroll Management" />
          </div>
        </div>
      </main>

      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose ledger.ly?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img src="/images/generate.png" alt="Calculate Payroll" />
              </div>
              <h3>Automated Calculations</h3>
              <p>Automatically calculate salaries, overtime, deductions, and bonuses with precision.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img src="/images/history.png" alt="Payroll History" />
              </div>
              <h3>Complete <br></br>History</h3>
              <p>Track and view comprehensive payroll history for all employees with detailed records.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img src="/images/add.png" alt="Employee Management" />
              </div>
              <h3>Employee Management</h3>
              <p>Easily add, edit, and manage employee information and payroll settings.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img src="/images/set.png" alt="Default Rates" />
              </div>
              <h3>Flexible Configuration</h3>
              <p>Set default rates, customize deductions, and configure payroll parameters.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.team}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Meet the Team</h2>
          <div className={styles.teamGrid}>
            {/* First Row - 4 members */}
            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/aj.jpg" alt="AJ" />
              </div>
              <h3>Aljirah Resurrecion</h3>
              <p className={styles.teamRole}>Product Owner</p>
              <div className={styles.teamContact}>
                <a href="mailto:aljirah_resurreccion@dlsu.edu.ph">aljirah_resurreccion@dlsu.edu.ph</a>
                <a href="https://www.linkedin.com/in/aljirah-resurreccion-692394363/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/SmeaGL" target="_blank" rel="noopener noreferrer">GitHub</a>

              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/rein.jpg" alt="Rein" />
              </div>
              <h3>Rein Dela Cruz</h3>
              <p className={styles.teamRole}>Lead Developer</p>
              <div className={styles.teamContact}>
                <a href="mailto:rein_delacruz@dlsu.edu.ph">rein_delacruz@dlsu.edu.ph</a>
                <a href="https://www.linkedin.com/in/rein-dela-cruz/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/ReinDC" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/evan.jpg" alt="Evan" />
              </div>
              <h3>Evan Mari De Guzman</h3>
              <p className={styles.teamRole}>Developer and UI/UX Designer</p>
              <div className={styles.teamContact}>
                <a href="mailto:evan_mari_deguzman@dlsu.edu.ph">evan_mari_deguzman@dlsu.edu.ph</a>
                <a href="https://www.linkedin.com/in/evan-mari-de-guzman-243698306/" target="_blank" rel="noopener noreferrer">LinkedIn</a> 
                <a href="https://github.com/sadhubby" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/andrei.jpg" alt="Andrei" />
              </div>
              <h3>Andrei Tamse</h3>
              <p className={styles.teamRole}>Developer</p>
              <div className={styles.teamContact}>
                <a href="mailto:andrei_tamse@dlsu.edu.ph">andrei_tamse@dlsu.edu.ph</a>
                <a href="https://www.linkedin.com/in/agtamse/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/Brasprin" target="_blank" rel="noopener noreferrer">GitHub</a>

              </div>
            </div>

            {/* Second Row - 3 members (centered) */}
            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/hugo.jpg" alt="Raf raised to 1" />
              </div>
              <h3>Rafael Hugo</h3>
              <p className={styles.teamRole}>Lead Quality Assurance</p>
              <div className={styles.teamContact}>
                <a href="mailto:rafael_enrico_hugo@dlsu.edu.ph">rafael_enrico_hugo@dlsu.edu.ph</a>
                <a href="https://www.linkedin.com/in/rafael-enrico-hugo-b44a27354/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/WhoGoesOnMercury" target="_blank" rel="noopener noreferrer">GitHub</a>

              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/ram.jpg" alt="Raf raised to 2" />
              </div>
              <h3>Rafael Ramos</h3>
              <p className={styles.teamRole}>Quality Assurance</p>
              <div className={styles.teamContact}>
                <a href="mailto:rafael_anton_ramos@dlsu.edu.ph">rafael_anton_ramos@dlsu.edu.ph</a>
                <a href="https://www.linkedin.com/in/rafael-anton-ramos-b698052a5/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/WamTheRam" target="_blank" rel="noopener noreferrer">GitHub</a>

              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/JOSH.jpg" alt="Josh" />
              </div>
              <h3>Joshua Laxa</h3>
              <p className={styles.teamRole}>Lead Analyst</p>
              <div className={styles.teamContact}>
                <a href="mailto:joshua_laxa@dlsu.edu.ph">joshua_laxa@dlsu.edu.ph</a>
                <a href="https://www.linkedin.com/in/joshua-laxa-0b473a224/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/laxajosh" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Simplify Your Payroll?</h2>
            <p>Join companies that trust ledger.ly for their payroll management needs.</p>
            <Link to="/AccountRegistration" className={styles.ctaBtn}>
              Sign your company up now
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <img src="/images/ledger.png" alt="ledgerly" />
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 ledger.ly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
