import React from "react";
import { Modal, message, Result, Input } from "antd";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { getAllUsers } from "../../services/User";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { createAnnouncement } from "../../services/Announcement";
import { openHelpModal } from "../../redux/action/HelpAction";
import { sendHelp } from "../../services/Help";

export default function HelpModal({ visible, onCancel }) {
  const { TextArea } = Input;
  const [question, setQuestion] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.authReducer.data);

  const handleChange = useCallback(
    (e) => {
      setQuestion(e.target.value);
    },
    [setQuestion]
  );

  const closeHelpModal = () => {
    dispatch(openHelpModal(false));
  };

  //submit-handler
  const handleSubmit = async () => {
    const payload = {
      firstname: user?.firstname,
      email: user?.email,
      question: question,
    };
    try {
      await sendHelp(payload);
      closeHelpModal();
      setQuestion("");
    } catch (error) {}
  };

  return (
   
  );
}
