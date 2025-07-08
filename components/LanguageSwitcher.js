import React, { useState, useContext } from 'react';
import { Menu, IconButton, Text } from 'react-native-paper';
import LanguageContext from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  const selectedLanguage = languages.find(l => l.code === language) || languages[0];

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon="translate" 
          onPress={openMenu}
          accessibilityLabel="Select language"
        />
      }
    >
      {languages.map(({ code, label }) => (
        <Menu.Item
          key={code}
          onPress={() => {
            setLanguage(code);
            closeMenu();
          }}
          title={label}
          leadingIcon={code === language ? 'check' : null} 
        />
      ))}
    </Menu>
  );
}
