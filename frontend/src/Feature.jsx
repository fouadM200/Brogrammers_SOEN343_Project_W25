import React from "react";

const Feature = ({ image, title, description }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-900 p-6 text-white text-center transition-all duration-300 hover:border-blue-400 flex flex-col">
      <div className="h-40 flex justify-center items-center bg-gray-700">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg">Picture #{title}</span>
        )}
      </div>
      <h3 className="text-xl font-bold mt-4 flex-grow flex items-center justify-center">{title}</h3>
      <p className="mt-2 text-gray-400 text-sm flex-grow flex items-center justify-center">{description}</p>
    </div>
  );
};

export default Feature;