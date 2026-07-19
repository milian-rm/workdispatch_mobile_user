export { axiosAuth, axiosUser } from './api';
export { forgotPassword, login, register, resendVerification, resetPassword, verifyEmail } from './auth';

// ===== USERS / WORKERS =====
export const getWorkers = () => import('./api').then(m => m.axiosUser.get('/users'));
export const getWorkerById = (id: string) => import('./api').then(m => m.axiosUser.get(`/users/${id}`));
export const updateProfile = (id: string, formData: FormData) =>
  import('./api').then(m => m.axiosUser.put(`/users/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));

// ===== CATEGORIES =====
export const getCategories = () => import('./api').then(m => m.axiosUser.get('/categories'));

// ===== VERIFICATIONS =====
export const createVerification = (formData: FormData) =>
  import('./api').then(m => m.axiosUser.post('/verifications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
export const getVerificationStatus = (id: string) =>
  import('./api').then(m => m.axiosUser.get(`/verifications/${id}`));

// ===== PORTFOLIO =====
export const getMyPortfolio = (workerId: string) =>
  import('./api').then(m => m.axiosUser.get(`/PortFolio/my/${workerId}`));
export const getPortfolioByWorker = (id: string) =>
  import('./api').then(m => m.axiosUser.get(`/PortFolio/${id}`));
export const addPortfolioRecord = (formData: FormData) =>
  import('./api').then(m => m.axiosUser.post('/PortFolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
export const updatePortfolioRecord = (id: string, data: any) =>
  import('./api').then(m => m.axiosUser.put(`/PortFolio/${id}`, data));
export const changePortfolioStatus = (id: string) =>
  import('./api').then(m => m.axiosUser.patch(`/PortFolio/status/${id}`));

// ===== REVIEWS =====
export const getWorkerReviews = (workerId: string) =>
  import('./api').then(m => m.axiosUser.get(`/reviews/worker/${workerId}`));

// ===== SKILLS =====
export const getWorkerSkills = (userId: string) =>
  import('./api').then(m => m.axiosUser.get(`/userSkill/worker/${userId}`));