export interface Usuario {
  id: string;
  nome: string;
  login: string;
  email: string;
  perfil: 'administrativo' | 'atendente' | 'gestor';
}
