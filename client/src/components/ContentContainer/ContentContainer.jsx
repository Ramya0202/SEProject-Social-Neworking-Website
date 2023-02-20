import React from "react";
import "./style.css";
import Contents from "../Contents/Contents";
import ContentShare from "../ContentShare/ContentShare";

export default function ContentContainer() {
  return (
    <div className="PostSide">
      <ContentShare />
      <Contents />
    </div>
  );
}
