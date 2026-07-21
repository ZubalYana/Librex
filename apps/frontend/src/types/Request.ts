import type { Book } from "./Book";
export type SentRequest = {
  id: string;
  createdAt: string | Date; 
  requestedBookId: string;
  requesterId: string;
  requestedBook?: Book; 
}