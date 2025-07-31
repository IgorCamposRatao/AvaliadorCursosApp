// storage/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_AVALIACOES = 'avaliacoes';

// Adiciona uma nova avaliação ao armazenamento
export const salvarAvaliacao = async (avaliacao) => {
  try {
    const data = await AsyncStorage.getItem(CHAVE_AVALIACOES);
    const lista = data ? JSON.parse(data) : [];
    lista.push(avaliacao);
    await AsyncStorage.setItem(CHAVE_AVALIACOES, JSON.stringify(lista));
  } catch (e) {
    console.log('Erro ao salvar avaliação:', e);
  }
};

// Recupera todas as avaliações
export const carregarAvaliacoes = async () => {
  try {
    const data = await AsyncStorage.getItem(CHAVE_AVALIACOES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log('Erro ao carregar avaliações:', e);
    return [];
  }
};

// (Opcional) Limpa todas as avaliações
export const limparAvaliacoes = async () => {
  try {
    await AsyncStorage.removeItem(CHAVE_AVALIACOES);
  } catch (e) {
    console.log('Erro ao limpar avaliações:', e);
  }
};
