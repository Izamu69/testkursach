import React, { useState, useEffect } from "react";
import {
    Box,
    Heading,
    Radio,
    RadioGroup,
    Button,
    VStack,
    Text,
} from "@chakra-ui/react";
import MainLayout from "../components/layouts/MainLayout";
import { useParams } from 'react-router-dom';
import API_ENDPOINT from '../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/AuthContext';

const Quiz = () => {
    const { id } = useParams();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showScore, setShowScore] = useState(false);
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}/tests/testById/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                setQuestions(data.message.content.questions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [id]);

    useEffect(() => {
        const updateStatistics = async () => {
            const userId = localStorage.getItem('userId');
            try {
                const response = await fetch(`${API_ENDPOINT}/statistics/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: userId,
                        cid: id,
                        result: percentage,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update statistics: ${response.status}`);
                }

                const data = await response.json();
                console.log("Statistics updated successfully:", data);
            } catch (error) {
                console.error("Error updating statistics:", error);
            }
        };

        if (showScore) {
            updateStatistics();
        }
    }, [score, showScore, id, percentage]);

    const handleAnswerSelection = (questionIndex, selectedAnswer) => {
        const updatedAnswers = [...answers];
        updatedAnswers[questionIndex] = selectedAnswer;
        setAnswers(updatedAnswers);
    };

    const handleNextQuestion = async () => {
        const currentTest = questions[currentQuestion];

        setScore((prevScore) => prevScore + (answers[currentQuestion] === currentTest?.answer ? 1 : 0));
        console.log(score);

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowScore(true);

            const totalQuestions = questions.length;
            const correctAnswers = score;
            const calc = (correctAnswers / totalQuestions) * 100
            setPercentage(calc);
            console.log("total questions:", totalQuestions);
            console.log("correct answers:", correctAnswers);
            console.log("Quiz Percentage:", calc);
        }
    };

    return (
        <MainLayout>
            <VStack spacing={4} align="center">
                {questions.length === 0 ? (
                    <Text>Loading...</Text>
                ) : showScore ? (
                    <Box>
                        <Heading>Quiz Complete!</Heading>
                        <Text>Your Score: {score}</Text>
                        {percentage >= 50 ? (
                            <Text>Congratulations! You passed!</Text>
                        ) : (
                            <Text>Sorry, you didn't pass. Better luck next time!</Text>
                        )}
                    </Box>
                ) : (
                    <Box>
                        <Heading>{currentQuestion + 1}. {questions[currentQuestion]?.question}</Heading>
                        <RadioGroup onChange={(value) => handleAnswerSelection(currentQuestion, value)}>
                            <VStack align="start" spacing={2}>
                                {questions[currentQuestion]?.choices.map((option, index) => (
                                    <Radio key={index} value={option}>
                                        {option}
                                    </Radio>
                                ))}
                            </VStack>
                        </RadioGroup>
                        <Button onClick={handleNextQuestion} mt={4}>
                            Next Question
                        </Button>
                    </Box>
                )}
            </VStack>
        </MainLayout>
    );
};

export default Quiz;
