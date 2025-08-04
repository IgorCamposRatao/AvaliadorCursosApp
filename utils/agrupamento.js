export function agruparPorCursoSemestreAno(avaliacoes) {
  const agrupado = {};

  avaliacoes.forEach((av) => {
    const data = new Date(av.data);
    const ano = data.getFullYear();
    const semestre = data.getMonth() < 6 ? '1º Semestre' : '2º Semestre';
    const periodo = `${ano} - ${semestre}`;
    const curso = av.curso;

    if (!agrupado[curso]) {
      agrupado[curso] = {};
    }

    if (!agrupado[curso][periodo]) {
      agrupado[curso][periodo] = [];
    }

    agrupado[curso][periodo].push(av);
  });

  return agrupado;
}
