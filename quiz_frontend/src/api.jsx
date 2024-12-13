import axios from "axios";

const API_URL = "https://conceptile-quiz-app.onrender.com/api/";

export const startQuiz = async () => {
  try {
    const response = await axios.post(`${API_URL}start-quiz/`);
    return response;
  } catch (error) {
    console.error("Start Quiz error:", error);
    return (
      error.response || { message: "An error occurred while starting the quiz" }
    );
  }
};

export const getQuestion = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}get-question/${sessionId}/`);
    return response;
  } catch (error) {
    console.error("Get Question error:", error);
    return (
      error.response || {
        message: "An error occurred while fetching the question",
      }
    );
  }
};

export const submitAnswer = async (sessionId, questionId, selectedOption) => {
  try {
    const response = await axios.post(`${API_URL}submit-answer/${sessionId}/`, {
      question_id: questionId,
      selected_option: selectedOption,
    });
    return response;
  } catch (error) {
    console.error("Answer Question error:", error);
    return (
      error.response || {
        message: "An error occurred while submitting the answer",
      }
    );
  }
};

export const getResults = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}get-results/${sessionId}/`);
    return response;
  } catch (error) {
    console.error("Get Results error:", error);
    return (
      error.response || {
        message: "An error occurred while fetching the results",
      }
    );
  }
};

export const remainingQuestions = async (sessionId) => {
  try {
    const response = await axios.get(
      `${API_URL}get-remaining-questions/${sessionId}/`
    );
    return response;
  } catch (error) {
    console.error("Remaining Questions error:", error);
    return (
      error.response || {
        message: "An error occurred while fetching the remaining questions",
      }
    );
  }
};
