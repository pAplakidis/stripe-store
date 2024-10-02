import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { NonAuthRoute, ProtectedRoute } from './components/AuthRoutes.js';
import AuthenticationProvider from './context/AuthenticationContext';

import HomeScreen from './screens/HomeScreen.js';
import RegisterScreen from './screens/sign-up/RegisterScreen.js';
import LoginScreen from './screens/sign-in/LoginScreen.js';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster />
      <div className='app'>
        <BrowserRouter>
          <AuthenticationProvider>
            <Routes>
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <HomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/sign-up'
                element={
                  <NonAuthRoute>
                    <RegisterScreen />
                  </NonAuthRoute>
                }
              />
              <Route
                path='/sign-in'
                element={
                  <NonAuthRoute>
                    <LoginScreen />
                  </NonAuthRoute>
                }
              />
            </Routes>
          </AuthenticationProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
