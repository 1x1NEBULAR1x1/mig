import styles from './Header.module.css'
import Logo from "../Logo.tsx";
import { useCitiesStore } from "../../../stores/useCitiesStore.ts";
import { useDataStore } from "../../../stores/useDataStore.ts";
import HeaderCategories from "./HeaderCategories.tsx";
import HeaderSearch from "./HeaderSearch.tsx";
import { useUIStore } from "../../../stores/useUIStore.ts";


const Header = () => {

  const citiesStore = useCitiesStore((state) => state);

  const dataStore = useDataStore((state) => state);

  const uiStore = useUIStore(state => state)
  return (
    <div className={styles.header}>
      {(!citiesStore.selectedCity || !citiesStore.selectedCity?.isAvailable) && <Logo type='header'/>}
      {citiesStore.selectedCity && citiesStore.selectedCity?.isAvailable &&
        <>
          <div
            className='flex flex-row h-full gap-2'
          >
						<div
              onClick={() => uiStore.setIsHeaderMenuOpened(!uiStore.isHeaderMenuOpened)}
              style={uiStore.isHeaderMenuOpened ? {background: '#56585F', transition: 'all 0.3s ease'} : {transition: 'all 0.3s ease'}}
              className={styles.menuIcon}>
              {!uiStore.isHeaderMenuOpened ? <svg width="2vh" height="2vh" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 14V16H0V14H20ZM20 7V9H0V7H20ZM20 0V2H0V0H20Z" fill="#1B1C1F"/>
              </svg> :
                <>
                  <svg width="2vh" height="2vh" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.41433 5.89953L11.657 1.65689L10.2428 0.242679L6.00012 4.48532L1.75748 0.242676L0.343266 1.65689L4.58591 5.89953L0.343262 10.1422L1.75748 11.5564L6.00012 7.31374L10.2428 11.5564L11.657 10.1422L7.41433 5.89953Z"
                      fill="white"/>
                  </svg>
                </>
              }
						</div>
						<Logo type='header'/>
					</div>

					<HeaderCategories/>
					<HeaderSearch/>
					<div
						className={styles.LocationAndAccountContainer}
					>
						<div
							className={styles.location}
							onClick={() => citiesStore.resetSelectedCity()}
						>
							<svg width="1.5vh" height="1.5vh" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fillRule="evenodd" clipRule="evenodd"
											d="M8.3125 4.83268C6.47155 4.83268 4.97917 6.32507 4.97917 8.16602C4.97917 10.007 6.47155 11.4993 8.3125 11.4993C10.1534 11.4993 11.6458 10.007 11.6458 8.16602C11.6458 6.32507 10.1534 4.83268 8.3125 4.83268ZM6.64583 8.16602C6.64583 7.24554 7.39203 6.49935 8.3125 6.49935C9.23297 6.49935 9.97917 7.24554 9.97917 8.16602C9.97917 9.08649 9.23297 9.83268 8.3125 9.83268C7.39203 9.83268 6.64583 9.08649 6.64583 8.16602Z"
											fill="#1B1C1F"/>
								<path fillRule="evenodd" clipRule="evenodd"
											d="M8.3125 0.666016C4.17036 0.666016 0.8125 4.02388 0.8125 8.16602C0.8125 10.9883 2.4489 13.3768 4.07741 15.0053C4.90213 15.83 5.75562 16.4916 6.46656 16.9516C6.82144 17.1812 7.15108 17.3673 7.43269 17.4995C7.57305 17.5654 7.712 17.6228 7.84335 17.6654C7.96012 17.7033 8.12993 17.7493 8.3125 17.7493C8.49507 17.7493 8.66487 17.7033 8.78165 17.6654C8.913 17.6228 9.05195 17.5654 9.1923 17.4995C9.47392 17.3673 9.80356 17.1812 10.1584 16.9516C10.8694 16.4916 11.7229 15.83 12.5476 15.0053C14.1761 13.3768 15.8125 10.9883 15.8125 8.16602C15.8125 4.02388 12.4546 0.666016 8.3125 0.666016ZM2.47917 8.16602C2.47917 4.94435 5.09084 2.33268 8.3125 2.33268C11.5342 2.33268 14.1458 4.94435 14.1458 8.16602C14.1458 10.3437 12.8656 12.3303 11.3691 13.8268C10.6313 14.5645 9.8702 15.153 9.25302 15.5523C8.94384 15.7524 8.68103 15.8983 8.48413 15.9908C8.41304 16.0241 8.35594 16.048 8.3125 16.0642C8.26906 16.048 8.21196 16.0241 8.14087 15.9908C7.94397 15.8983 7.68116 15.7524 7.37198 15.5523C6.7548 15.153 5.9937 14.5645 5.25592 13.8268C3.75943 12.3303 2.47917 10.3437 2.47917 8.16602ZM8.23477 16.0894L8.2385 16.0886C8.23596 16.0892 8.23477 16.0894 8.23477 16.0894ZM8.39023 16.0894L8.38652 16.0886L8.38834 16.089L8.39023 16.0894Z"
											fill="#1B1C1F"/>
							</svg>
              <p>{citiesStore.selectedCity.name}</p>
						</div>
            {!dataStore.number &&
              <div
                className={styles.account}
                onClick={() => uiStore.setIsLoginModalOpened(true)}
              >
                Войти
              </div>
            }
            {dataStore.number && !uiStore.isProfileOpened &&
              <div
                className={styles.account}
                onClick={() => uiStore.setIsProfileOpened(true)}
              >
                Аккаунт
              </div>
            }
            {dataStore.number && uiStore.isProfileOpened &&
							<div
								className={styles.accountExit}
								onClick={() => uiStore.setIsProfileOpened(false)}
							>
								<svg width="1.5vh" height="1.5vh" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M7.31252 8.17926L12.5566 13.4233L13.7351 12.2448L8.49103 7.00075L13.7351 1.75671L12.5566 0.578202L7.31252 5.82224L2.0684 0.578125L0.889893 1.75664L6.13401 7.00075L0.889893 12.2449L2.0684 13.4234L7.31252 8.17926Z"
										fill="#EEEFF3"/>
								</svg>
								Профиль
							</div>
            }

					</div>
				</>
      }
    </div>
  );
}

export default Header