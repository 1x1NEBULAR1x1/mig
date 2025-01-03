import { useUIStore } from "../../../stores/useUIStore.ts";
import styles from "./Header.module.css";

const HeaderSearch = ({classname} : {classname?: string}) => {

  const uiStore = useUIStore((state) => state);


  return (
    <div className={classname || styles.search}>
      <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667C15.8333 10.7068 15.3111 12.125 14.4339 13.2538L17.6726 16.4941L16.4941 17.6726L13.2538 14.4339C12.125 15.3111 10.7068 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5ZM9.16667 4.16667C6.40524 4.16667 4.16667 6.40524 4.16667 9.16667C4.16667 11.9281 6.40524 14.1667 9.16667 14.1667C11.9281 14.1667 14.1667 11.9281 14.1667 9.16667C14.1667 6.40524 11.9281 4.16667 9.16667 4.16667Z"
          fill="#56585F"/>
      </svg>
      <input
        type="text"
        value={uiStore.searchValue}
        onChange={(e) => uiStore.setSearchValue(e.target.value)}
        className={styles.input}
        placeholder="Поиск"
      />
    </div>
  );
}

export default HeaderSearch