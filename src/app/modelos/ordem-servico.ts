export type StatusOrdemServico = 'aberta' | 'em_execucao' | 'finalizada' | 'cancelada';

export interface ServicoExecutado {
  descricao: string;
  valor: number;
  tempoExecucaoHoras: number;
}

export interface PecaAplicada {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface OrdemServico {
  id: number;
  clienteId: number;
  veiculoId: number;
  usuarioResponsavelId: number;
  mecanicoResponsavelId: number;
  dataAbertura: string;
  status: StatusOrdemServico;
  descricaoProblema: string;
  servicosExecutados: ServicoExecutado[];
  pecasAplicadas: PecaAplicada[];
}
