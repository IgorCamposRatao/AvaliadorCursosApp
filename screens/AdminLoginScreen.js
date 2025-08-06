// screens/AdminLoginScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLoginScreen({ navigation }) {
  const [senha, setSenha] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [continueLoggedIn, setContinueLoggedIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Verifica se deve manter logado
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const flag = await AsyncStorage.getItem('adminLoggedIn');
        setLoggedIn(flag === 'true');
        setSenha('');
        setMostrar(false);
        setContinueLoggedIn(false);
      })();
    }, [])
  );

  const senhaCorreta = 'Fraternos@1989';

  const autenticar = async () => {
    if (senha === senhaCorreta) {
      if (continueLoggedIn) {
        await AsyncStorage.setItem('adminLoggedIn', 'true');
      }
      setLoggedIn(true);
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Home' },
          { name: 'AdminDashboard' }
        ],
      });
    } else {
      Alert.alert('Senha incorreta', 'Tente novamente.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('adminLoggedIn');
    setLoggedIn(false);
  };

  if (loggedIn) {
    return (
      <View style={styles.containerLogged}>
        <Text style={styles.title}>Área Administrativa</Text>
        <Text style={styles.loggedText}>Você está logado como administrador.</Text>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área Administrativa</Text>
      <Text style={styles.label}>Digite a senha de administrador:</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, styles.inputText]}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry={!mostrar}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setMostrar(!mostrar)}
        >
          <Ionicons name={mostrar ? 'eye-off' : 'eye'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox value={continueLoggedIn} onValueChange={setContinueLoggedIn} />
        <Text style={styles.checkboxLabel}>Continuar logado</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={autenticar}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLogged: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  loggedText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start', // alinha o texto à esquerda
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
  },
  input: {
    flex: 1,
    height: 48,
  },
  inputText: {
    color: '#000',
  },
  eyeButton: {
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
   alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 24,
    paddingLeft:10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'stretch',
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
