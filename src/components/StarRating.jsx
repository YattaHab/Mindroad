import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({
  maxRating = 5,
  onRate,
  initialRating = 0,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index) => {
    const newRating = index + 1;
    setRating(newRating);
    if (onRate) onRate(newRating);
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
            className={`cursor-pointer transition-all duration-200 ${
              i < (hoverRating || rating)
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {(hoverRating || rating) > 0 && (
        <p className="text-yellow-500 text-lg font-semibold">
          {hoverRating || rating}
        </p>
      )}
    </div>
  );
}
