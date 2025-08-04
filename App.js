// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import IdentificacaoScreen from './screens/IdentificacaoScreen';

import Avaliacao1Screen from './screens/Avaliacao1Screen';
import Avaliacao2Screen from './screens/Avaliacao2Screen';
import Avaliacao3Screen from './screens/Avaliacao3Screen';
import Avaliacao4Screen from './screens/Avaliacao4Screen';
import AvaliacaoFinalScreen from './screens/AvaliacaoFinalScreen';

import ConfirmacaoScreen from './screens/ConfirmacaoScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';

import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminAvaliacoesScreen from './screens/AdminAvaliacoesScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Identificacao" component={IdentificacaoScreen} />

        {/* Avaliação por etapas */}
        <Stack.Screen name="Avaliacao1" component={Avaliacao1Screen} />
        <Stack.Screen name="Avaliacao2" component={Avaliacao2Screen} />
        <Stack.Screen name="Avaliacao3" component={Avaliacao3Screen} />
        <Stack.Screen name="Avaliacao4" component={Avaliacao4Screen} />
        <Stack.Screen name="AvaliacaoFinal" component={AvaliacaoFinalScreen} />

        <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminAvaliacoes" component={AdminAvaliacoesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
