import React, { useEffect } from "react";
import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";
import { Stack, Text } from "@chakra-ui/react";
import NewCourses from "../components/sections/NewCourses";
import CategoryCards from "../components/sections/CategoryCards";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);
  return (
    <LandingLayout>
      <Stack spacing='5'>
        <Hero
          title="Learn anything, anytime, anywhere"
          subtitle="This is the perfect place to learn about something useful"
          image="/landingpicture.jpg"
          ctaText="Get Started!"
          ctaLink="/signup"
        />
        <Text fontSize='2xl' as='b'>Explore our newest additions</Text>
        <NewCourses />
        <Text fontSize='2xl' as='b'>Or choose something else that suits your taste</Text>
        <CategoryCards />
      </Stack>
    </LandingLayout>
  );
}
