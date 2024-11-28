import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enBuyersProfile from './locales/english/buyersProfile.json';
import mrBuyersProfile  from './locales/marathi/buyersProfile.json';
import enLoginAndRegistarion from './locales/english/loginAndRegistration.json';
import mrLoginAndRegistarion from './locales/marathi/loginAndRegistration.json'
import store from './redux/store/store';


const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18next.use(initReactI18next).init({
  resources: {
    en: { 
      profile: enBuyersProfile,
      login:enLoginAndRegistarion, 
    },
    mr: { 
      profile: mrBuyersProfile,
      login:mrLoginAndRegistarion
    },
  },
  lng: savedLanguage, // default language
  fallbackLng: 'en', // fallback language if translation is missing
  interpolation: { escapeValue: false },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>,
    </QueryClientProvider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
