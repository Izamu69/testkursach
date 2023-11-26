import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Stack,
    Text,
    VStack,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    Link
} from '@chakra-ui/react';
import ImageDisplay from '../components/sections/ImageDisplay';
import MainLayout from '../components/layouts/MainLayout';
import { useParams } from 'react-router-dom';
import API_ENDPOINT from '../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/sections/AuthContext';

export default function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isQuizEmpty, setIsQuizEmpty] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        fetch(`${API_ENDPOINT}/courses/get/${id}`)
            .then((res) => res.json())
            .then((res) => {
                setCourse(res.message);
                console.log(res);
            });
    }, [id]);

    useEffect(() => {
        const checkQuizEmpty = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}/tests/isEmpty/${id}`);
                const data = await response.json();
                setIsQuizEmpty(data && data.isEmpty);
                console.log(data && data.isEmpty);
            } catch (error) {
                console.error('Error checking quiz emptiness:', error);
            }
        };

        if (course && course.id) {
            checkQuizEmpty();
        }
    }, [id, course]);

    useEffect(() => {
        const checkStats = async () => {
            try {
                console.log("Course ID:", id);
                const userId = localStorage.getItem('userId');
                const response = await fetch(`${API_ENDPOINT}/statistics/getStatistic/${userId}`);
                const data = await response.json();

                console.log("User Stats:", data.message);

                // Find the stat with the same course ID (using cid)
                const matchingStat = data.message.find((stat) => stat.cid == id); // Use '==' for loose comparison

                console.log("Matching Stat:", matchingStat);

                if (matchingStat) {
                    // Check if createdAt and updatedAt are different
                    if (matchingStat.createdAt !== matchingStat.updatedAt) {
                        setIsButtonDisabled(true);
                    }
                }
            } catch (error) {
                console.error('Error checking user stats:', error);
            }
        };

        if (id) {
            checkStats();
        }
    }, [id]);


    const renderVideos = (videos) => {
        return (
            <>
                {videos.map((video, videoIndex) => (
                    <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%' }}>
                        <iframe
                            key={videoIndex}
                            style={{ position: 'absolute', width: '100%', height: '100%' }}
                            src={video}
                            allowFullScreen
                        ></iframe>
                    </div>
                ))}
            </>
        );
    };

    const renderImages = (images) => {
        return (
            <div>
                {images.map((imageId, imageIndex) => (
                    <ImageDisplay key={imageIndex} imageId={imageId} />
                ))}
            </div>
        );
    };
    return (
        <MainLayout>
            {!course ? (
                'Loading...'
            ) : (
                <Container maxW={'7xl'} centerContent>
                    <SimpleGrid
                        columns={{ base: 1, lg: 1 }}
                        spacing={{ base: 8, md: 10 }}
                        py={{ base: 18, md: 24 }}>
                        {course.content ? (
                            <Stack spacing={{ base: 6, md: 10 }}>
                                <Box as={'header'}>
                                    <Heading
                                        lineHeight={1.1}
                                        fontWeight={600}
                                        fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                                        {course.title}
                                    </Heading>

                                    <Text
                                        fontWeight={300}
                                        fontSize={'2xl'}>
                                        {course.content.description}
                                    </Text>
                                </Box>
                                {course.content.sections ? (
                                    course.content.sections.map((section) => (
                                        <Stack
                                            spacing={{ base: 4, sm: 6 }}
                                            direction={'column'}
                                            divider={
                                                <StackDivider />
                                            }>
                                            <VStack spacing={{ base: 4, sm: 6 }}>
                                                <Text
                                                    fontSize={'2xl'}
                                                    fontWeight={'300'}>
                                                    {section.title}
                                                </Text>
                                                <Text fontSize={'lg'}>
                                                    {section.content}
                                                </Text>
                                                {section.videos && renderVideos(section.videos)}
                                                {section.images && renderImages(section.images)}
                                            </VStack>
                                        </Stack>
                                    ))
                                ) : (
                                    <p>No sections available for this course.</p>
                                )}
                                {!isQuizEmpty && (
                                    <Link href={`/quiz/${course.id}`}>
                                        <Button
                                            isDisabled={isButtonDisabled}
                                            rounded={'none'}
                                            w={'full'}
                                            mt={8}
                                            size={'lg'}
                                            py={'7'}
                                            textTransform={'uppercase'}
                                            _hover={{
                                                transform: 'translateY(2px)',
                                                boxShadow: 'lg',
                                            }}
                                            colorScheme='green'
                                        >
                                            {isButtonDisabled ? 'You can\'t retake this test anymore' : 'Complete test'}
                                        </Button>
                                    </Link>
                                )}
                            </Stack>
                        ) : (
                            <p>No content available for this course.</p>
                        )}
                    </SimpleGrid>
                </Container>
            )}
        </MainLayout>
    )
}