import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8082/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const patientApi = {
    getAll: () => api.get('/patients'),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post('/patients', data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    delete: (id) => api.delete(`/patients/${id}`)
};

export const doctorApi = {
    getAll: () => api.get('/doctors'),
    getById: (id) => api.get(`/doctors/${id}`),
    create: (data) => api.post('/doctors', data),
    update: (id, data) => api.put(`/doctors/${id}`, data),
    delete: (id) => api.delete(`/doctors/${id}`)
};

export const appointmentApi = {
    getAll: () => api.get('/appointments'),
    getById: (id) => api.get(`/appointments/${id}`),
    create: (data) => api.post('/appointments', data),
    update: (id, data) => api.put(`/appointments/${id}`, data),
    delete: (id) => api.delete(`/appointments/${id}`)
};

export const medicineApi = {
    getAll: () => api.get('/medicines'),
    getById: (id) => api.get(`/medicines/${id}`),
    create: (data) => api.post('/medicines', data),
    update: (id, data) => api.put(`/medicines/${id}`, data),
    delete: (id) => api.delete(`/medicines/${id}`)
};

export const prescriptionApi = {
    getAll: () => api.get('/prescriptions'),
    create: (data) => api.post('/prescriptions', data),
    delete: (id) => api.delete(`/prescriptions/${id}`)
};

export const billApi = {
    getAll: () => api.get('/bills'),
    getById: (id) => api.get(`/bills/${id}`),
    create: (data) => api.post('/bills', data),
    update: (id, data) => api.put(`/bills/${id}`, data),
    delete: (id) => api.delete(`/bills/${id}`)
};

export default api;
