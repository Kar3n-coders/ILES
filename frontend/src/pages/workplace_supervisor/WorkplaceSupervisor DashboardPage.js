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