import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHead, Card, Stat, Btn, Chip, Bar, Av } from '../components/common/Primitives';
import { I } from '../components/common/Icons';
import '../components/common/Primitives.css';

const DEMO_USERNAMES = ['maria.reyes', 'john.doe', 'dr.santos', 'prof.torres', 'admin'];

const DEMO_STUDENTS = [
  { id: 1, name: 'Karen Kawooya',   org: 'Acme Telecoms', prog: 58, last: 'today',      flag: null,           flagKind: null     },
  { id: 2, name: 'Joseph Mukasa',   org: 'MTN Uganda',    prog: 75, last: 'yesterday',  flag: null,           flagKind: null     },
  { id: 3, name: 'Aisha Nansubuga', org: 'Stanbic Bank',  prog: 42, last: '3 days ago', flag: 'At risk',      flagKind: 'warn'   },
  { id: 4, name: 'Brian Otim',      org: 'Acme Telecoms', prog: 66, last: 'today',      flag: null,           flagKind: null     },
  { id: 5, name: 'Diana Akello',    org: 'NSSF',          prog: 30, last: '5 days ago', flag: 'At risk',      flagKind: 'warn'   },
  { id: 6, name: 'Eric Walusimbi',  org: '—',             prog:  0, last: '—',          flag: 'No placement', flagKind: 'danger' },
];

const DEMO_TODOS = [
  'Approve 2 placement submissions',
  'Grade 7 midterm reports',
  'Conduct 4 workplace visits',
  'Review 3 returned logbook entries',
];

const DEMO_VISITS = [
  { name: 'Karen K.',  org: 'Acme Telecoms', time: 'Tue · 2pm',  warn: true  },
  { name: 'Joseph M.', org: 'MTN Uganda',    time: 'Wed · 11am', warn: false },
  { name: 'Aisha N.',  org: 'Stanbic Bank',  time: 'Fri · 3pm',  warn: false },
];

export default function AcademicDashboardPage() {
  const { user } = useAuth();
  const isDemo   = DEMO_USERNAMES.includes(user?.username);

  const [students,     setStudents]     = useState(isDemo ? DEMO_STUDENTS : []);
  const [todos,        setTodos]        = useState(isDemo ? DEMO_TODOS    : []);
  const [visits,       setVisits]       = useState(isDemo ? DEMO_VISITS   : []);
  const [stats,        setStats]        = useState(
    isDemo ? { assigned: 18, placements: 16, visits: 5, visitsTotal: 9, grading: 7 } : null
  );
  const [filter,       setFilter]       = useState('All');
  const [checkedTodos, setCheckedTodos] = useState({});

  useEffect(() => {
    if (isDemo) return;
    Promise.all([
      fetch('/api/academic/students/', { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : []),
      fetch('/api/academic/todos/',    { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : []),
      fetch('/api/academic/visits/',   { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : []),
      fetch('/api/academic/stats/',    { headers: { Authorization: `Bearer ${localStorage.getItem('iles_auth_token')}` } }).then(r => r.ok ? r.json() : null),
    ])
      .then(([studentData, todoData, visitData, statsData]) => {
        setStudents(studentData || []);
        setTodos(Array.isArray(todoData) ? todoData.map(t => t.text || t) : []);
        setVisits(visitData    || []);
        setStats(statsData);
      })
      .catch(() => {});
  }, [isDemo]);

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : (user?.username || 'Supervisor');

  const cohortLabel = user?.cohort || 'Cohort 2026-S2';

  const atRiskCount      = students.filter(s => s.flagKind === 'warn').length;
  const noPlacementCount = students.filter(s => s.flagKind === 'danger').length;

  const filteredStudents = students.filter(s => {
    if (filter === 'All')          return true;
    if (filter === 'On track')     return !s.flag;
    if (filter === 'At risk')      return s.flagKind === 'warn';
    if (filter === 'No placement') return s.flagKind === 'danger';
    return true;
  });
