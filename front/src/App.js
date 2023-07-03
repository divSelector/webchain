import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontendSettings from './settings/Frontend';
import Dashboard from './routes/Dashboard';
import useToken from './hooks/useToken';
import EmailConfirm from './routes/EmailConfirm';
import PasswordReset from './routes/PasswordReset';
import LoginRegisterView from './routes/LoginRegisterView';
import PageListView from './routes/PageListView';
import WebringListView from './routes/WebringListView';
import WebringDetailView from './routes/WebringDetailView';
import PageDetailView from './routes/PageDetailView';
import Header from './components/Layout/Header';
import AccountDetails from './routes/AccountDetails';
import PageCreateView from './routes/PageCreateView';


function Testing123() {
  return (
  <></>
  )
}

export default function App() {

  const { token, setToken } = useToken()
  const front = FrontendSettings()

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header token={token} setToken={setToken} />
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

          <Route path={front.account} element={
            <AccountDetails token={token} setToken={setToken} />
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

          <Route path={front.pages} element={
            <PageListView />
          } />
          <Route path={front.webrings} element={
            <WebringListView />
          } />

          <Route path="/webring/:webringId" element={
            <WebringDetailView />
          } />
          <Route path="/page/:pageId" element={
            <PageDetailView />
          } />

          <Route path="/page/add" element={
            <PageCreateView token={token} />
          } />


          <Route path="/testing" element={
            <Testing123 />
          } />


        </Routes>
        {/* <MatrixRain /> */}
      </div>
    </BrowserRouter>
      
 
  );
}
