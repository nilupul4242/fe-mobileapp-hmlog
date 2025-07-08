import React, { useContext, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { ActivityIndicator, Card, Text, useTheme, Title, Button } from 'react-native-paper';
import DashboardTile from '../components/DashboardTile';
import LanguageSwitcher from '../components/LanguageSwitcher';
import LanguageContext from '../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState({
    issuesReportedToday: 0,
    issuesResolvedToday: 0,
  });

  const [loading, setLoading] = useState(true);
  const { language } = useContext(LanguageContext);
  const { colors } = useTheme();

  const translations = {
    en: {
      issuesReportedToday: 'Issues Reported Today',
      issuesResolvedToday: 'Issues Resolved Today',
      logOut: 'Log Out',
      dashboardTitle: 'Dashboard',
      logoutConfirmTitle: 'Confirm Logout',
      logoutConfirmMessage: 'Are you sure you want to logout?',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
    },
    es: {
      issuesReportedToday: 'Problemas Informados Hoy',
      issuesResolvedToday: 'Problemas Resueltos Hoy',
      logOut: 'Cerrar Sesión',
      dashboardTitle: 'Tablero',
      logoutConfirmTitle: 'Confirmar Cierre de Sesión',
      logoutConfirmMessage: '¿Está seguro que desea cerrar sesión?',
      yes: 'Sí',
      no: 'No',
      loading: 'Cargando...',
    },
  };

  const t = translations[language] || translations.en;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const response = await fetch('http://172.20.10.2:5000/api/Maintenance/dashboard');
          const data = await response.json();
          if (isActive) {
            setDashboardData(data);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchDashboardData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      t.logoutConfirmTitle,
      t.logoutConfirmMessage,
      [
        { text: t.no, style: 'cancel' },
        {
          text: t.yes,
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (err) {
              console.error('Error clearing storage during logout:', err);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.text, fontSize: 16 }}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Container for LanguageSwitcher and Logout button */}
      <View style={styles.topRightContainer}>
        <LanguageSwitcher />
        <Button
          mode="text"
          compact
          onPress={handleLogout}
          labelStyle={{ fontSize: 14, color: colors.primary }}
          style={styles.logoutButton}
        >
          {t.logOut}
        </Button>
      </View>

      <Title style={[styles.title, { color: colors.primary }]}>{t.dashboardTitle}</Title>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card
          style={[styles.card, { backgroundColor: colors.surface, elevation: 6 }]}
          onPress={() => navigation.navigate('IssueDetailsScreen')}
        >
          <Card.Content>
            <DashboardTile  onPress={() => navigation.navigate('IssueDetailsScreen')}
              title={t.issuesReportedToday}
              count={dashboardData.issuesReportedToday}
            />
          </Card.Content>
        </Card>

        <Card
          style={[styles.card, { backgroundColor: colors.surface, elevation: 6 }]}
          onPress={() => navigation.navigate('IssueDetailsScreen')}
        >
          <Card.Content>
            <DashboardTile  onPress={() => navigation.navigate('IssueDetailsScreen')}
              title={t.issuesResolvedToday}
              count={dashboardData.issuesResolvedToday}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topRightContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  logoutButton: {
    marginLeft: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'left',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
