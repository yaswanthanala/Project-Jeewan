/**
 * JEEWAN API Client — connects to backend microservices
 * All calls go through either direct ports (dev) or Nginx gateway (prod)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

// Direct service URLs for development
const SERVICE_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001',
  sos: process.env.NEXT_PUBLIC_SOS_URL || 'http://localhost:8002',
  chat: process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:8003',
  game: process.env.NEXT_PUBLIC_GAME_URL || 'http://localhost:8004',
  maps: process.env.NEXT_PUBLIC_MAPS_URL || 'http://localhost:8005',
  risk: process.env.NEXT_PUBLIC_RISK_URL || 'http://localhost:8006',
  admin: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:8007',
};

type ServiceName = keyof typeof SERVICE_URLS;

/** Get auth token from localStorage */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jeewan_token');
}

/** Save auth token + user data */
export function saveAuth(token: string, user: any) {
  localStorage.setItem('jeewan_token', token);
  localStorage.setItem('jeewan_user', JSON.stringify(user));
}

/** Get current user from localStorage */
export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('jeewan_user');
  return data ? JSON.parse(data) : null;
}

/** Clear auth data */
export function logout() {
  localStorage.removeItem('jeewan_token');
  localStorage.removeItem('jeewan_user');
}

/** Check if user is authenticated */
export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request(service: ServiceName, path: string, options: RequestInit = {}) {
  const url = `${SERVICE_URLS[service]}${path}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || data.error || `API error ${res.status}`);
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.warn(`[JEEWAN] Service ${service} unreachable, using fallback`);
      return null;
    }
    throw err;
  }
}

// ─── Auth MS (:8001) ───
export const authAPI = {
  login: (email: string, password: string) =>
    request('auth', '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { email: string; phone?: string; name: string; password: string; role?: string; institution?: string }) =>
    request('auth', '/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  guestToken: () =>
    request('auth', '/auth/guest-token', { method: 'POST' }),

  me: () =>
    request('auth', '/auth/me'),

  sendOTP: (identifier: string) =>
    request('auth', '/auth/otp/send', { method: 'POST', body: JSON.stringify({ identifier }) }),

  verifyOTP: (identifier: string, otp: string) =>
    request('auth', '/auth/otp/verify', { method: 'POST', body: JSON.stringify({ identifier, otp }) }),

  demoAccounts: () =>
    request('auth', '/auth/demo-accounts'),
};

// ─── SOS MS (:8002) ───
export const sosAPI = {
  trigger: (lat: number, lng: number, contacts: string[] = []) =>
    request('sos', '/sos/trigger', { method: 'POST', body: JSON.stringify({ lat, lng, emergency_contacts: contacts }) }),

  getContacts: (userId: string = 'demo-user') =>
    request('sos', `/sos/contacts?user_id=${userId}`),

  saveContacts: (userId: string, contacts: any[]) =>
    request('sos', `/sos/contacts?user_id=${userId}`, { method: 'POST', body: JSON.stringify(contacts) }),
};

// ─── Risk MS (:8006) ───
export const riskAPI = {
  getQuestions: () =>
    request('risk', '/risk/questions'),

  assess: (answers: number[], userId: string = 'anonymous', institution: string = '') =>
    request('risk', '/risk/assess', { method: 'POST', body: JSON.stringify({ answers, user_id: userId, institution }) }),

  getFlaggedCases: () =>
    request('risk', '/risk/flagged'),

  bookSession: (data: any) =>
    request('risk', '/risk/book-session', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Gamification MS (:8004) ───
export const gameAPI = {
  dailyPledge: (userId: string = 'demo-user', institution: string = 'NIT AP') =>
    request('game', `/game/pledge/daily?user_id=${userId}&institution=${institution}`, { method: 'POST' }),

  getStreak: (userId: string = 'demo-user') =>
    request('game', `/game/streak?user_id=${userId}`),

  getBadges: (userId: string = 'demo-user') =>
    request('game', `/game/badges?user_id=${userId}`),

  getLeaderboard: () =>
    request('game', '/game/leaderboard/institutions'),

  quizComplete: (userId: string, score: number, perfect: boolean, institution: string) =>
    request('game', `/game/quiz/complete?user_id=${userId}&score=${score}&perfect=${perfect}&institution=${institution}`, { method: 'POST' }),
};

// ─── Maps MS (:8005) ───
export const mapsAPI = {
  nearby: (lat: number, lng: number, radius: number = 50000, type: string = 'all') =>
    request('maps', `/maps/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`),

  geocode: (lat: number, lng: number) =>
    request('maps', `/maps/geocode?lat=${lat}&lng=${lng}`),
};

// ─── Chatbot MS (:8003) ───
export const chatAPI = {
  send: (text: string, sessionId: string = 'anonymous') =>
    request('chat', '/chat/send', { method: 'POST', body: JSON.stringify({ text, session_id: sessionId }) }),

  getHistory: (sessionId: string = 'anonymous') =>
    request('chat', `/chat/history?session_id=${sessionId}`),
};

// ─── Admin MS (:8007) ───
export const adminAPI = {
  getCases: (status?: string) =>
    request('admin', `/admin/cases${status ? `?status=${status}` : ''}`),

  assignCase: (caseId: number, counsellorId: number) =>
    request('admin', `/admin/cases/${caseId}/assign?counsellor_id=${counsellorId}`, { method: 'POST' }),

  resolveCase: (caseId: number) =>
    request('admin', `/admin/cases/${caseId}/resolve`, { method: 'POST' }),

  getStats: () =>
    request('admin', '/admin/stats'),

  getCounsellors: () =>
    request('admin', '/admin/counsellors'),

  getNMBA: () =>
    request('admin', '/admin/nmba'),

  getTipoffs: () =>
    request('admin', '/admin/tipoffs'),
};
