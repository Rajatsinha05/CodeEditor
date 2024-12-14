import React from "react";
import ReactQuill from "react-quill";

const RichTextEditor = ({ value, onChange, inputBgColor, textColor }) => (
  <ReactQuill
    value={value}
    onChange={(content) =>
      onChange({ target: { name: "description", value: content } })
    }
    theme="snow"
    style={{
      backgroundColor: inputBgColor,
      color: textColor,
      border: "1px solid",
      borderRadius: "5px",
      minHeight: "150px",
    }}
  />
);

export default RichTextEditor;
