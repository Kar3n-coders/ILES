import { useState, useEffect } from "react";
import { getPlacements } from '../../services/api';
import Loader from '../../components/common/Loader';
import PlacementOnboardingPage from './PlacementsOnboardingPage';

function StudentDashboardPage() {
  const [placement, setPlacement] = usestate(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlacements()
    .then(data => setPlacement(data.results?.[0] || null))
    .catch(() => setPlacement(null))
    .finally(() => setLoading(false));
  }, []);
  
}


export default StudentDashboardPage;
