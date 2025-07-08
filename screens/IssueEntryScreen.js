import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Menu } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import LanguageContext from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function IssueEntryScreen({ navigation }) {
  const { colors } = useTheme();
  const { language } = useContext(LanguageContext);

  const [formState, setFormState] = useState({
    roomNumber: '',
    issueTitle: '',
    issueDescription: '',
    category: '',
    source: '',
    assignedPerson: '',
  });

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [assignedPersonMenuVisible, setAssignedPersonMenuVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [hotelId, setHotelId] = useState('');

  const t = {
    en: {
      roomNumber: 'Room Number',
      issueTitle: 'Issue Title',
      issueDescription: 'Issue Description',
      category: 'Category',
      source: 'Source',
      assignedPerson: 'Assigned Person',
      submit: 'Submit Issue',
      maintenance: 'Maintenance',
      cleaning: 'Cleaning',
      other: 'Other',
    },
    es: {
      roomNumber: 'Número de Habitación',
      issueTitle: 'Título del Problema',
      issueDescription: 'Descripción del Problema',
      category: 'Categoría',
      source: 'Fuente',
      assignedPerson: 'Persona Asignada',
      submit: 'Enviar Problema',
      maintenance: 'Mantenimiento',
      cleaning: 'Limpieza',
      other: 'Otro',
    },
  }[language] || {};

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedHotelId = await AsyncStorage.getItem('hotelid');
      setUsername(storedUsername || '');
      setHotelId(storedHotelId || '');
    };

    fetchUsername();
  }, []);

  const handleChange = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const handleSubmit = async () => {
    if (!username || !hotelId) {
      Toast.show('User session missing. Please log in again.', { duration: Toast.durations.LONG });
      return;
    }

    const issuePayload = {
      ...formState,
      addUser: username,
      hotelId: hotelId,
    };

    try {
      const res = await fetch('http://172.20.10.2:5000/api/Maintenance/add-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issuePayload),
      });

      if (!res.ok) throw new Error((await res.json()).message || 'Submission failed');

      Toast.show('Issue submitted successfully!', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      setFormState({
        roomNumber: '',
        issueTitle: '',
        issueDescription: '',
        category: '',
        source: '',
        assignedPerson: '',
      });

      setCategoryMenuVisible(false);
      setAssignedPersonMenuVisible(false);
    } catch (err) {
      console.error('Error:', err.message);
      Alert.alert('Error submitting issue:', err.message);
    }
  };

  return (
    <View style={styles.container(colors)}>
      <View style={styles.languageSwitcher}>
        <LanguageSwitcher />
      </View>

      <Card style={styles.card(colors)}>
        <Card.Content>
          <TextInput
            label={t.roomNumber}
            mode="outlined"
            value={formState.roomNumber}
            onChangeText={(text) => handleChange('roomNumber', text)}
            style={styles.input}
          />
          <TextInput
            label={t.issueTitle}
            mode="outlined"
            value={formState.issueTitle}
            onChangeText={(text) => handleChange('issueTitle', text)}
            style={styles.input}
          />
          <TextInput
            label={t.issueDescription}
            mode="outlined"
            value={formState.issueDescription}
            onChangeText={(text) => handleChange('issueDescription', text)}
            multiline
            numberOfLines={6}
            style={[styles.input, styles.textArea]}
          />
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TextInput
                label={t.category}
                mode="outlined"
                value={formState.category}
                onFocus={() => setCategoryMenuVisible(true)}
                style={styles.input}
              />
            }
          >
            <Menu.Item onPress={() => handleChange('category', t.maintenance)} title={t.maintenance} />
            <Menu.Item onPress={() => handleChange('category', t.cleaning)} title={t.cleaning} />
            <Menu.Item onPress={() => handleChange('category', t.other)} title={t.other} />
          </Menu>
          <TextInput
            label={t.source}
            mode="outlined"
            value={formState.source}
            onChangeText={(text) => handleChange('source', text)}
            style={styles.input}
          />
          <Menu
            visible={assignedPersonMenuVisible}
            onDismiss={() => setAssignedPersonMenuVisible(false)}
            anchor={
              <TextInput
                label={t.assignedPerson}
                mode="outlined"
                value={formState.assignedPerson}
                onFocus={() => setAssignedPersonMenuVisible(true)}
                style={styles.input}
              />
            }
          >
            <Menu.Item onPress={() => handleChange('assignedPerson', 'John Doe')} title="John Doe" />
            <Menu.Item onPress={() => handleChange('assignedPerson', 'Jane Smith')} title="Jane Smith" />
            <Menu.Item onPress={() => handleChange('assignedPerson', 'Other')} title={t.other} />
          </Menu>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            {t.submit}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: (colors) => ({
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'center',
  }),
  card: (colors) => ({
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 4,
  }),
  input: {
    marginBottom: 16,
  },
  textArea: {
    height: 120,
  },
  button: {
    marginTop: 16,
  },
  languageSwitcher: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
});
