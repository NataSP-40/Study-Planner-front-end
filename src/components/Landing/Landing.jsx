import { Link } from 'react-router';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <main className={styles.landingContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.leftSection}>
          <Link to="/sign-in" className={styles.loginLink}>
            Already a User? Login
          </Link>
          <h1 className={styles.appName}>Study Planner</h1>
          <p className={styles.welcomeMessage}>
            Welcome! Organize your studies, track your progress, and achieve your learning goals with ease.
          </p>
          <Link to="/sign-up" className={styles.ctaButton}>
            Get Started
          </Link>
        </div>
        <div className={styles.rightSection}>
          {/* Image will be added here later */}
          <div className={styles.imagePlaceholder}>
            <p>Your image goes here</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
