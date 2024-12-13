import React, { useState, useEffect } from "react";
import {
  startQuiz,
  getQuestion,
  submitAnswer,
  getResults,
  remainingQuestions,
} from "../api";
import {
  Button,
  Typography,
  Card,
  Grid,
  Paper,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { blue, red, green, grey } from "@mui/material/colors";

const Quiz = () => {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizOver, setQuizOver] = useState(false);
  const [results, setResults] = useState(null);
  const [totalAnswerableQuestions, setTotalAnswerableQuestions] = useState(0);
  const [showRetry, setShowRetry] = useState(false);

  const handleStartQuiz = async () => {
    try {
      const response = await startQuiz();
      setSessionId(response.data.session_id);
      setQuizOver(false);
      fetchNextQuestion(response.data.session_id);
      fetchTotalAnswerableQuestions(response.data.session_id);
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  const fetchNextQuestion = async (sessionId) => {
    try {
      const response = await getQuestion(sessionId);
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption !== null) {
      await submitAnswer(sessionId, question.id, selectedOption);
      fetchNextQuestion(sessionId);
      fetchTotalAnswerableQuestions(sessionId);
      setSelectedOption(null);

      if (totalAnswerableQuestions <= 1) {
        setQuizOver(true);
      }
    }
  };

  const fetchResults = async () => {
    try {
      const response = await getResults(sessionId);
      setResults(response.data);
      setQuizOver(true);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const fetchTotalAnswerableQuestions = async (sessionId) => {
    try {
      const response = await remainingQuestions(sessionId);
      setTotalAnswerableQuestions(response.data.total_answerable_questions);
    } catch (error) {
      console.error("Error fetching total answerable questions:", error);
    }
  };

  useEffect(() => {
    if (quizOver) {
      fetchResults();
    }
  }, [quizOver]);

  useEffect(() => {
    if (quizOver) {
      fetchResults();
      setTimeout(() => {
        setShowRetry(true);
      }, 3000); // Show retry button after 3 seconds
    }
  }, [quizOver]);

  const handleRetry = () => {
    setShowRetry(false);
    handleStartQuiz(); // Start a new quiz
  };

  return (
    <div
      style={{
        backgroundColor: grey[100],
        minHeight: "100vh",
        padding: 20,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Typography
        variant="h3"
        color={blue[700]}
        align="center"
        gutterBottom
        style={{ fontWeight: "bold", letterSpacing: "1px" }}
      >
        Quiz App
      </Typography>

      {!sessionId ? (
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartQuiz}
              size="large"
              sx={{
                padding: "10px 30px",
                fontSize: "1.2rem",
                backgroundColor: blue[600],
                "&:hover": {
                  backgroundColor: blue[800],
                },
              }}
            >
              Start Quiz
            </Button>
          </Grid>
        </Grid>
      ) : quizOver ? (
        <Card
          sx={{
            padding: 3,
            textAlign: "center",
            backgroundColor: blue[50],
            borderRadius: 5,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" color={blue[700]} gutterBottom>
            🎉 Quiz Completed! 🎉
          </Typography>
          <Typography variant="h6" color={blue[500]} gutterBottom>
            Your Results:
          </Typography>
          <Grid container direction="column" spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="body1" color="textSecondary">
                Total Questions: {results?.total_questions}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                color={results?.correct_answers > 0 ? green[600] : red[700]}
              >
                Correct Answers: {results?.correct_answers}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" color={red[700]}>
                Incorrect Answers: {results?.incorrect_answers}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" color="primary">
                Your Score: {results?.correct_answers} /{" "}
                {results?.total_questions}
              </Typography>
            </Grid>
          </Grid>
          {showRetry && (
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRetry}
                  sx={{
                    padding: "10px 30px",
                    fontSize: "1rem",
                    backgroundColor: red[600],
                    "&:hover": {
                      backgroundColor: red[800],
                    },
                  }}
                >
                  Retry Quiz
                </Button>
              </Grid>
            </Grid>
          )}
        </Card>
      ) : question ? (
        <Card
          sx={{
            padding: 3,
            backgroundColor: blue[50],
            borderRadius: 5,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" color={blue[700]} gutterBottom>
            {question.text}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Remaining Questions: {totalAnswerableQuestions}
          </Typography>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(Number(e.target.value))}
          >
            {[1, 2, 3, 4].map((optionNumber) => (
              <FormControlLabel
                key={optionNumber}
                control={<Radio />}
                label={question[`option${optionNumber}`]}
                value={optionNumber}
                sx={{
                  marginBottom: "15px",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "1rem",
                    fontWeight: "normal",
                  },
                }}
              />
            ))}
          </RadioGroup>
          {selectedOption !== null && (
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitAnswer}
                  sx={{
                    padding: "10px 30px",
                    fontSize: "1.1rem",
                    backgroundColor: blue[600],
                    "&:hover": {
                      backgroundColor: blue[800],
                    },
                  }}
                >
                  Submit Answer
                </Button>
              </Grid>
            </Grid>
          )}
        </Card>
      ) : (
        <Typography variant="h6" align="center" color={blue[500]}>
          Loading...
        </Typography>
      )}
    </div>
  );
};

export default Quiz;
