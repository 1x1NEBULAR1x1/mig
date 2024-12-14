import classes from "../Classes.module.css";
import {useUsersStore} from "../stores/useUsersStore.ts";
import {useEffect} from "react";
import {getUsers} from "../requests/users.ts";
import UsersList from "./UsersList.tsx";
import UserUpdate from "./UserUpdate.tsx";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {getCities} from "../requests/cities.ts";

const UsersContent = () => {

  const usersStore = useUsersStore(state => state)

  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {
    getCities().then(cities => citiesStore.setCities(cities))
    getUsers().then(users => usersStore.setUsers(users))
  }, []);

  return (
    <div
      className={classes.content}
    >
      <UsersList />
      <UserUpdate />
    </div>
  )
}

export default UsersContent