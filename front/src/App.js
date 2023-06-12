import Dashboard from './routes/Dashboard/Dashboard';
import Preferences from './routes/Preferences/Preferences';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useToken } from './hooks/useToken'
import './App.css';

export default function App() {

  return (
    <>
      <div className="wrapper">
        <h1>Application</h1>
          <BrowserRouter>
            <Routes>
              <Route path="/dashboard" element={
                <Dashboard />
              } />
              <Route path="/preferences" element={<Preferences />} />
            </Routes>
          </BrowserRouter>
      </div>
    </>
  );
}
