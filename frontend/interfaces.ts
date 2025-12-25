export interface IUser {
  id: string | undefined;
  name: string;
}

export interface IResRoom {
  success: boolean;
  roomId?: string;
  error?: string;
  action?: number;
}

export interface IRoomUser {
  name: string;
}

export interface IRoom {
  roomId: string;
  host: string;
  users: IRoomUser[];
  cards: string[];
  revealed: boolean;
  estimations: { name: string; vote: string }[];
  resultCard: [string, number][];
  canVote: boolean;
}