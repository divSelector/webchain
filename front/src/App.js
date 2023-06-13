import Dashboard from './routes/Dashboard/Dashboard';
import AccountVerification from './views/AccountVerification/AccountVerification';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontendSettings from './settings/Frontend';
import './App.css';
import useToken from './hooks/useToken';

export default function App() {

  const { token, setToken } = useToken()
  const front = FrontendSettings()

  return (
    <>
      <div className="wrapper">
        <h1>Application</h1>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard token={token} setToken={setToken} />} />
              <Route path={front.verifyEmail} element={<AccountVerification token={token} setToken={setToken} />} />
              <Route path={front.verifyEmailToken} element={<AccountVerification token={token} setToken={setToken} />} />
            </Routes>
          </BrowserRouter>
      </div>
    </>
  );
}
