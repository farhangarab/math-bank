import type { AttemptStatus } from "./attempt";

export type Assignment = {
  id: number;
  title: string;
  class_id: number;
  due_date?: string;
  score?: number | null;
  max_score?: number | string;
  status?: AttemptStatus;
  attempt_id?: number | null;
};
