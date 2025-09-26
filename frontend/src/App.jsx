import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState("");

  // Fetch all boards on load
  useEffect(() => {
    axios.get("http://localhost:3001/boards").then((res) => setBoards(res.data));
  }, []);

  // Create a new board
  const handleAddBoard = async () => {
    if (!newBoard.trim()) return;
    const res = await axios.post("http://localhost:3001/boards", { name: newBoard });
    setBoards([...boards, res.data]); // update state
    setNewBoard(""); // reset input
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Boards</h1>

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

export default App;
