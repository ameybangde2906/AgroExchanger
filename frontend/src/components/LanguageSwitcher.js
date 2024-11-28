import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('profile');

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage); // Change the language using i18next
    localStorage.setItem('i18nextLng', selectedLanguage);
  };

  return (
    <div className='flex'>
      <div htmlFor="language-select" className='flex mr-1' >
        <LanguageIcon />
      </div>
      <select
        id="language-select"
        className="border border-gray-300 rounded text-sm w-18" // Tailwind CSS classes
        onChange={handleLanguageChange}
        defaultValue={i18n.language}
      >
        <option value="en">English</option>
        <option value="mr">मराठी</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
