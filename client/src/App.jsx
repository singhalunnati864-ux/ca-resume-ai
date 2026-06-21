import React, { useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Pricing from './components/Pricing.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import StipendEstimator from './components/StipendEstimator.jsx';
import InterviewPrep from './components/InterviewPrep.jsx';
import ResumeBuilder from './components/ResumeBuilder/index.jsx';
import Templates from './components/Templates.jsx';
import Profile from './components/Profile.jsx';
import PaymentModal from './modals/PaymentModal.jsx';
import PaySuccessModal from './modals/PaySuccessModal.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
import RegisterPage from './components/Auth/RegisterPage.jsx';
import VerifyEmailPage from './components/Auth/VerifyEmailPage.jsx';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './components/Auth/ResetPasswordPage.jsx';
import { useToast } from './hooks/useToast.js';
import { usePayment } from './hooks/usePayment.js';
import { useAuth } from './hooks/useAuth.js';
import { loadResume } from './utils/api.js';
import { initData } from './constants/initData.js';

function App() {
  const [page, setPage] = useState('home');
  const [showAppLoader, setShowAppLoader] = useState(true);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [data, setData] = useState(initData());
  const [ats, setAts] = useState(0);
  const [step, setStep] = useState(0);
  const [payM, setPayM] = useState(null);
  const [payOk, setPayOk] = useState(null);
  const [toast, showToast] = useToast();
  const [pendingVerify, setPendingVerify] = useState(null);
  const [resetEmail, setResetEmail] = useState('');

  const { user, setUser, loading, logout } = useAuth();

  useEffect(() => {
    const handleContext = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContext);
    return () => document.removeEventListener('contextmenu', handleContext);
  }, []);

  useEffect(() => {
    if (window.location.search.includes('login=success')) {
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast('Successfully logged in with Google');
    }

    if (!user) return;

    loadResume()
      .then((res) => {
        if (res.resumeData && Object.keys(res.resumeData).length > 0) {
          setData(res.resumeData);
        } else {
          setData((prev) => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
          }));
        }
        if (res.atsScore) setAts(res.atsScore);
      })
      .catch(console.error);
  }, [user, showToast]);

  useEffect(() => {
    if (loading || !showAppLoader) return undefined;

    setLoaderExiting(true);
    const timer = window.setTimeout(() => {
      setShowAppLoader(false);
      setLoaderExiting(false);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [loading, showAppLoader]);

  const hasBoughtPlan = user && user.plan && user.plan !== 'free';

  useEffect(() => {
    if (page === 'pricing' && hasBoughtPlan) {
      setPage('home');
    }
  }, [page, hasBoughtPlan, setPage]);

  const isPro = user?.plan === 'pro';
  const hasTool = user?.plan === 'tools' || user?.plan === 'pro';
  const themeClass = 'theme-dark';
  const pageClass = `page-${page}`;

  const setIsPro = (val) => {
    if (val && user) setUser({ ...user, plan: 'pro' });
  };

  const setHasTool = (val) => {
    if (val && user && user.plan !== 'pro') setUser({ ...user, plan: 'tools' });
  };

  const startPayOrig = usePayment({
    isPro,
    setIsPro,
    hasTool,
    setHasTool,
    data,
    setPayM,
    setPayOk,
    showToast,
  });

  const startPay = (type) => {
    if (!user) {
      showToast('Please create an account to upgrade');
      setPage('login');
      return;
    }

    startPayOrig(type);
  };

  const navigateTo = (dest, extra) => {
    if (dest === 'reset-password' && extra) setResetEmail(extra);
    setPage(dest);
  };

  const handleVerifyNeeded = (info) => {
    setPendingVerify(info);
    setPage('verify-email');
  };

  const renderPage = () => {
    const isProtected = ['builder', 'tools', 'admin', 'profile'].includes(page);
    if (isProtected && !user) {
      return (
        <LoginPage
          key={`protected-${page}`}
          setUser={setUser}
          setPage={navigateTo}
          showToast={showToast}
          onVerifyNeeded={handleVerifyNeeded}
        />
      );
    }

    switch (page) {
      case 'home':
        return <Hero setPage={setPage} hasBoughtPlan={hasBoughtPlan} />;
      case 'pricing':
        return <Pricing setPage={setPage} isPro={isPro} hasTool={hasTool} startPay={startPay} />;
      case 'tools':
        return <InterviewPrep hasTool={hasTool} isPro={isPro} setShowPayM={setPayM} user={user} showToast={showToast} />;
      case 'stipend':
        return <StipendEstimator />;
      case 'admin':
        return <AdminDashboard />;
      case 'templates':
        return <Templates setPage={setPage} isPro={isPro} setShowPayM={setPayM} />;
      case 'profile':
        return <Profile user={user} setUser={setUser} setPage={setPage} showToast={showToast} ats={ats} />;
      case 'builder':
        return (
          <ResumeBuilder
            data={data}
            setData={setData}
            step={step}
            setStep={setStep}
            isPro={isPro}
            setShowPayM={setPayM}
            ats={ats}
            setAts={setAts}
            showToast={showToast}
          />
        );
      case 'login':
        return <LoginPage setUser={setUser} setPage={navigateTo} showToast={showToast} onVerifyNeeded={handleVerifyNeeded} />;
      case 'register':
        return <RegisterPage setUser={setUser} setPage={navigateTo} showToast={showToast} onVerifyNeeded={handleVerifyNeeded} />;
      case 'verify-email':
        return <VerifyEmailPage setUser={setUser} setPage={navigateTo} showToast={showToast} verifyEmail={pendingVerify} />;
      case 'forgot-password':
        return <ForgotPasswordPage setPage={navigateTo} showToast={showToast} />;
      case 'reset-password':
        return <ResetPasswordPage setPage={navigateTo} showToast={showToast} resetEmail={resetEmail} />;
      default:
        return <Hero setPage={setPage} />;
    }
  };

  return (
    <div className={`app-shell ${themeClass} ${pageClass}`}>
      <Nav page={page} setPage={setPage} isPro={isPro} user={user} logout={logout} />
      {showAppLoader ? (
        <div className={`app-loader-screen${loaderExiting ? ' app-loader-screen-exit' : ''}`}>
          <div className={`app-loader-orbit${loaderExiting ? ' app-loader-orbit-paused' : ''}`} aria-hidden="true">
            <span className="app-loader-dot" />
            <span className="app-loader-dot" />
            <span className="app-loader-dot" />
            <span className="app-loader-dot" />
          </div>
          <div className="app-loader-label">CA Resume AI Assistant</div>
        </div>
      ) : (
        renderPage()
      )}
      {payM && <PaymentModal type={payM} onClose={() => setPayM(null)} startPay={startPay} />}
      {payOk && <PaySuccessModal type={payOk} onClose={() => setPayOk(null)} onNavigate={() => setPage(payOk === 'pro' ? 'builder' : 'tools')} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
