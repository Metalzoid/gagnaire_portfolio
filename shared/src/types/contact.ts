export type ContactRequestStatus = "pending" | "in_progress" | "done";

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
}
