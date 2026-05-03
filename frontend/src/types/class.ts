export type ClassInfo = {
  id: number;
  class_id?: number;
  class_name: string;
  class_code?: string;
  teacher_id?: number;
  professor_name?: string;
  students_count?: number;
  assignments_count?: number;
  created_at?: string | null;
};

export type ClassStudent = {
  class_member_id: number;
  student_id: number;
  student_name: string;
  email: string;
  joined_on: string | null;
};

export type ClassStudentsResponse = {
  class_id: number;
  class_name: string;
  students: ClassStudent[];
};
