import classes from "../Classes.module.css"
import {useNavigationStore} from "../stores/useNavigationStore.ts";
import axios from "axios";
import {url} from "../requests/url.ts";
const Home = () => {

  const navStore = useNavigationStore(state => state)

  const loginRequest = async () => {
    const {status} = await axios.post(url + 'admin/login', navStore.loginData, {withCredentials: true})
    if (status === 200) {
      navStore.setIsLogined(true)
    }
  }

  return (
    <div className={classes.content}>
      {!navStore.isLogined ? <div className={classes.home}>
        <div className={classes.input}>
          Введите логин
          <input
            type="text"
            value={navStore.loginData.login}
            onInput={(e) => navStore.setLoginData({...navStore.loginData, login: e.currentTarget.value})}
          />
        </div>
          <div className={classes.input}>
            Введите пароль
            <input
              type="text"
              value={navStore.loginData.hashedPassword}
              onInput={(e) => navStore.setLoginData({...navStore.loginData, hashedPassword: e.currentTarget.value})}
            />
          </div>
        <div
          className={classes.apply}
          onClick={async () => await loginRequest()}
        >
          Войти
        </div>
      </div> :
        <div className={classes.home}>
          Вы зарегистрированы как администратор
          <div
            className={classes.logout}
            onClick={() => {
              document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              navStore.setIsLogined(false)
            }}
          >
            Выйти
          </div>
        </div>}
    </div>
  )
}

export default Home