import { defineStore } from 'pinia';

interface QuestionConfig {
  showAnswer: boolean;
  showAnalysis: boolean;
  fontSize: number;
}

export const useQuestionConfig = defineStore('question-config', {
  state: (): QuestionConfig => ({
    showAnswer: false,
    showAnalysis: false,
    fontSize: 6,
  }),
  getters: {},
  actions: {},
  persist: true,
});
