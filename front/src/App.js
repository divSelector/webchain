import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontendSettings from './settings/Frontend';
import Dashboard from './routes/Dashboard';
import useToken from './hooks/useToken';
import EmailConfirm from './routes/EmailConfirm';
import PasswordReset from './routes/PasswordReset';
import LoginRegisterView from './routes/LoginRegisterView';

export default function App() {

  const { token, setToken } = useToken()
  const front = FrontendSettings()

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <h1>Webrings</h1>
        <Routes>
          <Route path="/" element={
            <Dashboard token={token} setToken={setToken} />
          } />

          <Route path={front.login} element={
            <LoginRegisterView token={token} setToken={setToken} />
          } />

          <Route path={front.register} element={
            <LoginRegisterView token={token} setToken={setToken} />
          } />

          <Route path={front.loginHelp} element={
            <LoginRegisterView token={token} setToken={setToken} />
          } />


          <Route path={front.verifyEmail} element={
            <EmailConfirm token={token} setToken={setToken} />
          } />
          <Route path={front.verifyEmailToken} element={
            <EmailConfirm token={token} setToken={setToken} />
          } />
          <Route path={front.resetPassword} element={
            <PasswordReset token={token} setToken={setToken} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
      
 
  );
}
