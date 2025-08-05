import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { carregarAvaliacoes } from '../storage/storage';
import { agruparPorCursoSemestreAno } from '../utils/agrupamento';
import { Ionicons } from '@expo/vector-icons';

const normalizeAvaliacao = (av) => {
  // Desaninha se veio com { avaliacoes: {...} }
  const base = av.avaliacoes && typeof av.avaliacoes === 'object'
    ? { ...av, ...av.avaliacoes }
    : { ...av };

  // Normaliza ambiente com fallback da chave antiga
  return {
    ...base,
    ambiente:
      base.ambiente ?? base['Ambiente Espiritual e Fraterno'] ?? null,
  };
};

const calcularMedias = (avaliacoes) => {
  const campos = ['clareza', 'instrutores', 'didatica', 'ambiente'];
  const totais = { clareza: 0, instrutores: 0, didatica: 0, ambiente: 0 };
  const contagens = { clareza: 0, instrutores: 0, didatica: 0, ambiente: 0 };

  avaliacoes.forEach((raw) => {
    const av = normalizeAvaliacao(raw);
    campos.forEach((campo) => {
      const nota = av[campo];
      if (typeof nota === 'number' && !isNaN(nota)) {
        totais[campo] += nota;
        contagens[campo] += 1;
      }
    });
  });

  const medias = {};
  campos.forEach((campo) => {
    medias[campo] =
      contagens[campo] > 0 ? totais[campo] / contagens[campo] : null;
  });
  return medias;
};

const renderEstrelas = (valor) => {
  if (valor === null || valor === undefined) {
    return <Text style={{ marginLeft: 6, fontSize: 12, color: '#666' }}>—</Text>;
  }
  const inteiro = Math.round(valor);
  return (
    <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= inteiro ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      ))}
      <Text style={{ marginLeft: 6, fontSize: 12 }}>
        {valor.toFixed(2)}
      </Text>
    </View>
  );
};

export default function AdminDashboardScreen({ navigation }) {
  const [agrupado, setAgrupado] = useState({});

  useEffect(() => {
    const agruparAvaliacoes = async () => {
      const todas = await carregarAvaliacoes();
      console.log('DEBUG: avaliações carregadas do storage:', todas);
      const avaliacoesRaw = Array.isArray(todas) ? todas : [];
      if (!Array.isArray(todas)) {
        console.warn(
          'AdminDashboardScreen: carregarAvaliacoes retornou não-array:',
          todas
        );
      }

      // Normaliza todas antes de agrupar (mantém original na estrutura)
      const avaliacoesNormalizadas = avaliacoesRaw.map(normalizeAvaliacao);

      const novoAgrupamento = agruparPorCursoSemestreAno(avaliacoesNormalizadas);
      setAgrupado(novoAgrupamento);
    };

    agruparAvaliacoes();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Painel de Avaliações</Text>

      {Object.entries(agrupado).map(([curso, periodos]) => (
        <View key={curso} style={styles.cursoGroup}>
          <Text style={styles.cursoTitle}>📘 {curso}</Text>

          {Object.entries(periodos).map(([periodo, avaliacoes]) => {
            const medias = calcularMedias(avaliacoes);
            return (
              <TouchableOpacity
                key={periodo}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('AdminAvaliacoes', {
                    titulo: `${periodo} - ${curso}`,
                    avaliacoes,
                  })
                }
              >
                <Text style={styles.periodo}>{periodo}</Text>
                <Text style={styles.qtd}>{avaliacoes.length} avaliações</Text>

                <View style={styles.mediasContainer}>
                  <Text style={styles.mediaLabel}>Médias</Text>
                  <View style={styles.mediaRow}>
                    <Text style={styles.mediaLabel}>Clareza:</Text>
                    {renderEstrelas(medias.clareza)}
                  </View>
                  <View style={styles.mediaRow}>
                    <Text style={styles.mediaLabel}>Instrutores:</Text>
                    {renderEstrelas(medias.instrutores)}
                  </View>
                  <View style={styles.mediaRow}>
                    <Text style={styles.mediaLabel}>Didática:</Text>
                    {renderEstrelas(medias.didatica)}
                  </View>
                  <View style={styles.mediaRow}>
                    <Text style={styles.mediaLabel}>Ambiente:</Text>
                    {renderEstrelas(medias.ambiente)}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  cursoGroup: {
    marginBottom: 24,
  },
  cursoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    padding:10,
    color: '#333',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  periodo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtd: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  mediasContainer: {
    marginTop: 8,
    gap: 6,
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  mediaLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
  },
});
