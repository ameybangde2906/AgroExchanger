import React from "react";

const StarRating = ({ rating }) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      // Render stars based on the index compared to the rating
      if (index < Math.floor(rating)) {
        return <span key={index}>&#9733;</span>; // Filled star (★)
      } else if (index < rating) {
        return (
          <span key={index} style={{ position: "relative" }}>
            <span style={{ position: "absolute", overflow: "hidden", width: "50%" }}>&#9733;</span>
            <span>&#9734;</span>
          </span>
        ); // Half-filled star
      } else {
        return <span key={index}>&#9734;</span>; // Empty star (☆)
      }
    });
  };

  return <div style={{ fontSize: "24px", color: "#FFD700" }}>{renderStars()}</div>;
};

export default StarRating;


