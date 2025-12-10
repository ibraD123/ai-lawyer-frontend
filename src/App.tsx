import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InteractiveFeatures } from './components/InteractiveFeatures';
import { Pricing } from './components/Pricing';
import { FinalCTA } from './components/FinalCTA';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { FeaturesPage } from './components/FeaturesPage';
import { SecurityPage } from './components/SecurityPage';
import { AboutUs } from './components/AboutUs';
import { ContactForm } from './components/ContactForm';

type Page = 'home' | 'features' | 'security' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkTheme(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    if (email && password) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setHighlightedFeature(null);
  };
  
  const navigateToFeatures = (featureId?: string) => {
    setCurrentPage('features');
    setHighlightedFeature(featureId || null);
  };
  
  const navigateToSecurity = () => setCurrentPage('security');

  const handleToggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (currentPage === 'dashboard' && isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (currentPage === 'features') {
    return (
      <>
        <FeaturesPage 
          onNavigateHome={navigateToHome} 
          onLoginClick={() => setShowAuthModal(true)}
          highlightedFeature={highlightedFeature}
          isDarkTheme={isDarkTheme}
          onToggleTheme={handleToggleTheme}
        />
        {showDemoForm && <ContactForm onClose={() => setShowDemoForm(false)} isDemo={true} />}
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            isDarkTheme={isDarkTheme}
          />
        )}
      </>
    );
  }

  if (currentPage === 'security') {
    return (
      <>
        <SecurityPage 
          onNavigateHome={navigateToHome} 
          onLoginClick={() => setShowAuthModal(true)}
          onDemoClick={() => setShowDemoForm(true)}
          isDarkTheme={isDarkTheme}
          onToggleTheme={handleToggleTheme}
        />
        {showDemoForm && <ContactForm onClose={() => setShowDemoForm(false)} isDemo={true} />}
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            isDarkTheme={isDarkTheme}
          />
        )}
      </>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
      <Header 
        onLoginClick={() => setShowAuthModal(true)}
        onDemoClick={() => setShowDemoForm(true)}
        onNavigateHome={navigateToHome}
        onNavigateToFeatures={navigateToFeatures}
        onNavigateToSecurity={navigateToSecurity}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
      />
      <Hero isDarkTheme={isDarkTheme} onDemoClick={() => setShowDemoForm(true)} />
      <InteractiveFeatures isDarkTheme={isDarkTheme} />
      <Pricing isDarkTheme={isDarkTheme} />
      <AboutUs isDarkTheme={isDarkTheme} />
      <FinalCTA isDarkTheme={isDarkTheme} onDemoClick={() => setShowDemoForm(true)} />
      
      {showDemoForm && <ContactForm onClose={() => setShowDemoForm(false)} isDemo={true} />}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          isDarkTheme={isDarkTheme}
        />
      )}
    </div>
  );
}