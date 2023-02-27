import React, { useEffect, useState } from "react";
import "./style.css";
import { Images } from "../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import {
  API_URI,
  BUCKET_URI,
  DEPARTMENT,
  YEAR_OF_STUDY,
} from "../../utils/constant";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import { logout, updateUser } from "../../redux/action/AuthActions";
import { bucket } from "../../redux/action/BucketAction";
import {
  AiFillFilter,
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { Form, Input, Modal, Radio, Select, Space } from "antd";
import { getTimeline, openFilterModal } from "../../redux/action/ContentAction";
import axios from "axios";
import { HiLockClosed, HiOutlineLockClosed } from "react-icons/hi2";
import Toggle from "react-toggle";

const ProfileCard = ({ location }) => {
  const user = useSelector((state) => state.authReducer.data?.user);
  const [isVisible, setIsVisible] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [contentType, setContentType] = useState("all");

  const { password, ...other } = user;
  const [formData, setFormData] = useState(other);
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [contentCount, setContentCount] = useState(0);
  const [accountType, setAccountType] = useState("public");
  const { Option } = Select;

  const dispatch = useDispatch();

  useEffect(() => {
    getContentCount();
  }, []);

  const getContentCount = () => {
    axios
      .get(`${API_URI}/content/getContentCount`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("profile")).token
          }`,
        },
      })
      .then((res) => {
        setContentCount(res.data);
      })
      .catch((err) => {});
  };

  const handleSignOut = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1 className="center-text">Are you sure?</h1>
            <p className="center-text">You want to sign out?</p>
            <div className="button-row">
              <button className="button infoButton custom-no" onClick={onClose}>
                No
              </button>
              <button
                className="button infoButton custom-yes"
                onClick={() => {
                  dispatch(logout());
                  onClose();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setProfileImage(img);
      setProfileImageUrl(URL.createObjectURL(img));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let UserData = formData;
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      UserData.profilePicture = fileName;
      try {
        dispatch(bucket(data));
      } catch (err) {}
    }
    dispatch(
      updateUser(user._id, {
        ...UserData,
        course: department,
        yearOfStudy: yearOfStudy,
        accountType: accountType,
      })
    );
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setProfileImageUrl("");
      setProfileImage("");
    }, 600);
  };

  const handleSizeChange = (e) => {
    setContentType(e.target.value);
    const payload = {
      id:
        e.target.value === "followers"
          ? user.following
          : e.target.value === "myPost"
          ? user._id
          : "",
      department: "",
      yearOfStudy: "",
      loggedInUser: user?._id,
    };
    dispatch(getTimeline(payload));
  };

  const showDrawer = () => {
    dispatch(openFilterModal(true));
  };

  const handlePrivateChange = (value) => {
    setAccountType(value);
  };

  return (
    <div className="ProfileSide">
      {/* <NavigationBar /> */}

      <div className="ContentTypeCard">
        <div
          style={{
            justifyContent: "space-evenly",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Radio.Group
            buttonStyle="solid"
            value={contentType}
            onChange={handleSizeChange}
            className="ContentRadio"
          >
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="myPost">Mine</Radio.Button>
            <Radio.Button value="followers">Followers</Radio.Button>
          </Radio.Group>
          <div className="FilterIcon" onClick={showDrawer}>
            <AiFillFilter />
          </div>
        </div>
        <span className="FilterDesc">
          In this filter allows what's type of content you want to see on your
          timeline.
        </span>
      </div>

      <div className="ProfileCard">
        <div className="ProfileTopBox">
          <div onClick={() => setIsVisible(true)} className="EditProfileIcon">
            <AiOutlineSetting size={20} color="#fff" />
          </div>
          <div onClick={handleSignOut} className="SignOutProfileIcon">
            <AiOutlineLogout size={20} color="#fff" />
          </div>
        </div>
        <div className="ProfileImages">
          <img
            src={
              user.profilePicture
                ? BUCKET_URI + user.profilePicture
                : Images.DEFAULT_PROFILE
            }
            alt="CoverImage"
            className="ImageTag"
          />
        </div>
        <div className="ProfileName">
          <span className="username">@{formData.username}</span>
          <span className="name">
            {formData.firstname} {formData.lastname}
          </span>
        </div>

        <div className="followStatus">
          <div className="FollowColumn">
            <span className="followHeader">Posts</span>
            <span className="followValue">{contentCount}</span>
          </div>
          <div className="FollowColumn">
            <span className="followHeader">Followers</span>
            <span className="followValue">{user?.followers.length}</span>
          </div>
          <div className="FollowColumn">
            <span className="followHeader">Following</span>
            <span className="followValue">{user?.following.length}</span>
          </div>
        </div>
      </div>

      <Modal
        style={{
          top: 25,
        }}
        width={610}
        title="Your Informations"
        open={isVisible}
        onCancel={handleClose}
        onOk={handleSubmit}
        okText="Update"
      >
        <Form className="infoForm">
          <div className="ProfileTopContainer">
            <label for="file-upload" class="custom-file-upload">
              <img
                alt="profile"
                src={
                  profileImageUrl
                    ? profileImageUrl
                    : formData.profilePicture
                    ? BUCKET_URI + formData.profilePicture
                    : Images.IMAGE_EDIT
                }
                style={{ height: "100%", width: "100%", borderRadius: "50%" }}
              />
            </label>
            <div
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div className="LockIconContainer">
                <div
                  style={{
                    borderColor:
                      accountType === "private" ? "#bf40bf" : "black",
                  }}
                  className="LockIconCircle"
                >
                  <HiOutlineLockClosed
                    color={accountType === "private" ? "#bf40bf" : "black"}
                    size={25}
                  />
                </div>
                <div>
                  <Select
                    defaultValue={accountType}
                    style={{
                      width: 120,
                    }}
                    onChange={handlePrivateChange}
                    options={[
                      {
                        value: "private",
                        label: "Private",
                      },
                      {
                        value: "public",
                        label: "Public",
                      },
                    ]}
                  />
                </div>
              </div>
              <span style={{ textAlign: "center", fontWeight: "bold" }}>
                This Account is{" "}
                {accountType === "private" ? "Private" : "Public"}
              </span>
            </div>
          </div>

          <input
            onChange={onImageChange}
            id="file-upload"
            type="file"
            name="profileImage"
            style={{ display: "none" }}
          />
          <Space className="CenterSpace">
            <Input
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="firstname"
            />
            <Input
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="lastname"
            />
          </Space>

          <Space className="CenterSpace">
            <Input
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="email"
            />
            <Input
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="address"
            />
          </Space>

          <Space className="CenterSpace">
            <Input
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="phoneNumber"
              rules={[
                {
                  type: "number",
                  min: 10,
                  max: 10,
                },
              ]}
            />
            <Input
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              placeholder="Emergency Contact"
              style={{ width: 275 }}
              className="CustomAntInput"
              name="emergencyContactNumber"
            />
          </Space>
          <Space className="CenterSpace">
            <Select
              style={{ width: 275 }}
              placeholder="Select Department"
              name="course"
              value={formData.course}
              onSelect={(value) => setDepartment(value)}
            >
              {DEPARTMENT.map((department) => (
                <Option key={department.name} value={department.name}>
                  {department.name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 275 }}
              placeholder="Select Year of Study"
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onSelect={(value) => setYearOfStudy(value)}
            >
              {YEAR_OF_STUDY.map((year) => (
                <Option key={year.year} value={year.year}>
                  {year.year}
                </Option>
              ))}
            </Select>
          </Space>
        </Form>

        {/* <form className="infoForm">
          <label for="file-upload" class="custom-file-upload">
            <img
              alt="profile"
              src={
                profileImageUrl
                  ? profileImageUrl
                  : formData.profilePicture
                  ? BUCKET_URI + formData.profilePicture
                  : Images.IMAGE_EDIT
              }
              style={{ height: "100%", width: "100%", borderRadius: "50%" }}
            />
          </label>
          <input
            onChange={onImageChange}
            id="file-upload"
            type="file"
            name="profileImage"
          />

          <div>
            <input
              value={formData.firstname}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              name="firstname"
              className="infoInput"
            />
            <input
              value={formData.lastname}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              name="lastname"
              className="infoInput"
            />
          </div>

          <div>
            <input
              value={formData.address}
              onChange={handleChange}
              type="text"
              placeholder="Address"
              name="address"
              className="infoInput"
            />
            <input
              value={formData.email}
              onChange={handleChange}
              type="text"
              placeholder="Email"
              name="email"
              className="infoInput"
            />
          </div>

          <div>
            <input
              value={formData.phoneNumber}
              onChange={handleChange}
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              className="infoInput"
            />
            <input
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              type="text"
              placeholder="Emergency Contact"
              name="emergencyContactNumber"
              className="infoInput"
            />
            <input
              value={formData.course}
              onChange={handleChange}
              type="text"
              placeholder="Course"
              name="course"
              className="infoInput"
            />
          </div>

          <div>
            <input
              value={formData.yearOfStudy}
              onChange={handleChange}
              type="text"
              placeholder="Year of Study"
              name="yearOfStudy"
              className="infoInput"
            />
            <input
              value={formData.specialization}
              onChange={handleChange}
              type="text"
              placeholder="Specialization"
              name="specialization"
              className="infoInput"
            />
          </div>

          

          <button
            onClick={handleSubmit}
            className="button infoButton"
            type="submit"
          >
            Update
          </button>
        </form> */}
      </Modal>
    </div>
  );
};

export default ProfileCard;
