import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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
import { AuthProvider } from './context/AuthContext';
import MatrixRain from './components/Overlays/MatrixRain';
import WebringCreateView from './components/Views/WebringCreateView';
import PageUpdateView from './components/Views/PageUpdateView';
import { ProtectedRoute } from './context/ProtectedRoute';
import WebringUpdateView from './components/Views/WebringUpdateView';
import ErrorView from './components/Views/ErrorView';
import { CacheProvider } from './context/CacheContext';

export default function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
    <CacheProvider>
      <div className="app-wrapper">
        <Header />
        <Routes>
          <Route path="/index.html" element={<Navigate replace to="/" />} />
          <Route path="*" Component={ErrorView}></Route>
          
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

          <Route path="/page/update/:pageId" element={
            <ProtectedRoute 
              requireAuth={true}
              onlyResourcesOwnedByAuthUser={true}
            >
              <PageUpdateView />
            </ProtectedRoute>
          } />

          <Route path="/webring/update/:webringId" element={
            <ProtectedRoute 
              requireAuth={true}
              onlyResourcesOwnedByAuthUser={true}
            >
              <WebringUpdateView />
            </ProtectedRoute>
          } />

        </Routes>

        <MatrixRain />
        </div>
      </CacheProvider>
      </AuthProvider>
    </BrowserRouter>
      
 
  );
}
