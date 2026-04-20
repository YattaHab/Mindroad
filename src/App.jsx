import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AllTracksPage from "./pages/AllTracksPage.jsx";
import TrackPage from "./pages/TrackPage.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";
import RoadmapCommentPage from "./pages/RoadmapCommentPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/tracks" element={<AllTracksPage />} />
      <Route path="/tracks/:trackId" element={<TrackPage />} />
      <Route path="/tracks/:trackId/:roadmapId" element={<RoadmapPage />} />
      {/* <Route
        path="/tracks/:trackId/:roadmapId/:topicId/comments"
        element={<RoadmapCommentPage />}
      /> */}
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/tracks/:trackId/:roadmapId/:topicId/comments"
        element={
          <ProtectedRoute>
            <RoadmapCommentPage />
          </ProtectedRoute>
        }
      />{" "}
    </Routes>
  );
}

export default App;
