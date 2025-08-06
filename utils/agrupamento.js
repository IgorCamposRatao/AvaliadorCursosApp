export function agruparPorCursoAnoSemestreAno(avs) {
  const out = {};
  avs.forEach((av) => {
    const anoCurso = av.ano; // ex: '1º Ano'
    const data = new Date(av.data);
    const ano = data.getFullYear();
    const sem = data.getMonth() < 6 ? '1º Semestre' : '2º Semestre';
    const per = `${ano} - ${sem}`;
    out[av.curso] = out[av.curso] || {};
    out[av.curso][anoCurso] = out[av.curso][anoCurso] || {};
    out[av.curso][anoCurso][per] = out[av.curso][anoCurso][per] || [];
    out[av.curso][anoCurso][per].push(av);
  });
  return out;
}
