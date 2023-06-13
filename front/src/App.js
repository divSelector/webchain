import { BrowserRouter, Route, Routes, useRoutes } from 'react-router-dom';
import FrontendSettings from './settings/Frontend';
import Dashboard from './routes/Dashboard';
import useToken from './hooks/useToken';
import EmailConfirm from './routes/EmailConfirm';

export default function App() {

  const { token, setToken } = useToken()
  const front = FrontendSettings()

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <h1>Application</h1>
        <Routes>
          <Route path="/" element={
            <Dashboard token={token} setToken={setToken} />
          } />
          <Route path={front.verifyEmail} element={
            <EmailConfirm token={token} setToken={setToken} />
          } />
          <Route path={front.verifyEmailToken} element={
            <EmailConfirm token={token} setToken={setToken} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
      
 
  );
}
