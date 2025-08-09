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
  create: async ({ title, description, date, type }) => {
    const res = await axios.post('/events', { title, description, date, type });
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
  listMine: async ({ limit = 50, offset = 0 } = {}) => {
    const res = await axios.get(`/events`);
    return res.data;
  },
};
