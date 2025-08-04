import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { useFocusEffect } from '@react-navigation/native';
import { exportarAvaliacoesParaExcel } from '../utils/exportarExcel';
import { carregarAvaliacoes } from '../storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminAvaliacoesScreen({ route }) {
  const { titulo, avaliacoes } = route.params || {};

  const normalizeItem = (av) => {
    const base =
      av.avaliacoes && typeof av.avaliacoes === 'object'
        ? { ...av, ...av.avaliacoes }
        : { ...av };
    return {
      ...base,
      ambiente: base.ambiente ?? base['Ambiente Espiritual e Fraterno'] ?? null,
    };
  };

  const initialListFromParams = useMemo(() => {
    if (!Array.isArray(avaliacoes)) {
      console.warn(
        'AdminAvaliacoesScreen: esperava array em "avaliacoes", recebeu:',
        avaliacoes
      );
      return [];
    }
    return avaliacoes.map(normalizeItem);
  }, [avaliacoes]);

  const [avaliacoesLocal, setAvaliacoesLocal] = useState(initialListFromParams);
  const [selecionados, setSelecionados] = useState([]);
  const [selecionarTodos, setSelecionarTodos] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const todasOriginais = await carregarAvaliacoes();
        const atuais = Array.isArray(todasOriginais) ? todasOriginais : [];
        const normalizadas = atuais.map(normalizeItem);
        setAvaliacoesLocal(normalizadas);
        setSelecionados([]);
        setSelecionarTodos(false);
      })();
    }, [])
  );

  useEffect(() => {
    setAvaliacoesLocal(initialListFromParams);
    setSelecionados([]);
    setSelecionarTodos(false);
  }, [initialListFromParams]);

  const toggleSelecionado = (index) => {
    setSelecionados((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSelecionarTodos = () => {
    if (selecionarTodos) {
      setSelecionados([]);
    } else {
      setSelecionados(avaliacoesLocal.map((_, i) => i));
    }
    setSelecionarTodos(!selecionarTodos);
  };

  const excluirSelecionados = async () => {
    if (selecionados.length === 0) return;

    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir ${selecionados.length} avaliação(ões)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const todasOriginais = await carregarAvaliacoes();
            const atuais = Array.isArray(todasOriginais) ? todasOriginais : [];

            const datasParaRemover = selecionados.map(
              (i) => avaliacoesLocal[i].data
            );

            const filtradasOriginais = atuais.filter(
              (av) => !datasParaRemover.includes(av.data)
            );

            await AsyncStorage.setItem(
              'avaliacoes',
              JSON.stringify(filtradasOriginais)
            );

            const novasLocal = filtradasOriginais.map(normalizeItem);
            setAvaliacoesLocal(novasLocal);
            setSelecionados([]);
            setSelecionarTodos(false);

            Alert.alert('Sucesso', 'Avaliações excluídas com sucesso');
          },
        },
      ]
    );
  };

  const analisarDados = () => {
    const campos = ['clareza', 'instrutores', 'didatica', 'ambiente'];
    const totais = { clareza: 0, instrutores: 0, didatica: 0, ambiente: 0 };
    const contagens = {
      clareza: {},
      instrutores: {},
      didatica: {},
      ambiente: {},
    };
    const validos = { clareza: 0, instrutores: 0, didatica: 0, ambiente: 0 };

    avaliacoesLocal.forEach((av) => {
      campos.forEach((campo) => {
        let nota = av[campo];
        if (campo === 'ambiente') {
          nota =
            av[campo] ?? av['Ambiente Espiritual e Fraterno'] ?? av.ambiente;
        }

        if (typeof nota === 'number' && !isNaN(nota)) {
          totais[campo] += nota;
          validos[campo]++;
          contagens[campo][nota] = (contagens[campo][nota] || 0) + 1;
        }
      });
    });

    let mensagem = `📊 Análise de ${avaliacoesLocal.length} avaliações:\n\n`;

    Object.keys(totais).forEach((campo) => {
      const count = validos[campo];
      const media = count > 0 ? (totais[campo] / count).toFixed(2) : '—';
      mensagem += `🔹 ${campo[0].toUpperCase() + campo.slice(1)}\n`;
      mensagem += `  Média: ${media}\n`;

      Object.entries(contagens[campo])
        .sort((a, b) => b[0] - a[0])
        .forEach(([nota, qtde]) => {
          mensagem += `  Nota ${nota}: ${qtde}x\n`;
        });

      mensagem += '\n';
    });

    Alert.alert('📊 Análise de Dados', mensagem);
  };

  const exportar = () => {
    const selecionadasArr =
      selecionados.length > 0
        ? selecionados.map((i) => avaliacoesLocal[i])
        : avaliacoesLocal;
    exportarAvaliacoesParaExcel(selecionadasArr);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.title}>{titulo}</Text>

      <View style={styles.selectAllContainer}>
        <CheckBox value={selecionarTodos} onValueChange={toggleSelecionarTodos} />
        <Text style={styles.selectAllText}>Selecionar Todos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {avaliacoesLocal.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
            Nenhuma avaliação disponível para exibir.
          </Text>
        )}
        {avaliacoesLocal.map((av, index) => (
          <View
            key={`${av.curso}-${av.data}-${av.identificacao || 'anon'}`}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <CheckBox
                value={selecionados.includes(index)}
                onValueChange={() => toggleSelecionado(index)}
              />
              <Text style={styles.curso}>{av.curso}</Text>
            </View>

            <Text style={styles.nota}>
              📝 Clareza do conteúdo:{' '}
              {typeof av.clareza === 'number' ? av.clareza : '—'}
            </Text>
            <Text style={styles.nota}>
              🎓 Instrutores:{' '}
              {typeof av.instrutores === 'number' ? av.instrutores : '—'}
            </Text>
            <Text style={styles.nota}>
              💬 Didática:{' '}
              {typeof av.didatica === 'number' ? av.didatica : '—'}
            </Text>
            <Text style={styles.nota}>
              🌿 Ambiente:{' '}
              {typeof av.ambiente === 'number' ? av.ambiente : '—'}
            </Text>
            <Text style={styles.comentario}>
              💡 Comentário: {av.comentario || '—'}
            </Text>
            <Text style={styles.ident}>
              👤 Identificação: {av.identificacao || 'Anônimo'}
            </Text>
            <Text style={styles.data}>
              📅 {av.data ? new Date(av.data).toLocaleDateString() : '—'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={exportar}
            disabled={avaliacoesLocal.length === 0}
          >
            <Text style={styles.buttonText}>Exportar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={analisarDados}
            disabled={avaliacoesLocal.length === 0}
          >
            <Text style={styles.buttonText}>Analisar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={excluirSelecionados}
            disabled={selecionados.length === 0}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 180,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  selectAllText: {
    fontSize: 16,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  curso: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  nota: { fontSize: 16, marginVertical: 2 },
  comentario: { fontSize: 15, marginTop: 8, fontStyle: 'italic' },
  ident: { fontSize: 14, marginTop: 4, color: '#444' },
  data: { fontSize: 12, color: '#888', marginTop: 4 },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
