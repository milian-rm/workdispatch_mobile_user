import { axiosUser } from './api';

export const getOpenServiceRequests = async (categoryId?: string) => {
  const params = categoryId ? { categoryId } : undefined;
  return axiosUser.get('/serviceRequest/open', { params });
};

export const getCategories = async () => {
  return axiosUser.get('/categories');
};

export const getWorkerSkills = async (workerId: string) => {
  return axiosUser.get(`/userSkill/worker/${workerId}`);
};

export const getWorkerProposals = async (workerId: string) => {
  return axiosUser.get(`/Proposal/worker/${workerId}`);
};

export const createProposal = async (payload: {
  serviceRequestId: string;
  workerId: string;
  price: number;
  message: string;
}) => {
  return axiosUser.post('/Proposal', payload);
};

export const getWorkerServices = async (workerId: string) => {
  return axiosUser.get(`/Service/worker/${workerId}`);
};
