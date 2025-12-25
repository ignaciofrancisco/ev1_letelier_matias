export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  createdAt: number;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = SignInPayload & {
  name: string;
};
