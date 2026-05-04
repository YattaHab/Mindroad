import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({
  maxRating = 5,
  onRate,
  initialRating = 0,
  readOnly = false,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index) => {
    if (readOnly) return;
    const newRating = index + 1;
    setRating(newRating);
    if (onRate) onRate(newRating);
  };

  const handleMouseEnter = (index) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const displayValue = readOnly ? initialRating : hoverRating || rating;
  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            size={20}
            key={i}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            className={`cursor-pointer transition-all duration-200 ${
              i < displayValue
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            } ${readOnly ? "" : "cursor-pointer"}`}
          />
        ))}
      </div>
      {!readOnly && displayValue > 0 && (
        <p className="text-yellow-500 text-sm font-semibold">{displayValue}</p>
      )}
    </div>
  );
}
