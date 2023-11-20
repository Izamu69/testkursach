import React, { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";
import MainLayout from "../components/layouts/MainLayout";
import CourseCards from "../components/sections/CourseCards";
import SearchBar from "../components/sections/SearchBar";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/sections/AuthContext';
import API_ENDPOINT from '../config';

export default function CategoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoggedIn } = useAuth();
  const { categoryId } = useParams();
  console.log('categoryId:', categoryId);
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`${API_ENDPOINT}/statistics/getStatistic/${userId}`)
      .then((response) => response.json())
      .then((data) => setUserStats(data.message))
      .catch((error) => console.error('Error fetching user statistics:', error));
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <MainLayout>
      <Text fontSize='2xl' as='b'>Browse all courses</Text>
      <SearchBar onSearch={handleSearch} />
      <CourseCards searchTerm={searchTerm} selectedCategoryId={categoryId} userStats={userStats} />
    </MainLayout>
  );
}
