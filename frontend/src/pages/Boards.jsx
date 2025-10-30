import { useEffect, useState } from "react";
import api from "../api"; // uses axios + token injection
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardData, setBoardData] = useState({ name: "", description: "", members: []});
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
  const handleCreateBoard = async () => {
    if (!boardData.name.trim()) return;
    try {
      const res = await api.post("http://localhost:3001/boards", {
        ...boardData,
        ownerId: user.id,
      });
      setBoards([...boards, res.data]);
      setIsModalOpen(false);
      setBoardData({ name: "", description: "", members: [] });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{`${user.name}'s Boards`}</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Board
        </button>
      </div>

       {/* Modal for new board */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Board"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Board Name</label>
            <input
              type="text"
              value={boardData.name}
              onChange={(e) =>
                setBoardData({ ...boardData, name: e.target.value })
              }
              className="w-full border rounded p-2"
              placeholder="Enter board name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              value={boardData.description}
              onChange={(e) =>
                setBoardData({ ...boardData, description: e.target.value })
              }
              className="w-full border rounded p-2"
              placeholder="Describe your board..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Members (comma-separated emails)
            </label>
            <input
              type="text"
              value={boardData.members.join(", ")}
              onChange={(e) =>
                setBoardData({
                  ...boardData,
                  members: e.target.value.split(",").map((email) => email.trim()),
                })
              }
              className="w-full border rounded p-2"
              placeholder="Enter member emails"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateBoard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

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
