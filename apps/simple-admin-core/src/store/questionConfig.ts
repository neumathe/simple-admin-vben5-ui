import { defineStore } from 'pinia';

interface QuestionConfig {
  showAnswer: boolean;
  showAnalysis: boolean;
  showComment: boolean;
  showNote: boolean;
  fontSize: number;
}

export const useQuestionConfig = defineStore('question-config', {
  state: (): QuestionConfig => ({
    showAnswer: false,
    showAnalysis: false,
    showComment: true,
    showNote: true,
    fontSize: 6,
  }),
  getters: {},
  actions: {},
  persist: true,
});
