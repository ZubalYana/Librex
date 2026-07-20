type Owner = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};

export type Book = {
  id: string;
  name: string;
  description: string;
  photoUrl: string | null;
  author: string;
  owner: Owner;
};