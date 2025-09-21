export type TAuthActions =
  | 'create'
  | 'delete'
  | 'manage'
  | 'moderate'
  | 'read'
  | 'update';

export type TAuthSubjects = 'all' | 'Article' | 'Comment' | 'User';
