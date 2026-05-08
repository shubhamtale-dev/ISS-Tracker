import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { ISSProvider } from './context/ISSContext';
import { NewsProvider } from './context/NewsContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/layout/Layout';
import ChatBot from './components/chat/ChatBot';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ISSProvider>
          <NewsProvider>
            <ChatProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '12px',
                    background: 'var(--toast-bg, #1e293b)',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                  },
                  success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                  error:   { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
                }}
              />
              <Layout />
              <ChatBot />
            </ChatProvider>
          </NewsProvider>
        </ISSProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
