import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";

import { signUp } from "../../services/authService";

import { UserContext } from "../../contexts/UserContext";
import styles from "./SignUpForm.module.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className={styles.signUpContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          Join us and start organizing your studies
        </p>
        {message && <p className={styles.errorMessage}>{message}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username:
            </label>
            <input
              type="text"
              id="name"
              value={username}
              name="username"
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Enter your username"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirm" className={styles.label}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Confirm your password"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button disabled={isFormInvalid()} className={styles.submitButton}>
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
        <p className={styles.loginPrompt}>
          Already have an account?{" "}
          <Link to="/sign-in" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUpForm;
