
import { useLanguage } from '../contexts/LanguageContext';
import { strings } from '../translations/strings';

export const useTranslations = () => {
  const { language } = useLanguage();
  return strings[language];
};
