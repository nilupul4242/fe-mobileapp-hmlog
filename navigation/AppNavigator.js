import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import IssueEntryScreen from '../screens/IssueEntryScreen';
import IssueDetailsScreen from '../screens/IssueDetailsScreen';
import UpdateIssueScreen from '../screens/UpdateIssueScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator   screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Issue Form') {
            iconName = 'form-select';
          } else if (route.name === 'Update Issue') {
            iconName = 'clipboard-edit';
          } else if (route.name === 'Issue List') {
            iconName = 'clipboard-list';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4682B4',
        tabBarInactiveTintColor: 'gray',
      })}>

      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Issue Form" component={IssueEntryScreen} />
       <Tab.Screen name="Update Issue" component={UpdateIssueScreen} />
      <Tab.Screen name="Issue List" component={IssueDetailsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={MyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="IssueDetailsScreen" component={IssueDetailsScreen} />
    </Stack.Navigator>
  );
}