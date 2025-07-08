import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Title,
  useTheme,
  Menu,
  Text,
  HelperText,
} from 'react-native-paper';
import LanguageSwitcher from '../components/LanguageSwitcher';
import LanguageContext from '../contexts/LanguageContext';

export default function IssueForm({ formState, setFormState, onSubmit, categories = [], assignees = [] }) {
  const { language } = useContext(LanguageContext);
  const { colors } = useTheme();

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [assigneeMenuVisible, setAssigneeMenuVisible] = useState(false);

  const translations = {
    en: {
      roomNumber: 'Room Number',
      issueTitle: 'Issue Title',
      description: 'Issue Description',
      issueCategory: 'Issue Category',
      source: 'Source',
      personToAssign: 'Person to Assign',
      submit: 'Submit',
      selectCategory: 'Select a category',
      selectAssignee: 'Select a person',
    },
    es: {
      roomNumber: 'Número de Habitación',
      issueTitle: 'Título del Problema',
      description: 'Descripción del Problema',
      issueCategory: 'Categoría del Problema',
      source: 'Fuente',
      personToAssign: 'Persona para Asignar',
      submit: 'Enviar',
      selectCategory: 'Seleccione una categoría',
      selectAssignee: 'Seleccione una persona',
    },
  };

  const t = translations[language] || translations.en;

  const handleChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.backround }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </View>

      <Title style={[styles.title, { color: colors.primary }]}>{t.submit} Issue</Title>

      <TextInput
        label={t.roomNumber}
        mode="outlined"
        value={formState.roomNumber}
        onChangeText={(value) => handleChange('roomNumber', value)}
        keyboardType="numeric"
        style={styles.input}
        outlineColor={colors.primary}
        activeOutlineColor={colors.accent}
      />

      <TextInput
        label={t.issueTitle}
        mode="outlined"
        value={formState.issueTitle}
        onChangeText={(value) => handleChange('issueTitle', value)}
        style={styles.input}
        outlineColor={colors.primary}
        activeOutlineColor={colors.accent}
      />

      <TextInput
        label={t.description}
        mode="outlined"
        multiline
        numberOfLines={4}
        value={formState.issueDescription}
        onChangeText={(value) => handleChange('issueDescription', value)}
        style={[styles.input, { height: 100 }]}
        outlineColor={colors.primary}
        activeOutlineColor={colors.accent}
      />

      {/* Issue Category Dropdown */}
      <Menu
        visible={categoryMenuVisible}
        onDismiss={() => setCategoryMenuVisible(false)}
        anchor={
          <TextInput
            label={t.issueCategory}
            mode="outlined"
            value={formState.issueCategory || ''}
            onFocus={() => setCategoryMenuVisible(true)}
            right={<TextInput.Icon name="menu-down" />}
            style={styles.input}
            editable={false}
          />
        }
      >
        {categories.length === 0 ? (
          <Menu.Item title={t.selectCategory} disabled />
        ) : (
          categories.map((cat) => (
            <Menu.Item
              key={cat}
              title={cat}
              onPress={() => {
                handleChange('issueCategory', cat);
                setCategoryMenuVisible(false);
              }}
            />
          ))
        )}
      </Menu>

      <TextInput
        label={t.source}
        mode="outlined"
        value={formState.source}
        onChangeText={(value) => handleChange('source', value)}
        style={styles.input}
        outlineColor={colors.primary}
        activeOutlineColor={colors.accent}
      />

      {/* Person to Assign Dropdown */}
      <Menu
        visible={assigneeMenuVisible}
        onDismiss={() => setAssigneeMenuVisible(false)}
        anchor={
          <TextInput
            label={t.personToAssign}
            mode="outlined"
            value={formState.personToAssign || ''}
            onFocus={() => setAssigneeMenuVisible(true)}
            right={<TextInput.Icon name="menu-down" />}
            style={styles.input}
            editable={false}
          />
        }
      >
        {assignees.length === 0 ? (
          <Menu.Item title={t.selectAssignee} disabled />
        ) : (
          assignees.map((person) => (
            <Menu.Item
              key={person}
              title={person}
              onPress={() => {
                handleChange('personToAssign', person);
                setAssigneeMenuVisible(false);
              }}
            />
          ))
        )}
      </Menu>

      <Button
        mode="contained"
        onPress={onSubmit}
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
        buttonColor={colors.accent}
      >
        {t.submit}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  languageSwitcherContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
});
