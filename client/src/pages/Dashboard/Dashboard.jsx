import React from "react";
import PostContainer from "../../components/ContentContainer/ContentContainer";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import RightContainer from "../../components/RightContainer/RightContainer";
import "./style.css";

const Dashboard = () => {
  return (
    <div className="Home">
      <ProfileCard location="homepage" />
      <PostContainer />
      <RightContainer />
    </div>
  );
};

export default Dashboard;
