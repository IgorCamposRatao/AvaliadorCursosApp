// screens/AdminLoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminLoginScreen({ navigation }) {
  const [senha, setSenha] = useState('');

    useFocusEffect(
    React.useCallback(() => {
      setSenha('');
    }, [])
  );


  const senhaCorreta = 'Fraternos@1989'; // Você pode trocar por outra senha

  const autenticar = () => {
    if (senha === senhaCorreta) {
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Senha incorreta', 'Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
                  <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Área Administrativa</Text>
      <Text style={styles.label}>Digite a senha de administrador:</Text>

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={autenticar}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     paddingTop:100,
    padding: 24,
     backgroundColor: '#fff',
  },
      logo: {
    alignSelf: 'center',
    width: 400,
    height: 400,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
