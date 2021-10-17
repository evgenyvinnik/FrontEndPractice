import React, { useState } from "react";

const App = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch("/users/");
    const data = await response.json();
    return data;
  }

  //useEffect(addFavorite, [])

  const getUsers = async () => {
    const retrievedUsers = await fetchUsers();
    console.log(retrievedUsers);
    setUsers(retrievedUsers);
  }

  return (
    <div>
      <button onClick={getUsers}>Fetch Users</button>
    </div>
  )
}

export default App;
