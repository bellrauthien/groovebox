import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../redux/slices/authSlice';
import { 
  AuthForm, 
  InputField, 
  ActionButton, 
  Logo, 
  LoadingSpinner,
  JukeboxContainer
} from '../../styles/StyledComponents';
import styled from 'styled-components';

const AdminLoginContainer = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const JukeboxHeader = styled.div`
  position: relative;
  margin-bottom: 30px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 5px;
    background: linear-gradient(90deg, transparent, var(--color-chrome), transparent);
    border-radius: 5px;
  }
`;

const NeonText = styled.h2`
  color: var(--color-neon-blue);
  font-family: var(--font-display);
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 
    0 0 5px var(--color-neon-blue),
    0 0 10px var(--color-neon-blue),
    0 0 20px var(--color-neon-blue);
  margin-bottom: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
`;

const InstructionText = styled.p`
  color: var(--color-cream);
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
`;

const ErrorMessage = styled.div`
  color: var(--color-neon-pink);
  text-align: center;
  font-size: 1rem;
  margin: 10px 0;
  text-shadow: 
    0 0 5px var(--color-neon-pink),
    0 0 10px var(--color-neon-pink);
  animation: pulse 1.5s infinite;
`;

const GuestButton = styled.button`
  background: none;
  border: none;
  color: var(--color-turquoise);
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-top: 20px;
  cursor: pointer;
  text-shadow: 
    0 0 5px var(--color-turquoise),
    0 0 10px var(--color-turquoise);
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-neon-blue);
    text-shadow: 
      0 0 5px var(--color-neon-blue),
      0 0 10px var(--color-neon-blue),
      0 0 15px var(--color-neon-blue);
    transform: scale(1.05);
  }
`;

const AdminLogin = () => {
  const [adminCode, setAdminCode] = useState('');
  const [dots, setDots] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  // Create a visual effect for the input field
  useEffect(() => {
    const timer = setInterval(() => {
      setDots(prev => prev.length < 6 ? prev + '•' : '•');
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminCode.length === 6) {
      dispatch(loginAdmin(adminCode));
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setAdminCode(value);
    }
  };

  return (
    <JukeboxContainer>
      <AdminLoginContainer>
        <JukeboxHeader>
          <Logo>
            <span>Groove</span>Box
          </Logo>
        </JukeboxHeader>
        
        <AuthForm onSubmit={handleSubmit}>
          <NeonText>Admin Login</NeonText>
          <InstructionText>
            Enter the 6-digit admin code to access GrooveBox administrator features.
          </InstructionText>
          
          <InputField
            type="password"
            placeholder={dots}
            value={adminCode}
            onChange={handleChange}
            maxLength={6}
            pattern="\d{6}"
            required
            autoFocus
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ActionButton 
            type="submit" 
            disabled={adminCode.length !== 6 || loading}
          >
            {loading ? <LoadingSpinner /> : 'LOGIN'}
          </ActionButton>
          
          <GuestButton 
            type="button" 
            onClick={() => window.location.href = '/guest'}
          >
            Continue as Guest
          </GuestButton>
        </AuthForm>
      </AdminLoginContainer>
    </JukeboxContainer>
  );
};

export default AdminLogin;
