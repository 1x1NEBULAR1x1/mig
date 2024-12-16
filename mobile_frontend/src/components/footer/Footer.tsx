import styles from './Footer.module.css'
import ContactData from "./ContactData.tsx";
import Logo from "../Logo.tsx";
import FooterInfo from "./FooterInfo.tsx";

const Footer = () => {

  return (
    <div
      className={styles.footer}
    >
      <div
        className={styles.logoAndCopyrightContainer}
      >
        <Logo type='footer'/>
        <p
          className={styles.copyright}
        >
          © 2024 «Миг»
        </p>
      </div>
      <div
        className={styles.infoContainer}
      >
        <FooterInfo />
      </div>
      <ContactData />
    </div>
  );
}

export default Footer