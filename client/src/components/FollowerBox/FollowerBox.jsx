import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { follow, unfollow } from "../../redux/action/AuthActions";
import { BUCKET_URI } from "../../utils/constant";

export default function FollowerBox({ follower, idx }) {
  const user = useSelector((state) => state.authReducer.data).user;
  const dispatch = useDispatch();

  const [following, setFollowing] = useState(
    follower.followers.includes(user._id)
  );

  const handlefollowUnfollow = () => {
    following
      ? dispatch(unfollow(follower?._id, user))
      : dispatch(follow(follower?._id, user));
    setFollowing((prev) => !prev);
  };

  return (
    <div key={idx} className="follower">
      <div>
        <img
          src={
            follower.profilePicture
              ? BUCKET_URI + follower.profilePicture
              : Images.DEFAULT_PROFILE
          }
          alt="profile"
          className="followerImage"
        />
        <div className="name">
          <span>{follower.firstname}</span>
          <span>@{follower.username}</span>
        </div>
      </div>
      <button
        onClick={handlefollowUnfollow}
        className={
          following ? "button fc-button UnfollowButton" : "button fc-button"
        }
      >
        <AiOutlinePlus className="plus-icon" />{" "}
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}
