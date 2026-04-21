export type Assignment = {
  id: number;
  title: string;
  due_date?: string;
  score?: number | null;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED";
  attempt_id?: number | null;
};