import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontendSettings from './settings/Frontend';
import Dashboard from './components/Views/Dashboard';
import useToken from './hooks/useToken';
import EmailConfirm from './components/Views/EmailConfirm';
import PasswordReset from './components/Views/PasswordReset';
import LoginRegisterView from './components/Views/LoginRegisterView';
import PageListView from './components/Views/PageListView';
import WebringListView from './components/Views/WebringListView';
import WebringDetailView from './components/Views/WebringDetailView';
import PageDetailView from './components/Views/PageDetailView';
import Header from './components/Layout/Header';
import AccountDetails from './components/Views/AccountDetails';
import PageCreateView from './components/Views/PageCreateView';
import { AuthProvider, AuthContextTestComponent } from './context/AuthContext';

function Testing123() {
  return (
  <></>
  )
}

export default function App() {

  const front = FrontendSettings()

  return (
    <BrowserRouter>
    <AuthProvider>
      <div className="app-wrapper">
        <Header />
        <Routes>
          <Route path="/" element={
            <Dashboard />
          } />

          <Route path={front.login} element={
            <LoginRegisterView />
          } />

          <Route path={front.register} element={
            <LoginRegisterView />
          } />

          <Route path={front.account} element={
            <AccountDetails />
          } />

          <Route path={front.loginHelp} element={
            <LoginRegisterView />
          } />

          <Route path={front.verifyEmail} element={
            <EmailConfirm />
          } />
          <Route path={front.verifyEmailToken} element={
            <EmailConfirm />
          } />
          <Route path={front.resetPassword} element={
            <PasswordReset />
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
            <PageCreateView />
          } />


          <Route path="/testing" element={
            <AuthContextTestComponent />
          } />


        </Routes>
        {/* <MatrixRain /> */}
      </div>
      </AuthProvider>
    </BrowserRouter>
      
 
  );
}
