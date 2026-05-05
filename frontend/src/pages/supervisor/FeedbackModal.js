import { useState } from "react";
import './FeedbackModal.css';


const ACTION_LABELS =   {
    revision_requested: { title: 'Requested Revision', color: '#c05621', cta: 'Send Revision Request' },
    rejected:           { title: 'Reject Log Entry', color: '#c53030', cta: 'Submit Rejection' },  
};

