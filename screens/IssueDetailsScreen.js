import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Title, useTheme, Divider, Menu, Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

import IssueList from '../components/IssueList';
import LoadingSpinner from '../components/LoadingSpinner';
import LanguageContext from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function IssueDetailsScreen() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isResolved, setIsResolved] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [username, setUsername] = useState('');

  const isFocused = useIsFocused();
  const { colors } = useTheme();

  const { language } = useContext(LanguageContext);

  // Translations
  const t = {
    en: {
      noUser: 'No user found. Please log in.',
      filter: 'Filter',
      resolved: 'Resolved',
      unresolved: 'Unresolved',
      issueDetails: 'Issue Details',
    },
    es: {
      noUser: 'No se encontró usuario. Por favor inicie sesión.',
      filter: 'Filtro',
      resolved: 'Resuelto',
      unresolved: 'No resuelto',
      issueDetails: 'Detalles del Problema',
    },
  }[language] || {};

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://172.20.10.2:5000/api/Maintenance/issues?isResolved=${isResolved}`);
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        Toast.show(t.noUser, { duration: Toast.durations.LONG });
      }

      fetchIssues();
    };

    if (isFocused) {
      init();
    }
  }, [isFocused, isResolved]);

  const handleSelectResolved = (value) => {
    setIsResolved(value);
    setMenuVisible(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Title style={[styles.title, { color: colors.primary }]}>{t.issueDetails}</Title>
        <LanguageSwitcher />
      </View>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.filterButton}>
            {t.filter}: {isResolved ? t.resolved : t.unresolved}
          </Button>
        }
      >
        <Menu.Item onPress={() => handleSelectResolved(true)} title={t.resolved} />
        <Menu.Item onPress={() => handleSelectResolved(false)} title={t.unresolved} />
      </Menu>

      <FlatList
        data={issues}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <IssueList issue={item} />}
        ItemSeparatorComponent={() => <Divider style={{ marginVertical: 8 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 28,
  },
  filterButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
});
