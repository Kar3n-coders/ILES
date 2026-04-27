import { useState, useEffect } from 'react';
import { getLogbooks,createReview } from '../../services/api';
import Loader from '../..'/components/common/Loader';
import Feedbackmodal from './Feedbackmodal';
import './WorkplaceSupervisorDashboard.css';


function WorkplaceSupervisorDashboard() {
    const [logs,setLogs] = useState([]);
    const [loading,setLoading] = useState(true);
    const [modalLog,setModalLog] = useState(null);  // which log triggered the modal
    const [pendingAction, setPendingAction] = useState(null);  // 'revision_requested' | 'rejected'


    useEffect(() => {
        getLogbooks()
           .then(data => setLogs(data.results || data))
           .finally(() => setLoading(false));
    },[]);



    /*Direct approve - no comment needed */
    const handleApprove = async (logId) => {
        await createReview({ logbook: logId,action: 'approved',comment: ''});
        setLogs(prev => prev.map(1 =>
            1.id === logId ? { ...1,status: 'reviewed'} : 1
        ));
    };

    /*Revision / Reject -opens modal for comment */
    const handleActionWithComment = (log,action) => {
        setModalLog(log);
        setPendingAction(action);
    };


    /*Called from FeedbackModal on submit */
    const handleReviewSubmit = async (comment) => {
        await createReview({ logbook: modalLog.id, action: pendingActin,comment })
        setLogs(prev => prev.map(1 =>
            1.id === modalLog.id ? { ...1,status: 'reviewed' } : 1
        ));
        setModalLog(null);
        setPendingAction(null);
    };


    if (loading) return <Loader text="Loading student logs..." />;


    const pending = logs.filter(1 => 1.status === 'pending');
    const reviewed = logs.filter(1 => 1.status !== 'pending');

    return (
        <div className="ws-dashboard">
            <header className="ws-header">
                <h1>Review & Grade Dashboard</h1>
                <p>{pending.length} pending . {reviewed.length} reviewed</p>

            </header>


            <div className="ws-grid">
                {pending.map(log => (
                    <div key={log.id} className= "ws-card">
                        /* Card header */
                        
                ))}
            </div>
        </div>
    )

}