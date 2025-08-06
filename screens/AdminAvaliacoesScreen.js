// screens/AdminAvaliacoesScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { useFocusEffect } from '@react-navigation/native';
import { exportarAvaliacoesParaExcel } from '../utils/exportarExcel';
import { carregarAvaliacoes } from '../storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

// Funções estatísticas para análise rápida
const calcMedia = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};
const calcMediana = (arr) => {
  if (!arr || arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};
const calcModa = (arr) => {
  if (!arr || arr.length === 0) return null;
  const freq = {};
  arr.forEach((v) => {
    freq[v] = (freq[v] || 0) + 1;
  });
  const modaEntry = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  return Number(modaEntry[0]);
};
const calcDesvioPadrao = (arr) => {
  if (!arr || arr.length === 0) return null;
  const media = calcMedia(arr);
  const variancia = arr.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / arr.length;
  return Math.sqrt(variancia);
};
const pearson = (x, y) => {
  if (!x || !y || x.length === 0 || y.length === 0 || x.length !== y.length)
    return null;
  const mx = calcMedia(x);
  const my = calcMedia(y);
  const num = x.map((xi, i) => (xi - mx) * (y[i] - my)).reduce((a, b) => a + b, 0);
  const den = Math.sqrt(
    x.map((xi) => Math.pow(xi - mx, 2)).reduce((a, b) => a + b, 0) *
      y.map((yi) => Math.pow(yi - my, 2)).reduce((a, b) => a + b, 0)
  );
  return den === 0 ? null : num / den;
};

const screenWidth = Dimensions.get('window').width - 32;

function ResumoGrafico({ resultado, onVoltarTopo }) {
  const { estatisticas, correlacoes, temas, interpretacoes } = resultado;
  const campos = ['clareza', 'instrutores', 'didatica', 'ambiente'];

  const barraFrequencia = (campo) => {
    const freq = (estatisticas[campo] && estatisticas[campo].frequencias) || {};
    const labels = ['1', '2', '3', '4', '5'];
    const data = labels.map((l) => freq[l] || 0);
    return { labels, datasets: [{ data }] };
  };

  const resumoPosicao = (campo) => {
    const e = estatisticas[campo] || {};
    return `Média: ${e.media?.toFixed(2) ?? '—'}  Mediana: ${
      e.mediana ?? '—'
    }  Moda: ${e.moda ?? '—'}`;
  };

  const correlacoesFortes = Object.entries(correlacoes || {}).filter(
    ([, val]) => val !== null && Math.abs(val) >= 0.6
  );

  return (
    <View style={styles.summaryContainer}>
      {/* Guia rápido */}
      <Text style={styles.sectionTitle}>Guia rápido para leigos</Text>
      <View style={styles.guideRow}>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>Média</Text>
          <Text style={styles.guideText}>A nota média; indica desempenho geral.</Text>
        </View>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>Mediana</Text>
          <Text style={styles.guideText}>Nota do meio; mostra divisão de opiniões.</Text>
        </View>
      </View>
      <View style={styles.guideRow}>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>Moda</Text>
          <Text style={styles.guideText}>Nota mais frequente.</Text>
        </View>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>Dispersão</Text>
          <Text style={styles.guideText}>Variedade nas respostas.</Text>
        </View>
      </View>

      {/* Insights */}
      <Text style={styles.sectionTitle}>Insights principais</Text>
      {interpretacoes && interpretacoes.length > 0 ? (
        interpretacoes.map((t, i) => (
          <Text key={i} style={styles.smallText}>{t}</Text>
        ))
      ) : (
        <Text style={styles.smallText}>Nenhum insight automático identificado.</Text>
      )}

      {/* Gráficos de distribuição */}
      <Text style={styles.sectionTitle}>Distribuição de notas</Text>
      {campos.map((dim) => (
        <View key={dim} style={[styles.card, styles.chartCard]}>
          <Text style={styles.cardTitle}>{dim[0].toUpperCase() + dim.slice(1)}</Text>
          <Text style={styles.smallText}>{resumoPosicao(dim)}</Text>
          <BarChart
            data={barraFrequencia(dim)}
            width={screenWidth}
            height={160}
            fromZero
            showValuesOnTopOfBars
            withInnerLines={false}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: () => '#4CAF50',
              labelColor: () => '#333',
              style: { borderRadius: 8 },
            }}
            style={{ marginTop: 8, borderRadius: 8 }}
          />
          <View style={styles.postChartSpacer} />
        </View>
      ))}

      {/* Correlações */}
      <Text style={styles.sectionTitle}>Correlação entre dimensões</Text>
      {correlacoesFortes.length > 0 ? (
        correlacoesFortes.map(([par, val]) => (
          <Text key={par} style={styles.smallText}>
            {par}: {val.toFixed(2)}{' '}
            {Math.abs(val) >= 0.8 ? '(muito forte)' : '(moderada)'}
          </Text>
        ))
      ) : (
        <Text style={styles.smallText}>Nenhuma correlação forte detectada.</Text>
      )}

      {/* Temas */}
      <Text style={styles.sectionTitle}>Temas nos comentários</Text>
      {temas && Object.keys(temas).length > 0 ? (
        Object.entries(temas).map(([tema, qtd]) => (
          <Text key={tema} style={styles.smallText}>• {tema}: {qtd} menções</Text>
        ))
      ) : (
        <Text style={styles.smallText}>Nenhum tema recorrente identificado.</Text>
      )}

      {/* Botão voltar ao topo da análise */}
      <TouchableOpacity style={styles.voltarTopo} onPress={onVoltarTopo}>
        <Text style={styles.voltarTopoText}>⬆️ Voltar ao topo</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AdminAvaliacoesScreen({ route }) {
  const { titulo, avaliacoes } = route.params || {};
  const scrollRef = React.useRef(null);
  const analiseRef = React.useRef(null);
  const [avaliacoesLocal, setAvaliacoesLocal] = React.useState([]);
  const [selecionados, setSelecionados] = React.useState([]);
  const [selecionarTodos, setSelecionarTodos] = React.useState(false);
  const [resultadoAnalise, setResultadoAnalise] = React.useState(null);
  const [analiseVisivelTopo, setAnaliseVisivelTopo] = React.useState(false);

  const normalizeItem = (av) => {
    const base = av.avaliacoes && typeof av.avaliacoes === 'object' ? { ...av, ...av.avaliacoes } : { ...av };
    return {
      ...base,
      ambiente: base.ambiente ?? base['Ambiente Espiritual e Fraterno'] ?? null,
      comentario: av.comentario || '',
      identificacao: av.identificacao || 'Anônimo',
      data: av.data,
    };
  };

  const initialListFromParams = React.useMemo(() => {
    if (!Array.isArray(avaliacoes)) {
      console.warn('AdminAvaliacoesScreen: esperava array em "avaliacoes"');
      return [];
    }
    return avaliacoes.map(normalizeItem);
  }, [avaliacoes]);

useFocusEffect(
  React.useCallback(() => {
    setAvaliacoesLocal(initialListFromParams);
    setSelecionados([]);
    setSelecionarTodos(false);
  }, [initialListFromParams])
);


  React.useEffect(() => {
    setAvaliacoesLocal(initialListFromParams);
    setSelecionados([]);
    setSelecionarTodos(false);
  }, [initialListFromParams]);

  const toggleSelecionado = (index) => {
    setSelecionados((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
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
          // 1) Guarda os dados originais no AsyncStorage sem recriar tudo
          const todasOriginais = await carregarAvaliacoes(); 
          const datasParaRemover = selecionados.map(i => avaliacoesLocal[i].data);
          const filtradasOriginais = todasOriginais.filter(av => !datasParaRemover.includes(av.data));
          await AsyncStorage.setItem('avaliacoes', JSON.stringify(filtradasOriginais));

          // 2) Atualiza ÚNICA E APENAS a lista que já está na tela
          const novasLocais = avaliacoesLocal.filter((_, i) => !selecionados.includes(i));
          setAvaliacoesLocal(novasLocais);

          // 3) Reseta seleção
          setSelecionados([]);
          setSelecionarTodos(false);
        },
      },
    ]
  );
};

  const analisarDados = () => {
    const campos = ['clareza', 'instrutores', 'didatica', 'ambiente'];
    const notasPorCampo = { clareza: [], instrutores: [], didatica: [], ambiente: [] };
    const contagens = { clareza: {}, instrutores: {}, didatica: {}, ambiente: {} };
    const comentariosArr = [];

    avaliacoesLocal.forEach((av) => {
      campos.forEach((campo) => {
        const nota = av[campo];
        if (typeof nota === 'number' && !isNaN(nota)) {
          notasPorCampo[campo].push(nota);
          contagens[campo][nota] = (contagens[campo][nota] || 0) + 1;
        }
      });
      if (av.comentario) comentariosArr.push(av.comentario.toLowerCase());
    });

    const estatisticas = {};
    campos.forEach((campo) => {
      const arr = notasPorCampo[campo];
      estatisticas[campo] = {
        media: calcMedia(arr),
        mediana: calcMediana(arr),
        moda: calcModa(arr),
        desvioPadrao: calcDesvioPadrao(arr),
        frequencias: contagens[campo],
        total: arr.length,
      };
    });

    const correlacoes = {
      'clareza↔didatica': pearson(notasPorCampo.clareza, notasPorCampo.didatica),
      'clareza↔instrutores': pearson(notasPorCampo.clareza, notasPorCampo.instrutores),
      'clareza↔ambiente': pearson(notasPorCampo.clareza, notasPorCampo.ambiente),
      'didatica↔instrutores': pearson(notasPorCampo.didatica, notasPorCampo.instrutores),
      'didatica↔ambiente': pearson(notasPorCampo.didatica, notasPorCampo.ambiente),
      'instrutores↔ambiente': pearson(notasPorCampo.instrutores, notasPorCampo.ambiente),
    };

    const temasRegex = {
      exemplos: /exemplo/i,
      acolhimento: /acolhido|acolhimento/i,
      claro: /\bclaro\b/i,
      confuso: /\bconfuso\b/i,
      ritmo: /\britmo\b/i,
    };
    const contagemTemas = {};
    comentariosArr.forEach((texto) => {
      Object.entries(temasRegex).forEach(([tema, regex]) => {
        if (regex.test(texto)) contagemTemas[tema] = (contagemTemas[tema] || 0) + 1;
      });
    });

    const interpretacoes = [];
    Object.entries(estatisticas).forEach(([campo, stats]) => {
      const { media, desvioPadrao } = stats;
      if (media !== null) {
        if (media >= 4.5) interpretacoes.push(`✅ Ponto forte: ${campo} bem avaliado (média ${media.toFixed(2)}).`);
        else if (media <= 2.5) interpretacoes.push(`⚠️ Atenção: ${campo} com avaliação baixa (média ${media.toFixed(2)}).`);
        if (desvioPadrao !== null && desvioPadrao > 1.2) interpretacoes.push(`⚠️ Variabilidade alta em ${campo} (opiniões divergentes).`);
      }
    });

    if (correlacoes['clareza↔didatica'] > 0.7) interpretacoes.push('✅ Insight: clareza e didática andam juntas.');

    return { estatisticas, correlacoes, temas: contagemTemas, interpretacoes };
  };

  const handleAnalise = () => {
    const r = analisarDados();
    setResultadoAnalise(r);
    setAnaliseVisivelTopo(true);
    setTimeout(() => {
      if (analiseRef.current && scrollRef.current) {
        analiseRef.current.measureLayout(
          scrollRef.current,
          (x, y) => scrollRef.current.scrollTo({ y: y - 8, animated: true }),
          () => {}
        );
      }
    }, 150);
  };

  const handleVoltarTopoAnalise = () => {
    if (scrollRef.current) scrollRef.current.scrollTo({ y: 0, animated: true });
    setAnaliseVisivelTopo(false);
  };

  const exportar = () => {
    const selecionadas = selecionados.length > 0 ? selecionados.map(i => avaliacoesLocal[i]) : avaliacoesLocal;
    exportarAvaliacoesParaExcel(selecionadas);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.title}>{titulo}</Text>

      {resultadoAnalise && analiseVisivelTopo && (
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.smallButton} onPress={exportar}>
            <Text style={styles.buttonText}>Exportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={handleAnalise}>
            <Text style={styles.buttonText}>Reanalisar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallButton, styles.deleteButton]} onPress={excluirSelecionados}>
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.selectAllContainer}>
        <CheckBox value={selecionarTodos} onValueChange={toggleSelecionarTodos} />
        <Text style={styles.selectAllText}>Selecionar Todos</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollRef}
        showsVerticalScrollIndicator
      >
        {avaliacoesLocal.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
            Nenhuma avaliação disponível para exibir.
          </Text>
        )}
        {avaliacoesLocal.map((av, index) => (
          <View key={`${av.curso}-${av.data}-${av.identificacao}`} style={styles.card}>
            <View style={styles.cardHeader}>
              <CheckBox
                value={selecionados.includes(index)}
                onValueChange={() => toggleSelecionado(index)}
              />
              <Text style={styles.curso}>{av.curso}</Text>
            </View>

            <Text style={styles.nota}>📝 Clareza: {av.clareza ?? '—'}</Text>
            <Text style={styles.nota}>🎓 Instrutores: {av.instrutores ?? '—'}</Text>
            <Text style={styles.nota}>💬 Didática: {av.didatica ?? '—'}</Text>
            <Text style={styles.nota}>🌿 Ambiente: {av.ambiente ?? '—'}</Text>
            <Text style={styles.comentario}>💡 Comentário: {av.comentario || '—'}</Text>
            <Text style={styles.ident}>👤 Identificação: {av.identificacao}</Text>
            <Text style={styles.data}>📅 {av.data && new Date(av.data).toLocaleDateString()}</Text>
          </View>
        ))}

        {resultadoAnalise && (
          <View ref={analiseRef} collapsable={false}>
            <ResumoGrafico resultado={resultadoAnalise} onVoltarTopo={handleVoltarTopoAnalise} />
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {!analiseVisivelTopo && (
        <View style={styles.footerFixed}>
          <TouchableOpacity style={styles.button} onPress={exportar}>
            <Text style={styles.buttonText}>Exportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAnalise}>
            <Text style={styles.buttonText}>Analisar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={excluirSelecionados}>
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 180 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, paddingTop:60, textAlign: 'center' },
  selectAllContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginBottom: 8 },
  selectAllText: { fontSize: 16, marginLeft: 8 },
  card: { backgroundColor: '#f9f9f9', padding: 16, marginBottom: 16, borderRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  curso: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  nota: { fontSize: 16, marginVertical: 2 },
  comentario: { fontSize: 15, marginTop: 8, fontStyle: 'italic' },
  ident: { fontSize: 14, marginTop: 4, color: '#444' },
  data: { fontSize: 12, color: '#888', marginTop: 4 },
  footerFixed: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', padding: 15, paddingBottom:50, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ccc', justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#f44336' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  summaryContainer: { backgroundColor: '#fff', paddingTop: 12, paddingBottom: 32, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
  chartCard: { paddingBottom: 12 },
  postChartSpacer: { height: 8 },
  guideRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  guideBox: { flex: 1, backgroundColor: '#f0f8ff', padding: 8, borderRadius: 6, marginRight: 6 },
  guideTitle: { fontWeight: '600' },
  guideText: { fontSize: 12, marginTop: 2 },
  voltarTopo: { marginTop: 16, alignSelf: 'center', backgroundColor: '#2196F3', padding: 10, borderRadius: 6 },
  voltarTopoText: { color: '#fff', fontWeight: '600' },
  topHeader: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f0f0f0', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#ccc' },
  smallButton: { backgroundColor: '#4CAF50', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 6, flex: 1, marginHorizontal: 4, alignItems: 'center' },
});