// screens/AdminDashboardScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { carregarAvaliacoes } from '../storage/storage';
import { agruparPorCursoAnoSemestreAno } from '../utils/agrupamento';
import { Ionicons } from '@expo/vector-icons';

const normalizeAvaliacao = (av) => ({
  ...av,
  ...(av.avaliacoes && typeof av.avaliacoes === 'object' ? av.avaliacoes : {}),
  ano: av.ano,
  ambiente: av.ambiente ?? av['Ambiente Espiritual e Fraterno'] ?? null,
});

const calcularMedias = (list) => {
  const campos = ['clareza', 'instrutores', 'didatica', 'ambiente'];
  const totais = { clareza: 0, instrutores: 0, didatica: 0, ambiente: 0 };
  const contagens = { clareza: 0, instrutores: 0, didatica: 0, ambiente: 0 };

  list.forEach((raw) => {
    const av = normalizeAvaliacao(raw);
    campos.forEach((c) => {
      if (typeof av[c] === 'number') {
        totais[c] += av[c];
        contagens[c]++;
      }
    });
  });

  return campos.reduce((acc, c) => {
    acc[c] = contagens[c] ? totais[c] / contagens[c] : null;
    return acc;
  }, {});
};

const renderEstrelas = (valor) => {
  if (valor == null) return <Text style={styles.empty}>—</Text>;
  const n = Math.round(valor);
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= n ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
          style={styles.starIcon}
        />
      ))}
      <Text style={styles.smallValue}>{valor.toFixed(2)}</Text>
    </View>
  );
};

export default function AdminDashboardScreen({ navigation }) {
  const [agrupado, setAgrupado] = React.useState({});

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const todas = await carregarAvaliacoes();
        const raw = Array.isArray(todas) ? todas : [];
        const norm = raw.map(normalizeAvaliacao);
        setAgrupado(agruparPorCursoAnoSemestreAno(norm));
      })();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Painel de Avaliações</Text>

      {Object.entries(agrupado).map(([curso, anos]) => (
        <View key={curso} style={styles.group}>
          <Text style={styles.groupTitle}>📘 {curso}</Text>

          {Object.entries(anos).map(([ano, periodos]) => (
            <View key={ano} style={styles.subgroup}>
              <Text style={styles.subTitle}>🏷️ {ano}</Text>

              {Object.entries(periodos).map(([periodo, lista]) => {
                const medias = calcularMedias(lista);
                return (
                  <TouchableOpacity
                    key={periodo}
                    style={styles.card}
                    onPress={() =>
                      navigation.navigate('AdminAvaliacoes', {
                        curso,
                        ano,                          // passamos o ano correto
                        titulo: `${periodo} • ${ano} • ${curso}`,
                        avaliacoes: lista,
                      })
                    }
                  >
                    <Text style={styles.periodo}>{periodo}</Text>
                    <Text style={styles.count}>
                      {lista.length}{' '}
                      {lista.length === 1 ? 'avaliação' : 'avaliações'}
                    </Text>

                    <View style={styles.mediaBox}>
                      <Text style={styles.mediaLabel}>Médias:</Text>
                      <View style={styles.mediaRow}>
                        <Text style={styles.mediaLabelSmall}>Clareza:</Text>
                        {renderEstrelas(medias.clareza)}
                      </View>
                      <View style={styles.mediaRow}>
                        <Text style={styles.mediaLabelSmall}>Instrutores:</Text>
                        {renderEstrelas(medias.instrutores)}
                      </View>
                      <View style={styles.mediaRow}>
                        <Text style={styles.mediaLabelSmall}>Didática:</Text>
                        {renderEstrelas(medias.didatica)}
                      </View>
                      <View style={styles.mediaRow}>
                        <Text style={styles.mediaLabelSmall}>Ambiente:</Text>
                        {renderEstrelas(medias.ambiente)}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  group: { marginBottom: 24 },
  groupTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, paddingLeft: 16 },
  subgroup: { marginLeft: 12, marginBottom: 16 },
  subTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  card: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 10 },
  periodo: { fontSize: 16, fontWeight: 'bold' },
  count: { fontSize: 14, color: '#666', marginVertical: 4 },
  mediaBox: { marginTop: 6 },
  mediaLabel: { fontWeight: '600', marginBottom: 4 },
  mediaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  mediaLabelSmall: { width: 80, fontSize: 14 },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  starIcon: { marginRight: 2 },
  smallValue: { marginLeft: 6, fontSize: 12 },
  empty: { fontSize: 12, color: '#666', marginLeft: 6 },
});
