import { useState, useEffect } from "react";
import { getPlacements } from "../../services/api";
// import Loader from "../../components/common/Loader";
// import PlacementOnBoardingPage from "./PlacementsOnBoardingPage";

function StudentDashboardPage() {
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlacements()
      .then((data) => setPlacement(data.results?.[0] || null))
      .catch(() => setPlacement(null))
      .finally(() => setLoading(false));
  }, []);

  // if (loading) return <Loader text="Loading your dashboard..." />;
  // if (!placement) return <PlacementOnBoardingPage />;
  return <div className="student-dashboard"> ...dashboard JSX...</div>;
}

export default StudentDashboardPage;
