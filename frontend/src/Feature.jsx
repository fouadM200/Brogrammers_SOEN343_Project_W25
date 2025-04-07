// Feature.jsx
import React from "react";

const Feature = ({ image, title, description }) => {
  return (
    <div className="p-4 border-2 border-transparent hover:border-blue-500 transition-colors duration-300">
      {image && (
        <div className="w-32 aspect-square mx-auto overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="mt-2 text-gray-300">{description}</p>
    </div>
  );
};

export default Feature;
