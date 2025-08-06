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

const SENHA_ADMIN = 'Fraternos@1989';

export default function AdminLoginScreen({ navigation }) {
  const [senha, setSenha] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [manterLogado, setManterLogado] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const flag = await AsyncStorage.getItem('adminLoggedIn');
        if (flag === 'true') {
          setIsLogged(true);
          setSenha(SENHA_ADMIN);
        } else {
          setIsLogged(false);
          setSenha('');
        }
        setMostrar(false);
        setManterLogado(false);
      })();
    }, [])
  );

  const autenticar = async () => {
    if (senha === SENHA_ADMIN) {
      if (manterLogado) {
        await AsyncStorage.setItem('adminLoggedIn', 'true');
      }
      setIsLogged(true);
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Senha incorreta', 'Tente novamente.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('adminLoggedIn');
    setIsLogged(false);
    setSenha('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área Administrativa</Text>
      <Text style={styles.label}>Digite a senha de administrador:</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={!mostrar}
          value={senha}
          onChangeText={setSenha}
          placeholder="Senha"
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setMostrar(!mostrar)}
        >
          <Ionicons name={mostrar ? 'eye-off' : 'eye'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        {!isLogged && (
          <>
            <CheckBox value={manterLogado} onValueChange={setManterLogado} />
            <Text style={styles.checkboxLabel}>Continuar logado</Text>
          </>
        )}
        {isLogged && (
          <TouchableOpacity onPress={logout}>
            <Text style={[styles.checkboxLabel, styles.logoutText]}>Fazer logout</Text>
          </TouchableOpacity>
        )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000',
  },
  eyeButton: {
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  logoutText: {
    color: '#f44336',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
