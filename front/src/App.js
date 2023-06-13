import Dashboard from './routes/Dashboard/Dashboard';
import Preferences from './routes/Preferences/Preferences';
import AccountVerification from './views/AccountVerification/AccountVerification';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

export default function App() {

  return (
    <>
      <div className="wrapper">
        <h1>Application</h1>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/email/confirm/:token" element={<AccountVerification />} />
              <Route path="/preferences" element={<Preferences />} />
            </Routes>
          </BrowserRouter>
      </div>
    </>
  );
}
