"use client";
import { useState } from "react";
import { type UserType } from "../cabins/page";

type UsersTypeBeta = {
  users: UserType[];
};

const Counter = ({ users }: UsersTypeBeta) => {
  const [count, setCount] = useState(0);

  console.log(users);

  return (
    <div>
      <p>There are {users.length} Users</p>
      <button onClick={() => setCount((count) => count + 1)}>Click</button>
      <span>{count}</span>
    </div>
  );
};

export default Counter;
