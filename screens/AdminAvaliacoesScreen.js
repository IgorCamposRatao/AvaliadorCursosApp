import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { exportarAvaliacoesParaExcel } from '../utils/exportarExcel';

export default function AdminAvaliacoesScreen({ route }) {
  const { titulo, avaliacoes } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{titulo}</Text>

      {avaliacoes.map((av, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.curso}>{av.curso}</Text>
          <Text style={styles.nota}>📝 Clareza do conteúdo: {av.clareza}</Text>
          <Text style={styles.nota}>🎓 Instrutores: {av.instrutores}</Text>
          <Text style={styles.nota}>💬 Didática: {av.didatica}</Text>
          <Text style={styles.nota}>🌿 Ambiente: {av.ambiente}</Text>
          <Text style={styles.comentario}>💡 Comentário: {av.comentario || '—'}</Text>
          <Text style={styles.ident}>
            👤 Identificação: {av.identificacao || 'Anônimo'}
          </Text>
          <Text style={styles.data}>
            📅 {new Date(av.data).toLocaleDateString()}
          </Text>
        </View>
      ))}

      <View style={styles.buttonGroup}>
      <TouchableOpacity
  style={styles.button}
  onPress={() => exportarAvaliacoesParaExcel(avaliacoes)}
>
  <Text style={styles.buttonText}>Exportar para Excel</Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Aqui no futuro chamaremos a análise de dados
            alert('Função de análise ainda não implementada');
          }}
        >
          <Text style={styles.buttonText}>Analisar Dados</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  curso: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  nota: { fontSize: 16, marginVertical: 2 },
  comentario: { fontSize: 15, marginTop: 8, fontStyle: 'italic' },
  ident: { fontSize: 14, marginTop: 4, color: '#444' },
  data: { fontSize: 12, color: '#888', marginTop: 4 },
  buttonGroup: {
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
