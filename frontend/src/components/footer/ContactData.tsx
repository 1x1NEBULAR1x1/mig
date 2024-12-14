import styles from './Footer.module.css'
import ContactDataSocials from "./ContactDataSocials.tsx";

const ContactData = () => {

  return (
    <div
      className={styles.contactData}
    >
      <div
        className={styles.contactDataText}
      >
        {'+2 3212 88 09 00'}
      </div>
      <div
        className={styles.contactDataText}
      >
        {'hello@example.mail'}
      </div>
      <ContactDataSocials />
    </div>

  )
}

export default ContactData