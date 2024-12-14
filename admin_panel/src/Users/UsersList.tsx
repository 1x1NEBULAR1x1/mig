import classes from "../Classes.module.css";
import {useUsersStore} from "../stores/useUsersStore.ts";


const UsersList = () => {

  const usersStore = useUsersStore(state => state)

  return (
    <div
      className={classes.menuList}
    >
      <div className={classes.menuTitle}>
        Список пользователей
      </div>
      <hr className={classes.hr}/>
      {usersStore.users.map((user, index) => (<>
          <div
            className={classes.city}
            onClick={() => usersStore.setUser(user)}
            key={user.id}
            style={usersStore.user?.id === user.id ? {color: "#1b9f01"} : {cursor: "pointer"}}
          >
            ID: {user.id} Номер телефона: {user.phoneNumber}
          </div>
          {index < usersStore.users.length - 1 && <hr className={classes.hr}/>}
        </>
      ))}
    </div>
  )
}

export default UsersList