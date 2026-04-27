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
    
}