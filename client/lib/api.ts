import axios from 'axios';
import type { Pet, Record } from '../types/index.ts';

const api = axios.create({ baseURL: '/api' })

// Pets
export const getPets = (search?: string, type?: string) =>
  api.get('/pets', { params: { search, type } }).then(r => r.data)

export const getPet = (id: string) =>
  api.get(`/pets/${id}`).then(r => r.data)

export const createPet = (data: Pet) =>
  api.post('/pets', data).then(r => r.data)

export const updatePet = (id: string, data: Pet) =>
  api.put(`/pets/${id}`, data).then(r => r.data)

export const deletePet = (id: string) =>
  api.delete(`/pets/${id}`).then(r => r.data)

// Records
export const getRecords = (petId: string) =>
  api.get(`/pets/${petId}/records`).then(r => r.data)

export const createRecord = (petId: string, data: Record) =>
  api.post(`/pets/${petId}/records`, data).then(r => r.data)

export const updateRecord = (petId: string, recordId: string, data: { data: Record['data'] }) =>
  api.put(`/pets/${petId}/records/${recordId}`, data).then(r => r.data)

export const deleteRecord = (petId: string, recordId: string) =>
  api.delete(`/pets/${petId}/records/${recordId}`).then(r => r.data)

// Dashboard
export const getDashboardStats = () =>
  api.get('/dashboard/stats').then(r => r.data)