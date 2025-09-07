import React from "react";

function Message({ type = "info", children }) {
  const colors = {
    info: "bg-blue-100 text-blue-700 border-blue-400",
    success: "bg-green-100 text-green-700 border-green-400",
    error: "bg-red-100 text-red-700 border-red-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
  };

  return (
    <div className={`border px-4 py-2 rounded ${colors[type]} mb-4`}>
      {children}
    </div>
  );
}

export default Message;