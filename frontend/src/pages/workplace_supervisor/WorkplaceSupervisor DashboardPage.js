import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHead, Card, Stat, Btn, Chip, Bar, Av } from '../components/common/Primitives';
import { I } from '../components/common/Icons';
import '../components/common/Primitives.css';

const DEMO_USERNAMES = ['maria.reyes', 'john.doe', 'dr.santos', 'prof.torres', 'admin'];

const DEMO_INTERNS = [
  { id: 1,  name: 'Karen Kawooya',   prog: 58, last: 'Today',      hrs: '248', status: 'Awaiting review', avKind: undefined },
  { id: 2,  name: 'Joseph Mukasa',   prog: 75, last: 'Yesterday',  hrs: '312', status: 'Up to date',      avKind: 'green'   },
  { id: 3,  name: 'Aisha Nansubuga', prog: 42, last: '3 days ago', hrs: '180', status: 'Overdue',         avKind: 'orange'  },
  { id: 4,  name: 'Brian Otim',      prog: 66, last: 'Today',      hrs: '276', status: 'Awaiting review', avKind: 'purple'  },
];

const DEMO_PENDING = [
  { who: 'Karen K.', what: 'Week 7 logbook', when: 'today'  },
  { who: 'Brian O.', what: 'Week 7 logbook', when: 'today'  },
  { who: 'Aisha N.', what: 'Week 5 logbook', when: '3d ago' },
];

const DEMO_EVALS = [
  { name: 'Karen K.',  type: 'midterm', due: 'due in 5 days', warn: true  },
  { name: 'Joseph M.', type: 'midterm', due: 'due in 7 days', warn: false },
  { name: 'Aisha N.',  type: 'final',   due: '19 Aug',        warn: false },
];

const STATUS_KIND = {
  'Awaiting review': 'warn',
  'Up to date':      'ok',
  'Overdue':         'danger',
};

export default function WorkplaceSupervisorDashboardPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const isDemo    = DEMO_USERNAMES.includes(user?.username);

  const [interns,  setInterns]  = useState(isDemo ? DEMO_INTERNS  : []);
  const [pending,  setPending]  = useState(isDemo ? DEMO_PENDING  : []);
  const [evals,    setEvals]    = useState(isDemo ? DEMO_EVALS    : []);
  const [stats,    setStats]    = useState(
    isDemo
      ? { activeInterns: 4, awaitingReview: 3, approvedThisWeek: 6, avgScore: 4.2 }
      : null
  );

  useEffect(() => {
    if (isDemo) return;
    Promise.all([
      fetch('/api/supervisor/interns/', { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : []),
      fetch('/api/supervisor/pending/', { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : []),
      fetch('/api/supervisor/evaluations/', { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : []),
      fetch('/api/supervisor/stats/', { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : null),
    ])
      .then(([internData, pendingData, evalData, statsData]) => {
        setInterns(internData  || []);
        setPending(pendingData || []);
        setEvals(evalData      || []);
        setStats(statsData);
      })
      .catch(() => {});
  }, [isDemo]);

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : (user?.username || 'Supervisor');

  const org = user?.organization || 'Your Organisation';

  const awaitingCount = interns.filter(i => i.status === 'Awaiting review').length;

  return (
    <div className="page">
      <PageHead
        crumb="Workspace · My interns"
        title={`Welcome, ${displayName}`}
        sub={`You're supervising ${interns.length} intern${interns.length !== 1 ? 's' : ''} at ${org} this cohort.`}
        actions={<Btn sm kind="ghost">{org} ▾</Btn>}
      />

      <div className="grid grid--4">
        <Stat label="Active interns"      value={stats ? String(stats.activeInterns)    : '—'} />
        <Stat label="Awaiting review"     value={stats ? String(stats.awaitingReview)   : String(awaitingCount)} unit=" entries" delta={awaitingCount > 0 ? 'action needed' : undefined} deltaDown={awaitingCount > 0} />
        <Stat label="Approved this week"  value={stats ? String(stats.approvedThisWeek) : '—'} delta={stats ? '+2 vs last' : undefined} />
        <Stat label="Avg score given"     value={stats ? String(stats.avgScore)         : '—'} unit=" / 5" />
      </div>

      <div className="grid grid--main-narrow">
        <Card label="My interns" padless>
          {interns.length === 0 ? (
            <div className="empty-state">No interns assigned yet.</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Progress</th>
                  <th>Last entry</th>
                  <th>Hrs</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {interns.map(intern => (
                  <tr key={intern.id}>
                    <td>
                      <div className="row row--center" style={{ gap: 10 }}>
                        <Av name={intern.name} kind={intern.avKind} />
                        <b style={{ fontSize: 13 }}>{intern.name}</b>
                      </div>
                    </td>
                    <td>
                      <div style={{ width: 140 }}><Bar pct={intern.prog} /></div>
                      <span className="tiny" style={{ display: 'block', marginTop: 4 }}>{intern.prog}%</span>
                    </td>
                    <td className="muted">{intern.last}</td>
                    <td>{intern.hrs}</td>
                    <td>
                      <Chip kind={STATUS_KIND[intern.status] || ''} dot>
                        {intern.status}
                      </Chip>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Btn sm kind="ghost" onClick={() => navigate(`/supervisor/intern/${intern.id}`)}>
                        Open {I.arrow}
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <div className="col">

          <Card kind="warn" label="Pending approvals">
            {pending.length === 0 ? (
              <div className="empty-state">No pending approvals.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {pending.map((entry, i) => (
                  <div
                    key={i}
                    className="row row--between row--center"
                    style={{ padding: '10px 0', borderBottom: i < pending.length - 1 ? '1px solid rgba(192,86,33,0.2)' : 'none' }}
                  >
                    <div style={{ fontSize: 13 }}>
                      <b>{entry.who}</b> · <span className="muted">{entry.what}</span>
                      <div className="muted" style={{ fontSize: 11 }}>{entry.when}</div>
                    </div>
                    <div className="row" style={{ gap: 6 }}>
                      <Btn sm>Approve</Btn>
                      <Btn sm kind="ghost">Return</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card label="Upcoming evaluations">
            {evals.length === 0 ? (
              <div className="empty-state">No upcoming evaluations.</div>
            ) : (
              <ul className="timeline">
                {evals.map((ev, i) => (
                  <li key={i} className={ev.warn ? 'is-warn' : ''}>
                    <b>{ev.name} — {ev.type}</b>
                    <div className="meta">{ev.due}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

        </div>
      </div>    

      {pending.length > 0 && (
        <Card label={`Review · ${pending[0].who} · ${pending[0].what}`} style={{ marginTop: 20 }}>
          <div className="row row--between row--center">
            <div>
              <b style={{ fontSize: 14 }}>{pending[0].who} — {pending[0].what}</b>
              <div className="muted" style={{ fontSize: 12 }}>
                Submitted {pending[0].when} · awaiting your signature
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Btn sm kind="ghost">View entry</Btn>
              <Btn sm kind="ghost">Return with comment</Btn>
              <Btn sm kind="primary">{I.check} Approve & sign</Btn>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}



      