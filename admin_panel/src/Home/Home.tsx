import classes from "../Classes.module.css"
import {useNavigationStore} from "../stores/useNavigationStore.ts";
import axios from "axios";
import {url} from "../requests/url.ts";
import {useEffect, useState} from "react";
import {getCodes} from "../requests/users.ts";

const Home = () => {

  const navStore = useNavigationStore(state => state)
  const [codes, setCodes] = useState<{code: string, is_used: boolean, phone_number: string}[]>([])

  const loginRequest = async () => {
    const {status} = await axios.post(url + '/admin/login', navStore.loginData, {withCredentials: true})
    if (status === 200) {
      navStore.setIsLogined(true)
    }
  }

  useEffect(() => {
    if (navStore.isLogined) {
       getCodes().then(codes => setCodes(codes))
    }
  }, [navStore.isLogined]);

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
          {codes && <div className={classes.menu}>
            {codes && codes.map(code =>
              <div className={classes.name}>{code.phone_number} - {code.code} - used: {code.is_used}</div>)
            }
          </div>}
        </div>}
    </div>
  )
}

export default Home