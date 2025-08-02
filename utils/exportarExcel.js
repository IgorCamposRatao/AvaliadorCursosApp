// utils/exportarExcel.js
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

export async function exportarAvaliacoesParaExcel(avaliacoes, nomeArquivo = 'avaliacoes.xlsx') {
  // Monta os dados
  const dados = avaliacoes.map((av, i) => ({
    '#': i + 1,
    Curso: av.curso,
    Data: new Date(av.data).toLocaleDateString(),
    Clareza: av.clareza,
    Instrutores: av.instrutores,
    Didatica: av.didatica,
    Ambiente: av.ambiente,
    Comentario: av.comentario || '',
    Identificacao: av.identificacao || 'Anônimo',
  }));

  // Cria a planilha
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dados);
  XLSX.utils.book_append_sheet(wb, ws, 'Avaliacoes');

  // Gera o arquivo como string binária
  const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  // Salva no dispositivo
  const caminho = FileSystem.cacheDirectory + nomeArquivo;
  await FileSystem.writeAsStringAsync(caminho, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Compartilhar (abrir para salvar/envio)
  await Sharing.shareAsync(caminho, {
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'Exportar avaliações',
    UTI: 'com.microsoft.excel.xlsx',
  });
}
