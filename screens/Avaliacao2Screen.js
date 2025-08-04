// screens/Avaliacao2Screen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Avaliacao2Screen({ navigation, route }) {
  const { curso, avaliacoes } = route.params;
  const [nota, setNota] = useState(0);

  const handleAvancar = () => {
    navigation.navigate('Avaliacao3', {
      curso,
      avaliacoes: {
        ...avaliacoes,
        instrutores: nota,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliação do Curso</Text>
      <Text style={styles.subtitle}>{curso}</Text>

      <Text style={styles.tema}>2. Atuação dos Instrutores</Text>

      <View style={styles.bullets}>
        <Text>• Demonstraram preparo e conhecimento sobre os temas.</Text>
        <Text>• Mantiveram postura ética, acolhedora e respeitosa.</Text>
        <Text>• Estimularam a participação e responderam dúvidas com paciência.</Text>
      </View>

      <Text style={styles.pergunta}>Como você avalia esse aspecto?</Text>

      <View style={styles.estrelas}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setNota(n)}>
            <Ionicons
              name={n <= nota ? 'star' : 'star-outline'}
              size={36}
              color="#FFD700"
              style={{ marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.botao, nota === 0 && styles.botaoDesativado]}
        disabled={nota === 0}
        onPress={handleAvancar}
      >
        <Text style={styles.botaoTexto}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 24 },
  tema: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  bullets: { marginBottom: 24 },
  pergunta: { fontSize: 16, marginBottom: 12 },
  estrelas: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
  },
  botaoDesativado: {
    backgroundColor: '#ccc',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
