import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({ maxRating }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index) => {
    setRating(index + 1);
  };

  const handleMouseEnter = (index) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            size={24}
            key={i}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            className={`text-yellow-500 block cursor-pointer transition-all duration-200 ${i < (hoverRating || rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
      <p className="text-yellow-500 text-lg font-semibold">
        {hoverRating || rating || ""}
      </p>
    </div>
  );
}
