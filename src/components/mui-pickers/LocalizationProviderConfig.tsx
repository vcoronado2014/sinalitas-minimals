import { ReactNode, useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { es, enUS } from 'date-fns/locale';

interface Language {
  id: string;
  dateFnsLocale: any;
}

interface Languages {
  [key: string]: Language
}

type Props = {
  children: ReactNode;
};

const LocalizationProviderConfig = ({ children }: Props) => {

  const [languages] = useState<Languages>({
    es: {
      id: 'es',
      dateFnsLocale: es,
    },
    en: {
      id: 'enUS',
      dateFnsLocale: enUS,
    }
  });

  const [language, setLanguage] = useState<Language>(languages.es)

  const lsLng = localStorage.getItem('i18nextLng') || 'es';

  useEffect(() => {
    setLanguage(languages[lsLng] || languages.es)
  }, [languages, lsLng])

  return (
    <LocalizationProvider adapterLocale={language.dateFnsLocale} dateAdapter={AdapterDateFns}>
      {children}
    </LocalizationProvider>
  )
}

export default LocalizationProviderConfig
