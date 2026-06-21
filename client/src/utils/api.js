export const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const GOOGLE_AUTH_URL = `${BASE}/api/auth/google`;

export async function registerUser(data) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function verifyEmail(data) {
  const res = await fetch(`${BASE}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function resendOtp(email) {
  const res = await fetch(`${BASE}/api/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function forgotPassword(email) {
  const res = await fetch(`${BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function resetPassword(data) {
  const res = await fetch(`${BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function logoutUser() {
  await fetch(`${BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getMe() {
  const res = await fetch(`${BASE}/api/auth/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function saveResume(resumeData, atsScore) {
  const res = await fetch(`${BASE}/api/resume/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ resumeData, atsScore }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function loadResume() {
  const res = await fetch(`${BASE}/api/resume/load`, {
    credentials: 'include',
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function trackDownload() {
  const res = await fetch(`${BASE}/api/resume/download`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Unified AI calling function — calls /api/ai (Groq-first, Gemini fallback)
export async function callAI(prompt, sys) {
  const res = await fetch(`${BASE}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ prompt, sys }),
  });
  
  if (res.status === 429) throw new Error('AI service is temporarily busy. Please wait a moment.');
  if (!res.ok) throw new Error('AI request failed. Please try again.');
  
  const d = await res.json();
  return d.text || '';
}

// Keeping old names for backward compatibility (they all use the same unified AI path now)
export const callGemini = callAI;
export const callGroq = callAI;
export const callGeminiWithRetry = callAI;



export async function createOrder(type) {
  const res = await fetch(`${BASE}/api/payment/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ type }),
  });
  if (!res.ok) throw await res.json();
  return res.json(); 
}

export async function verifyPayment(payload) {
  const res = await fetch(`${BASE}/api/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return res.json(); 
}

export async function fetchAdminUsers(pass) {
  const res = await fetch(`${BASE}/api/admin/users`, {
    headers: { "x-admin-pass": pass },
    credentials: 'include',
  });
  if (res.status === 401) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchAdminRevenue(pass) {
  const res = await fetch(`${BASE}/api/admin/revenue`, {
    headers: { "x-admin-pass": pass },
    credentials: 'include',
  });
  if (res.status === 401) throw new Error("Unauthorized");
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(`${BASE}/api/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
