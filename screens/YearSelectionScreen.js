// screens/YearSelectionScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function YearSelectionScreen({ navigation, route }) {
  const { curso } = route.params;
  const [ano, setAno] = useState(null);
  const anos = ['1º Ano', '2º Ano'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual ano você participou?</Text>

      {anos.map((a, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, ano === a && styles.selectedOption]}
          onPress={() => setAno(a)}
        >
          <Text style={styles.optionText}>{a}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !ano && styles.buttonDisabled]}
        disabled={!ano}
        onPress={() => navigation.navigate('Avaliacao1', { curso, ano })}
      >
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
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
  optionText: { fontSize: 18 },
  button: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, marginTop: 24 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});
