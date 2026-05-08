import { useState, useEffect, useActionState } from 'react';
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
                        <div className="ws-card-header">
                            <div className="ws-avatar">{log.student_name?.slice(0,2).toUpperCase()}</div>
                            <div>
                                <p className="ws-student-name">{log.student_name}</p>
                                <p className="ws-student-meta">Week {log.week number} . {log.company_name}</p>
                            </div>
                            <span className="badge badge-pending">Pending</span>                       
                          </div>


                          /*Log preview */
                          <div className="ws-card-body">
                            <p className="ws-log-preview">{log.activities}</p>
                          </div>

                          /* Action buttons */
                          <div className="ws-card-actions">
                            <button className="btn-ghost"
                              onClick={() => handleActionWithComment(log, 'revision_requested')}>
                              🔄 Request Revision
                            </button>
                            <button className="btn-danger"
                              onClick={() => handleActionWithComment(log,'rejected')}>
                              ✕ Reject
                            </button>
                            <button className="btn-success"
                              onClick={() => handleApprove(log.id)}>
                              ✓Approve
                             </button>
                           </div>
                         </div>
                        ))}
                      </div>

                      {modalLog && (
                        <Feedbackmodal
                          studentName={modalLog.student_name}
                          action={pendingAction}
                          onClose={() => setModalLog(null)}
                          onSubmit={handleReviewSubmit}
                        />
                      )}
                    </div>
                );
            } 
                      
        