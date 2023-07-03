import { BrowserRouter, Route, Routes } from 'react-router-dom';
import front from './settings/Frontend';
import Dashboard from './components/Views/Dashboard';
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
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import MatrixRain from './components/Canvas/MatrixRain';
import WebringCreateView from './components/Views/WebringCreateView';


export default function App() {

  

  return (
    <BrowserRouter>
    <AuthProvider>
      <div className="app-wrapper">
        <Header />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute requireAuth={true}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path={front.login} element={
            <ProtectedRoute requireAuth={false}>
              <LoginRegisterView />
            </ProtectedRoute>
            
          } />

          <Route path={front.register} element={
            <ProtectedRoute requireAuth={false}>
              <LoginRegisterView />
            </ProtectedRoute>
          } />

          <Route path={front.account} element={
            <ProtectedRoute requireAuth={true}>
              <AccountDetails />
            </ProtectedRoute>
          } />

          <Route path={front.loginHelp} element={
            <ProtectedRoute requireAuth={false}>
              <LoginRegisterView />
            </ProtectedRoute>
          } />

          <Route path={front.verifyEmail} element={
            <ProtectedRoute requireAuth={false}>
              <EmailConfirm />
            </ProtectedRoute>
          } />
          <Route path={front.verifyEmailToken} element={
            <ProtectedRoute requireAuth={false}>
              <EmailConfirm />
            </ProtectedRoute>
          } />
          <Route path={front.resetPassword} element={
            <ProtectedRoute requireAuth={false}>
              <PasswordReset />
            </ProtectedRoute>
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
            <ProtectedRoute requireAuth={true}>
              <PageCreateView />
            </ProtectedRoute>
          } />

          <Route path="/webring/add" element={
            <ProtectedRoute requireAuth={true}>
              <WebringCreateView />
            </ProtectedRoute>
          } />



          {/* <Route path="/testing" element={
            <AuthContextTestComponent />
          } /> */}


        </Routes>
        <MatrixRain />
      </div>
      </AuthProvider>
    </BrowserRouter>
      
 
  );
}
