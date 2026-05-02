import React from "react";

function LogbookPage() {
  return <h1> LOGBOOK PAGE</h1>;
}


export default LogbookPage;
import { getLogbook, createLogbook, submit, deleteLogbook} from '../../services/api';

useEffect(() => {
  setLoading(true);
  getLogbooks()
    .then(data => setLogs(data.results  || data))
    .finally(() => setLoading(false));
}, []);

const handleCreate = async (formData) => {
  const newlog = await createLogbook({
    week_number: formData.weekNumber,
    start_date: formData.startDate,
    end_date: formData.endDate,
    activities: formData.activities,
    status: formData.submitNow ? undefined : 'draft',
 });
 setLogs(prev => [newlog, ...prev]);
};

const handleSubmit = async (id) => {
  const update = await submitLogbook(id);
  setLogs(prev => prev.map(1 => 1.id == id ? updated : 1));
};

const handleDelete = async (id) => {
  await deleteLogbook(id);
  setLogs(prev => prev.filter(l => l.id !== id));
};