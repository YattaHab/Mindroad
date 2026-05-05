import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function RoadmapReviewsTab({
  reviews,
  avgRating,
  loggedIn,
  reviewContent,
  reviewRate,
  submittingReview,
  reviewError,
  reviewSuccess,
  onReviewContentChange,
  onReviewRateChange,
  onSubmitReview,
}) {
  return (
    <div>
      {/* Average rating summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900">{avgRating}</p>
            <div className="flex gap-0.5 mt-1 justify-center">
              <StarRating initialRating={Math.round(avgRating)} readOnly />
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {reviews.length} reviews
            </p>
          </div>
        </div>
      )}

      {/* Review cards */}
      <div className="flex flex-col gap-4 mb-10">
        {reviews.length === 0 && (
          <p className="text-gray-400">No reviews yet. Be the first!</p>
        )}
        {reviews.map((review) => (
          <div
            key={review.revId}
            className="bg-gray-50 rounded-xl p-5 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {(review.username || "U")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {review.username || "Learner"}
                </p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={
                        s <= review.rate
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            {review.content && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.content}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add review form */}
      {loggedIn ? (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Leave a Review</h3>

          <div className="mb-4">
            <StarRating
              initialRating={reviewRate}
              onRate={onReviewRateChange}
            />
          </div>

          <textarea
            value={reviewContent}
            onChange={(e) => onReviewContentChange(e.target.value)}
            placeholder="Share your experience with this roadmap..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none mb-4"
          />

          {reviewError && (
            <p className="text-red-500 text-sm mb-3">{reviewError}</p>
          )}
          {reviewSuccess && (
            <p className="text-green-500 text-sm mb-3">
              Review submitted! Thank you.
            </p>
          )}

          <button
            onClick={onSubmitReview}
            disabled={submittingReview}
            className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-60"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-500 mb-3">Sign in to leave a review</p>
          <Link
            to="/signin"
            className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
