import { useEffect, useState } from "react";
import api from "../api"; // uses axios + token injection
import { useAuth } from "../context/AuthContext";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState("");
  const { user } = useAuth();

  // Fetch boards for the logged-in user
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/boards", { params: { userId: user.id } });
        setBoards(res.data);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    fetchBoards();
  }, []);

  // Create a new board
  const handleAddBoard = async () => {
    if (!newBoard.trim()) return;
    try {
      const res = await api.post("/boards", { name: newBoard });
      setBoards((prev) => [...prev, res.data]);
      setNewBoard("");
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{`${user.name}'s Boards`}</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newBoard}
          onChange={(e) => setNewBoard(e.target.value)}
          placeholder="New board name"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleAddBoard}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Board
        </button>
      </div>

      <ul className="space-y-2">
        {boards.map((b) => (
          <li key={b.id} className="p-2 border rounded">
            {b.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
