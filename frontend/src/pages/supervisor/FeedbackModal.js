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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setSubmitting(true);
        await onSubmit(comment.trim());
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header" style={{ borderTop:  `3px solid ${cfg.color}` }}>
                    <h3>{cfg.title}</h3>
                    <p>Feedback for: <strong>{studentName}</strong></p>
                    <button className="modal-close" onClick={onClose}>✕</button> 
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                    <label>Your Comment (required)</label>
                    <textarea
                      rows={5} value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Be specific about what needs to change or why you're rejecting this entry..."
                    />
                    <p className="modal-hint">{comment.trim().length}/10 minimum characters</p>
                    <div className="modal-actions">
                        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={!isValid || submitting}
                          className="btn-primary" style={{ background: cfg.color}}>
                            {submitting ? 'Submitting...' : cfg.cta}
                          </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

