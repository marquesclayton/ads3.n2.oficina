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
  id: string;
  clienteId: string;
  veiculoId: string;
  usuarioResponsavelId: string;
  mecanicoResponsavelId: string;
  dataAbertura: string;
  status: StatusOrdemServico;
  descricaoProblema: string;
  servicosExecutados: ServicoExecutado[];
  pecasAplicadas: PecaAplicada[];
}
