import React, { useState } from 'react';
import { useSnackbar } from 'notistack'; 
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Button, 
  TextField, 
  Container, 
  Typography, 
  Box, 
  CircularProgress 
} from '@mui/material';

const CreateCoursePage = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState('');
  const { enqueueSnackbar } = useSnackbar();  
  const { user } = useAuth0();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setOutline('');

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userId: user.sub }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate course. Please try again.');
      }

      const data = await response.json();
      setOutline(data.outline);
      enqueueSnackbar('Course generated successfully!', { variant: 'success' }); // <-- SUCCESS NOTIFICATION
    } catch (error) {
      console.error('Error sending topic to backend:', error);
      enqueueSnackbar(error.message, { variant: 'error' }); // <-- ERROR NOTIFICATION
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of the component is the same ...
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create a New Course
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" paragraph>
        Enter a topic you want to learn about, and our AI will generate a course for you.
      </Typography>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Course Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'The History of Ancient Rome'"
          disabled={loading}
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          disabled={loading}
          sx={{ height: 56 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Course'}
        </Button>
      </Box>
      {outline && (
        <Box sx={{ mt: 5, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f9f9f9' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Course Outline
          </Typography>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '1rem' }}>
            {outline}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CreateCoursePage;