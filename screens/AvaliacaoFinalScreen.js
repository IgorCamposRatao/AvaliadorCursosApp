// screens/AvaliacaoFinalScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { salvarAvaliacao } from '../storage/storage';

export default function AvaliacaoFinalScreen({ navigation, route }) {
  const { curso, avaliacoes } = route.params;
  const [comentario, setComentario] = useState('');
  const [identificacao, setIdentificacao] = useState('');

  const handleEnviar = async () => {
    const dados = {
      curso,
      avaliacoes,
      comentario,
      identificacao: identificacao || 'Anônimo',
      data: new Date().toISOString(),
    };

    await salvarAvaliacao(dados);

    Alert.alert('Avaliação enviada!', 'Obrigado por sua contribuição.', [
      { text: 'OK', onPress: () => navigation.navigate('Confirmacao') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Avaliação Final</Text>
        <Text style={styles.label}>Comentário (opcional):</Text>
        <TextInput
          placeholder="Deixe sua opinião, sugestão ou elogio..."
          value={comentario}
          onChangeText={setComentario}
          style={styles.inputMultiline}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Identificação (opcional):</Text>
        <TextInput
          placeholder="Seu nome ou apelido, se quiser se identificar"
          value={identificacao}
          onChangeText={setIdentificacao}
          style={styles.input}
        />

        <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
          <Text style={styles.botaoTexto}>Enviar Avaliação</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 24,
  },
  inputMultiline: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 24,
    height: 100,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
