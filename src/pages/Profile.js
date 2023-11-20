import React, { useEffect } from "react";
import MainLayout from "../components/layouts/MainLayout";
import Stats from "../components/sections/Stats";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/AuthContext';

export default function Profile() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <MainLayout>
            <Stats />
        </MainLayout>
    );
}
