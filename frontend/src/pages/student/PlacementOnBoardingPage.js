import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead, Card, Btn, Field } from '../../components/common/Primitives';
import { I } from '../../components/common/Icons';
import { createPlacement } from '../../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ company_name: "", supervisor_name: "", supervisor_email: "", start_date: "", end_date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));