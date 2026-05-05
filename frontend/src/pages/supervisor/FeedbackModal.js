import { useState } from "react";
import './FeedbackModal.css';


const ACTION_LABELS =   {
    revision_requested: { title: 'Requested Revision', color: '#c05621', cta: 'Send Revision Request' },
    rejected:           { title: 'Reject Log Entry', color: '#c53030', cta: 'Submit Rejection' },  
};

function FeedbackModal({ studentName, action, onClose, onSubmit }) {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const cfg = ACTION_LABELS[action];
    const isValid = comment.trim().length >= 10;

    
}

