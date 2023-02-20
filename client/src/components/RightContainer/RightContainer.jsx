import { Radio } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillFilter, AiOutlinePlus } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { getAllUsers } from "../../services/User";
import { API_URI, BUCKET_URI } from "../../utils/constant";
import FollowerBox from "../FollowerBox/FollowerBox";
import NavigationBar from "../NavigationBar/NavigationBar";
import SearchFollowers from "../SearchFollowers/SearchFollowers";
import "./style.css";

export default function RightContainer() {
  const [suggestedPersons, setSuggestedPersons] = useState([]);

  const user = useSelector((state) => state.authReducer.data).user;

  const fetchPersons = async (username) => {
    try {
      const { data } = await getAllUsers({ username: username });
      setSuggestedPersons(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleFilter = (value) => {
    fetchPersons(value);
  };

  return (
    <div className="RightSide">
      <NavigationBar />
      <SearchFollowers onChange={(e) => handleFilter(e.target.value)} />
      <div className="FollowersCard">
        <h3 className="around-people-text">People you may know</h3>
        {suggestedPersons.map((person, idx) => {
          if (person._id !== user?._id) {
            return <FollowerBox follower={person} idx={idx} />;
          }
        })}
      </div>
    </div>
  );
}
