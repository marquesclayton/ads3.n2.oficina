export interface Usuario {
  id: number;
  nome: string;
  login: string;
  email: string;
  perfil: 'administrativo' | 'atendente' | 'gestor';
}
