import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(error);
});

export const askQuestion = async (request: { question: string, config: { method: string, generative_model: string } }) => {
  try {
    console.log(request);
    const resQuestion = await api.post('/questions/', { question : request.question});
    const resAnswer = await api.post(`/questions/${resQuestion.data.id}/create_answer/`, request.config);
    return {
      questionId: resQuestion.data.id,
      answer: resAnswer.data
    }
  } catch (error) {
    throw error;
  }
};

export const redoAnswer = async (request: { questionId: number | null, config: { method: string, generative_model: string } }) => {
  try {
    const response = await api.post(`/questions/${request.questionId}/create_answer/`, request.config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitEvaluation = async (request: { answerId: number, evaluation: { like: boolean | null, comment: string, evaluation_author: string } }) => {
  try {
    const response = await api.post(`/answers/${request.answerId}/evaluate/`, request.evaluation);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuestionHistory = async () => {
  try {
    const response = await api.get('/questions/');
    return response.data;
  } catch (error) {
    throw error;
  }
};