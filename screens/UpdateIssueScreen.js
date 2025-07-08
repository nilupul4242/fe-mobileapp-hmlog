import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import LanguageContext from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function UpdateIssueScreen() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const isFocused = useIsFocused();

  const { language } = useContext(LanguageContext);

  const t = {
    en: {
      noUser: 'No user found. Please log in.',
      errorLoadingUser: 'Error loading user data.',
      failedFetch: 'Failed to fetch issues.',
      networkError: 'Network error.',
      usernameNotLoaded: 'Username not loaded. Cannot update issue.',
      issueResolved: 'Issue marked as resolved!',
      failedUpdate: 'Failed to update status.',
      updateError: 'Error updating issue.',
      loadingIssues: 'Loading unresolved issues...',
      markResolved: 'Mark as Resolved',
      description: 'Description',
      category: 'Category',
      source: 'Source',
      assigned: 'Assigned',
      reported: 'Reported',
      hotel: 'Hotel',
      room: 'Room',
    },
    es: {
      noUser: 'No se encontró usuario. Por favor inicie sesión.',
      errorLoadingUser: 'Error al cargar datos de usuario.',
      failedFetch: 'No se pudieron obtener los problemas.',
      networkError: 'Error de red.',
      usernameNotLoaded: 'Nombre de usuario no cargado. No se puede actualizar el problema.',
      issueResolved: '¡Problema marcado como resuelto!',
      failedUpdate: 'No se pudo actualizar el estado.',
      updateError: 'Error al actualizar el problema.',
      loadingIssues: 'Cargando problemas no resueltos...',
      markResolved: 'Marcar como Resuelto',
      description: 'Descripción',
      category: 'Categoría',
      source: 'Fuente',
      assigned: 'Asignado',
      reported: 'Reportado',
      hotel: 'Hotel',
      room: 'Habitación',
    },
  }[language] || {};

  useEffect(() => {
    const init = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          Toast.show(t.noUser, { duration: Toast.durations.LONG });
        }
        await fetchIssues();
      } catch (err) {
        Toast.show(t.errorLoadingUser, { duration: Toast.durations.LONG });
      }
    };

    if (isFocused) {
      init();
    }
  }, [isFocused]);

  const fetchIssues = async () => {
    try {
      const res = await fetch('http://172.20.10.2:5000/api/Maintenance/get-issuesforupdate');
      const json = await res.json();
      if (json.success) {
        const unresolved = json.data.filter(issue => !issue.isResolved);
        setIssues(unresolved);
      } else {
        Toast.show(t.failedFetch, { duration: Toast.durations.LONG });
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      Toast.show(t.networkError, { duration: Toast.durations.LONG });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (issueId) => {
    try {
      if (!username) {
        Toast.show(t.usernameNotLoaded, { duration: Toast.durations.LONG });
        return;
      }

      const res = await fetch('http://172.20.10.2:5000/api/Maintenance/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId,
          isResolved: true,
          loggedUser: username,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        Toast.show(t.issueResolved, { duration: Toast.durations.SHORT });
        setIssues(prev => prev.filter(issue => issue.id !== issueId));
      } else {
        Toast.show(result.message || t.failedUpdate, { duration: Toast.durations.LONG });
      }
    } catch (err) {
      console.error('Update error:', err);
      Toast.show(t.updateError, { duration: Toast.durations.LONG });
    }
  };

  const renderIssueCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.issueTitle}
        subtitle={`${t.hotel}: ${item.hotelName}, ${t.room}: ${item.roomNumber}`}
      />
      <Card.Content>
        <Text>{t.description}: {item.issueDescription}</Text>
        <Text>{t.category}: {item.category}</Text>
        <Text>{t.source}: {item.source}</Text>
        <Text>{t.assigned}: {item.assignedPerson}</Text>
        <Text>{t.reported}: {new Date(item.dateReported).toLocaleDateString()}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleUpdateStatus(item.id)}>
          {t.markResolved}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.languageSwitcher}>
        <LanguageSwitcher />
      </View>
      {loading ? (
        <Text style={styles.loading}>{t.loadingIssues}</Text>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={item => item.id.toString()}
          renderItem={renderIssueCard}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
  },
  languageSwitcher: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
});
