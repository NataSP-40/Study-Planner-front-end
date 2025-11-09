import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";

import { signIn } from "../../services/authService";

import { UserContext } from "../../contexts/UserContext";
import styles from "./SignInForm.module.scss";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className={styles.signInContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in to continue your learning journey
        </p>
        {message && <p className={styles.errorMessage}>{message}</p>}
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Username:
            </label>
            <input
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
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
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.submitButton}>Sign In</button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
        <p className={styles.signupPrompt}>
          Don't have an account?{" "}
          <Link to="/sign-up" className={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignInForm;
