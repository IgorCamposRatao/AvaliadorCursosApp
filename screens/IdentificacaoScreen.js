// screens/IdentificacaoScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function IdentificacaoScreen({ navigation }) {
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const cursos = ['Curso Terceiro Milênio', 'Curso Mediúnico'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual curso você participou?</Text>

      {cursos.map((curso, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            cursoSelecionado === curso && styles.selectedOption,
          ]}
          onPress={() => setCursoSelecionado(curso)}
        >
          <Text style={styles.optionText}>{curso}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.button,
          !cursoSelecionado && styles.buttonDisabled,
        ]}
        disabled={!cursoSelecionado}
        onPress={() => navigation.navigate('Avaliacao1', { curso: cursoSelecionado })}
      >
        <Text style={styles.buttonText}>Avançar</Text>
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
    fontSize: 22,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  option: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#e0f7e9',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
});
