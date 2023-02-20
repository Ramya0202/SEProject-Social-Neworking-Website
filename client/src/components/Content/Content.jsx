import { Dropdown, message, Modal, Popconfirm } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  AiFillCamera,
  AiFillLike,
  AiOutlineComment,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineSend,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { bucket, updateBucket } from "../../redux/action/BucketAction";
import { getTimeline } from "../../redux/action/ContentAction";
import { updateImage } from "../../services/Bucket";
import { likeOrDislike } from "../../services/Content";
import { API_URI, BUCKET_URI } from "../../utils/constant";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import _ from "lodash";

export default function Content({ content }) {
  const videoJsOptions = {
    autoplay: false,
    width: 660,
    height: 320,
    controls: true,
    muted: true,
  };

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const imageRef = useRef();
  const videoRef = useRef();
  const comment = useRef();

  const { user } = useSelector((state) => state.authReducer.data);
  const publishloading = useSelector((state) => state.contentReducer.loading);

  const [liked, setLiked] = useState(content.likes.includes(user._id));
  const [likes, setLikes] = useState(content.likes.length);
  const [isVisible, setIsVisible] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [contentImage, setContentImage] = useState(BUCKET_URI + content?.image);
  const [description, setDescription] = useState(content?.desc);
  const [contentVideo, setContentVideo] = useState(BUCKET_URI + content?.video);
  const [commentCount, setCommentCount] = useState(content?.comments?.length);

  const onConfirm = () => {
    messageApi.open({
      type: "loading",
      content: "Deleting in progress...",
    });
    axios
      .delete(`${API_URI}/content/${content._id}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("profile")).token
          }`,
        },
      })
      .then((res) => {
        const payload = {
          id: "",
          department: "",
          yearOfStudy: "",
        };
        dispatch(getTimeline(payload));
        messageApi.destroy();
        messageApi.open({
          type: "success",
          content: "Content deleted.",
        });
      })
      .catch((err) => {
        messageApi.destroy();
      });
  };

  const items = [
    {
      label: "Edit",
      key: "1",
      icon: <AiOutlineEdit />,
    },
    {
      label: (
        <Popconfirm
          title="Delete the content"
          description="Are you sure to delete this content?"
          onConfirm={onConfirm}
          okText="Yes"
          cancelText="No"
        >
          Remove
        </Popconfirm>
      ),
      key: "2",
      icon: <AiOutlineDelete />,
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "1") setIsVisible(true);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleClose = () => {
    setIsVisible(false);
    setContentImage(BUCKET_URI + content?.image);
    setContentVideo(BUCKET_URI + content?.video);
  };

  const handleCommentOpen = () => {
    setIsCommentVisible(true);
  };
  const handleCommentClose = () => {
    setIsCommentVisible(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const warning = () => {
      messageApi.open({
        type: "warning",
        content: "Write something!",
      });
    };

    if (description === "" && image === null && video === null) {
      warning();
    } else {
      messageApi.open({
        type: "loading",
        content: "Uploading in progress...",
      });
      const newPost = {
        desc: description,
      };

      if (image) {
        const data = new FormData();
        const fileName = Date.now() + image.name;
        data.append("name", fileName);
        data.append("file", image);
        newPost.image = fileName;
        newPost.video = "";
        try {
          const contentName =
            content?.image === "" ? content?.video : content?.image;
          dispatch(updateBucket(contentName, data));
        } catch (err) {}
      }

      if (video) {
        const data = new FormData();
        const fileName = Date.now() + video.name;
        data.append("name", fileName);
        data.append("file", video);
        newPost.video = fileName;
        newPost.image = "";
        try {
          const contentName =
            content?.image === "" ? content?.video : content?.image;
          dispatch(updateBucket(contentName, data));
        } catch (err) {}
      }
      axios
        .put(`${API_URI}/content/updateContent/${content._id}`, newPost, {
          headers: { "Access-Control-Allow-Origin": "*" },
        })
        .then((res) => {
          const payload = {
            id: "",
            department: "",
            yearOfStudy: "",
          };
          dispatch(getTimeline(payload));
          messageApi.destroy();
          messageApi.open({
            type: "success",
            content: "Uploading finished.",
          });
        })
        .catch((err) => {
          messageApi.destroy();
        });

      reset();
    }
  };

  const handleLike = () => {
    likeOrDislike(content._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const handleComment = () => {
    const payload = {
      userId: user?._id,
      postId: content?._id,
      comment: comment.current.value,
    };
    axios
      .put(`${API_URI}/content/comment`, payload, {
        headers: { "Access-Control-Allow-Origin": "*" },
      })
      .then((res) => {
        setCommentCount((prev) => prev + 1);
        comment.current.value = "";
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: "There was an issue while comment.",
        });
      });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let content = event.target.files[0];
      if (event.target.name === "video") {
        setVideo(content);
        setContentVideo(URL.createObjectURL(content));
        setContentImage(null);
      } else {
        setImage(content);
        setContentImage(URL.createObjectURL(content));
        setContentVideo(null);
      }
    }
  };

  const reset = () => {
    setImage(null);
    setVideo(null);
  };

  const isDisableUpdate = () => {
    if (
      description === content?.desc &&
      contentImage === BUCKET_URI + content?.image &&
      contentVideo === BUCKET_URI + content?.video
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="Post">
      {contextHolder}
      <div className="post-user-container">
        <div className="post-user-left">
          <img
            className="post-user-profile"
            src={
              content.users.profilePicture
                ? BUCKET_URI + content.users.profilePicture
                : Images.DEFAULT_PROFILE
            }
            alt="profile"
          />
          <div className="post-user-details">
            <span className="post-username">{content.users.username}</span>
            <span className="post-time">
              {moment(content.createdAt).fromNow()}
            </span>
          </div>
        </div>
        {content?.userId === user?._id && (
          <div>
            <Dropdown
              menu={menuProps}
              trigger={["click"]}
              placement="topRight"
              arrow
            >
              <FiMoreHorizontal className="MoreOption" />
            </Dropdown>
          </div>
        )}
      </div>
      {content.desc && <span className="post-desc">{content.desc}</span>}
      {content.image && (
        <img src={BUCKET_URI + content.image} alt="Timeline Content" />
      )}
      {content.video && (
        <VideoPlayer
          {...videoJsOptions}
          sources={[
            {
              src: BUCKET_URI + content.video,
              type: "video/mp4",
            },
          ]}
        />
      )}

      <div className="like-row">
        <div className="LikeRow">
          <div onClick={handleLike} className="postReact">
            {liked ? (
              <AiFillLike
                style={{ cursor: "pointer" }}
                size={24}
                color="#246ee9"
              />
            ) : (
              <AiOutlineLike style={{ cursor: "pointer" }} size={24} />
            )}
          </div>
          <span className="like-text">{likes} likes</span>
        </div>

        <div onClick={handleCommentOpen} className="CommentRow">
          <div className="postReact">
            <AiOutlineComment style={{ cursor: "pointer" }} size={24} />
          </div>
          <span className="like-text">{commentCount} Comments</span>
        </div>
      </div>

      <div className="CommentSection">
        <img
          src={
            user?.profilePicture
              ? BUCKET_URI + user?.profilePicture
              : Images.DEFAULT_PROFILE
          }
          alt="Profile"
          className="commentProfile"
        />
        <input
          ref={comment}
          type="text"
          placeholder="Write your comment..."
          required
          className="CommentInput"
        />
        <div onClick={handleComment} className="SendComment">
          <AiOutlineSend color="#fff" />
        </div>
      </div>

      <Modal
        style={{
          top: 25,
        }}
        width={700}
        title="Update your timeline content"
        open={isVisible}
        onCancel={handleClose}
        okText="Update"
        footer={null}
      >
        <div className="PostShare">
          {contextHolder}
          <img
            src={
              user.profilePicture
                ? BUCKET_URI + user.profilePicture
                : Images.DEFAULT_PROFILE
            }
            alt="Profile"
          />
          <div>
            <input
              value={description}
              type="text"
              placeholder={`What's on your mind, ${user?.username} ?`}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="postOptions">
              <div
                onClick={() => imageRef.current.click()}
                className="option"
                style={{ color: "var(--photo)" }}
              >
                <AiFillCamera style={{ marginRight: "3px" }} size={25} />
                <span className="option-title"> Photo</span>
              </div>

              <div
                onClick={() => videoRef.current.click()}
                className="option"
                style={{ color: "var(--shedule)" }}
              >
                <AiOutlineVideoCameraAdd
                  style={{ marginRight: "3px" }}
                  size={25}
                />
                <span className="option-title"> Video</span>
              </div>
              <button
                disabled={isDisableUpdate()}
                onClick={handleUpload}
                className="button ps-button"
              >
                {publishloading ? "uploading" : "Update"}
              </button>

              <div style={{ display: "none" }}>
                <input
                  type="file"
                  ref={imageRef}
                  onChange={onImageChange}
                  name="image"
                  accept="image/png, image/gif, image/jpeg"
                />
              </div>
              <div style={{ display: "none" }}>
                <input
                  type="file"
                  ref={videoRef}
                  name="video"
                  onChange={onImageChange}
                  accept="video/mp4,video/x-m4v,video/*"
                />
              </div>
            </div>
          </div>
        </div>

        {contentImage && (
          <img
            src={contentImage}
            alt="TimelinePicture"
            className="EditTimelineImage"
          />
        )}
        {contentVideo && (
          <video
            src={contentVideo}
            alt="TimelinePicture"
            className="EditTimelineImage"
          />
        )}
      </Modal>

      <Modal
        style={{
          top: 25,
        }}
        width={700}
        title="Comments"
        open={isCommentVisible}
        onCancel={handleCommentClose}
        footer={null}
      >
        {_.isEmpty(content?.comments) ? (
          <span>No Comments</span>
        ) : (
          content?.comments?.map((com, index) => (
            <div key={index} className="CommentView">
              <img
                src={
                  com.user?.profilePicture
                    ? BUCKET_URI + com.user?.profilePicture
                    : Images.DEFAULT_PROFILE
                }
                alt="profile"
                className="commentProfile"
              />
              <div className="CommentBackground">
                <span className="CommenterName">@{com.user?.username}</span>
                <span className="CommenterValue">{com?.comment}</span>
              </div>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
}
