import React, { useEffect } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { Text } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/AuthContext';
import NewCourses from "../components/sections/NewCourses";
import CategoryCards from "../components/sections/CategoryCards";
import FailedCourses from "../components/sections/FailedCourses";

export default function MainPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <MainLayout>
            <Text fontSize='2xl' as='b'>Pick one of the newest courses</Text>
            <NewCourses />
            <Text fontSize='2xl' as='b'>Continue where you left off</Text>
            <FailedCourses />
            <Text fontSize='2xl' as='b'>Or choose anything else</Text>
            <CategoryCards />
        </MainLayout>
    );
}
