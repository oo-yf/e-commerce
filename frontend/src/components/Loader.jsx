import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;