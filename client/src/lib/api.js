import axios from './axios';

// Relationships API
export const relationshipsApi = {
  generateInvite: async (firstMeetingDate) => {
    const res = await axios.post('/relationships/invite', { firstMeetingDate });
    return res.data; // { inviteCode, expiresAt }
  },
  joinWithCode: async (code) => {
    const res = await axios.post('/relationships/join', { code });
    return res.data; // RelationshipResponse
  },
  getCurrent: async () => {
    const res = await axios.get('/relationships/current');
    return res.data; // RelationshipResponse
  },
  disconnect: async () => {
    const res = await axios.delete('/relationships/disconnect');
    return res.data;
  },
};

// Events API
export const eventsApi = {
  create: async ({ title, description, date, type, image }) => {
    const payload = { title, description, date, type };
    if (image) payload.image = image;
    const res = await axios.post('/events', payload);
    return res.data; // EventResponse
  },
  getById: async (id) => {
    const res = await axios.get(`/events/${id}`);
    return res.data;
  },
  updateById: async (id, payload) => {
    const res = await axios.put(`/events/${id}`, payload);
    return res.data;
  },
  delete: async (id) => {
    const res = await axios.delete(`/events/${id}`);
    return res.data;
  },
  listMine: async ({ limit = 50, offset = 0 } = {}) => {
    const res = await axios.get(`/events`);
    return res.data;
  },
};

// Whispers API
export const whispersApi = {
  listMine: async ({ limit = 100, offset = 0 } = {}) => {
    const res = await axios.get(`/whispers`);
    return res.data;
  },
  create: async ({ type, text, recurrence, date }) => {
    const res = await axios.post(`/whispers`, { type, text, recurrence, date });
    return res.data;
  },
  update: async (id, payload) => {
    const res = await axios.put(`/whispers/${id}`, payload);
    return res.data;
  },
  delete: async (id) => {
    const res = await axios.delete(`/whispers/${id}`);
    return res.data;
  },
  convertToEvent: async (id, payload) => {
    // payload can be undefined or { image: { type, data, filename } }
    const res = await axios.post(`/whispers/${id}/convert`, payload || {});
    return res.data;
  }
};

// Users API
export const usersApi = {
  getProfile: async () => {
    const res = await axios.get('/users/profile');
    return res.data; // UserProfileResponse
  },
  updateProfile: async (payload) => {
    const res = await axios.put('/users/profile', payload);
    return res.data; // UserProfileResponse
  },
};