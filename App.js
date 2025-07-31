// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import IdentificacaoScreen from './screens/IdentificacaoScreen';
import AvaliacaoScreen from './screens/AvaliacaoScreen';
import ConfirmacaoScreen from './screens/ConfirmacaoScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Identificacao" component={IdentificacaoScreen} />
        <Stack.Screen name="Avaliacao" component={AvaliacaoScreen} />
        <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
