import React, { useEffect, useState } from "react";
import { getLogbooks, createLogbook } from "../services/api";

function LogbookPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLoading(true);
    getLogbooks()
      .then((data) => setLogs(data.results || data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (formData) => {
    const newlog = await createLogbook({
      week_number: formData.weekNumber,
      start_date: formData.startDate,
      end_date: formData.endDate,
      activities: formData.activities,
      status: formData.submitNow ? undefined : "draft",
    });
    setLogs((prev) => [newlog, ...prev]);
  };

  return <h1> LOGBOOK PAGE</h1>;
}

export default LogbookPage;
