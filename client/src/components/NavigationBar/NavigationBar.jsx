import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { BsFillChatFill } from "react-icons/bs";
import "./style.css";

export default function NavigationBar() {
  return (
    <div className="navIcons">
      <Link to="../home">
        <AiFillHome className="nav-icon" size={25} />
      </Link>
      <Link>
        <IoNotifications className="nav-icon" size={25} />
      </Link>
      <Link>
        <BsFillChatFill className="nav-icon" size={24} />
      </Link>
    </div>
  );
}
