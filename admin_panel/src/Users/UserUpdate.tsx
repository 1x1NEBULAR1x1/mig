import classes from "../Classes.module.css";
import {useUsersStore} from "../stores/useUsersStore.ts";
import {updateUser} from "../requests/users.ts";

const UserUpdate = () => {

  const usersStore = useUsersStore(state => state)

  const applyChanges = async () => {
    if (!usersStore.user) return
    await updateUser(usersStore.user)
    usersStore.setIsUpdateSuccess(true)
  }

  return (
    <div
      className={classes.menu}
    >
      <div className={classes.menuTitle}>
        Редактирование пользователя
      </div>
      {usersStore.user ? <div>
        <div className={classes.name}>
          ID: {usersStore.user.id}
        </div>
        <div className={classes.name}>
          Номер телефона: {usersStore.user.phoneNumber}
        </div>
        <div className={classes.name}>
          Город: {usersStore.user.city.name}
        </div>
        <div className={classes.isAvailable}>
          Статус аккаунта: {usersStore.user.isBanned ? "Забанен" : "Активный"}
          <input
            type="checkbox"
            onInput={() => usersStore.setUser({...usersStore.user!, isBanned: !usersStore.user!.isBanned})}
            checked={!usersStore.user.isBanned}
          />
        </div>
        <div
          className={classes.apply}
          onClick={async () => await applyChanges()}
        >
          Применить изменения
        </div>
        {usersStore.isUpdateSuccess && <div className={classes.success}>Изменения успешно применены</div>}
        <div className={classes.name}>
          Дата регистрации: {usersStore.user.created}
        </div>
        <div className={classes.name}>
          Список заказов:
          {usersStore.user.orders.map((order, index) => (
            <div>
              <div
                className={classes.name}
              >
                Заказ номер {order.id}, cтатус: {order.status.name}
              </div>
              {index < usersStore.user!.orders.length - 1 && <hr className={classes.hr}/>}
            </div>
          ))}
        </div>
        <div className={classes.name}>
          Адреса пользователя:
          {usersStore.user.addresses.map((address, index) => (
            <>
              Адрес: ул. {address.street}, д. {address.house}, п. {address.entrance}, эт. {address.floor},
              кв. {address.flat}
              {index < usersStore.user!.addresses.length - 1 && <hr className={classes.hr}/>}
            </>
          ))}
          {usersStore.user.addresses.length === 0 && <> Нет адресов</>}
        </div>
      </div> : <div>Выберите пользователя из списка</div>}
    </div>
  )
}

export default UserUpdate