import logo from "src/assets/logo.png";
import "./styles.scss";

export const Logo = () => {
  return (
    <div className="logo">
      <img src={logo} alt="logo" />
      <p className="logo-text">surround::dots</p>
    </div>
  );
};
