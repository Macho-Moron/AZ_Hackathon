import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react'; // <-- IMPORT AUTH0
import { SnackbarProvider } from 'notistack';
import HomePage from './pages/HomePage';
import CreateCoursePage from './pages/CreateCoursePage';
import MyCoursesPage from './pages/MyCoursesPage';
import Navbar from './components/Navbar';
import './App.css';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

function App() {
  return (
    <Auth0Provider // <-- WRAP WITH AUTH0
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <SnackbarProvider maxSnack={3}>
        <Router>
          <div className="App">
            <Navbar />
            <div className="content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreateCoursePage />} />
                <Route path="/courses" element={<MyCoursesPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </SnackbarProvider>
    </Auth0Provider>
  );
}

export default App;