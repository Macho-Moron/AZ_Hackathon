import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, CircularProgress } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth0();
  useEffect(() => {
    const fetchCourses = async () => {
      if (isAuthenticated) { // <-- ONLY FETCH IF LOGGED IN
        try {
          // v-- ADD USER ID TO THE URL
          const response = await fetch(`http://localhost:5000/api/courses?userId=${user.sub}`);
          const data = await response.json();
          setCourses(data);
        } catch (error) {
          console.error('Failed to fetch courses:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // If not authenticated, stop loading
      }
    };

    fetchCourses();
  }, [isAuthenticated, user]); 

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Saved Courses
      </Typography>
      {courses.length === 0 ? (
        <Typography>You have not generated any courses yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {courses.map((course) => (
            <Card key={course._id} variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h2">{course.topic}</Typography>
                <Box component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {course.outline}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyCoursesPage;