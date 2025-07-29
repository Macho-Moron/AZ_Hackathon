import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSnackbar } from 'notistack';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  CircularProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DeleteIcon from '@mui/icons-material/Delete';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const { user, isAuthenticated } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchCourses = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/courses?userId=${user.sub}`);
          const data = await response.json();
          setCourses(data);
        } catch (error) {
          enqueueSnackbar('Failed to fetch courses.', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [isAuthenticated, user, enqueueSnackbar]);

  // --- THIS FUNCTION WAS MISSING ---
  const handleGenerateDetails = async (courseId) => {
    setDetailLoading(courseId);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/generate-details`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to generate details.');
      const updatedCourse = await response.json();
      setCourses(currentCourses =>
        currentCourses.map(c => (c._id === courseId ? updatedCourse : c))
      );
      enqueueSnackbar('Detailed content generated!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setDetailLoading(null);
    }
  };

  // --- THIS FUNCTION WAS MISSING ---
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course permanently?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete the course.');
      setCourses(currentCourses => currentCourses.filter(c => c._id !== courseId));
      enqueueSnackbar('Course deleted successfully.', { variant: 'info' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleAnswerChange = (event, courseId, moduleIndex, mcqIndex) => {
    const answerId = `${courseId}-${moduleIndex}-${mcqIndex}`;
    setUserAnswers({
      ...userAnswers,
      [answerId]: event.target.value,
    });
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
                <Typography variant="h5" component="h2" gutterBottom>{course.topic}</Typography>
                
                {course.modules && course.modules.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {course.modules.map((module, moduleIndex) => (
                      <Accordion key={moduleIndex} TransitionProps={{ unmountOnExit: true }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography fontWeight="medium">{module.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography paragraph>{module.explanation}</Typography>
                          <Typography variant="subtitle1" gutterBottom>YouTube Suggestions:</Typography>
                          <List dense>
                            {module.youtubeSuggestions.map((yt, i) => (
                              <ListItem key={i}>
                                <ListItemIcon><YouTubeIcon /></ListItemIcon>
                                {/* --- THIS IS THE CORRECTED LINK --- */}
                                <MuiLink 
                                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(yt)}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {yt}
                                </MuiLink>
                              </ListItem>
                            ))}
                          </List>                          
                          <Typography variant="subtitle1" gutterBottom>Quiz:</Typography>
                          {module.mcqs.map((mcq, mcqIndex) => {
                            const answerId = `${course._id}-${moduleIndex}-${mcqIndex}`;
                            const selectedAnswer = userAnswers[answerId];
                            return (
                              <FormControl key={mcqIndex} component="fieldset" sx={{ mt: 2, width: '100%' }}>
                                <Typography fontWeight="medium">{mcqIndex + 1}. {mcq.question}</Typography>
                                <RadioGroup
                                  value={selectedAnswer || null}
                                  onChange={(e) => handleAnswerChange(e, course._id, moduleIndex, mcqIndex)}
                                >
                                  {mcq.options.map((option, optionIndex) => {
                                    let borderColor = 'transparent';
                                    if (selectedAnswer && option === selectedAnswer) {
                                      borderColor = (option === mcq.correctAnswer) ? 'green' : 'red';
                                    }
                                    return (
                                      <FormControlLabel
                                        key={optionIndex}
                                        value={option}
                                        control={<Radio />}
                                        label={option}
                                        sx={{ 
                                          border: `2px solid ${borderColor}`,
                                          borderRadius: 1, 
                                          m: 0.5, 
                                          p: 0.5,
                                          width: 'fit-content'
                                        }}
                                      />
                                    );
                                  })}
                                </RadioGroup>
                              </FormControl>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                ) : (
                  <Box component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>{course.outline}</Box>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                {!(course.modules && course.modules.length > 0) && (
                  <Button variant="contained" onClick={() => handleGenerateDetails(course._id)} disabled={detailLoading === course._id}>
                    {detailLoading === course._id ? <CircularProgress size={24} /> : 'Flesh out ✨'}
                  </Button>
                )}
                <Button color="error" variant="outlined" onClick={() => handleDeleteCourse(course._id)} startIcon={<DeleteIcon />}>Delete</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyCoursesPage;