// screens/AdminDashboardScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboardScreen() {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    const carregarAvaliacoes = async () => {
      try {
        const data = await AsyncStorage.getItem('avaliacoes');
        if (data) {
          setAvaliacoes(JSON.parse(data));
        }
      } catch (e) {
        console.log('Erro ao carregar avaliações', e);
      }
    };

    carregarAvaliacoes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel de Avaliações</Text>

      {avaliacoes.length === 0 ? (
        <Text style={styles.empty}>Nenhuma avaliação encontrada.</Text>
      ) : (
        avaliacoes.map((av, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>Curso:</Text>
            <Text>{av.curso}</Text>

            <Text style={styles.label}>Notas:</Text>
            {Object.entries(av.avaliacoes).map(([cat, nota]) => (
              <Text key={cat}>{cat}: {nota}</Text>
            ))}

            {av.comentario ? (
              <>
                <Text style={styles.label}>Comentário:</Text>
                <Text>{av.comentario}</Text>
              </>
            ) : null}

            <Text style={styles.data}>Data: {new Date(av.data).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  data: {
    marginTop: 8,
    fontSize: 12,
    color: '#777',
  },
});
