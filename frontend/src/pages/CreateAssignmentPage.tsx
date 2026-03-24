import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createAssignment } from "../api/assignment";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";

export default function CreateAssignmentPage() {
  const { id } = useParams();
  const classId = Number(id);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // current datetime for min
  const now = new Date().toISOString().slice(0, 16);

  async function handleCreate() {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (dueDate && dueDate < now) {
      setError("Due date cannot be in the past");
      return;
    }

    try {
      await createAssignment(title, classId, dueDate || undefined);

      setSuccess("Assignment created successfully");

      setTimeout(() => {
        navigate(`/class/${classId}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-[#354254] mb-6">
          Create Assignment
        </h1>

        <div className="space-y-4">
          <Input
            placeholder="Assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* date + time */}
          <input
            type="datetime-local"
            value={dueDate}
            min={now}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-[#354254] p-2 rounded"
          />

          {error && <p className="text-red-600 font-medium">{error}</p>}

          {success && <p className="text-green-600 font-medium">{success}</p>}

          <Button onClick={handleCreate}>Create Assignment</Button>
        </div>
      </div>
    </div>
  );
}
