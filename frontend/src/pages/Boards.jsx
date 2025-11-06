import { useEffect, useState } from "react";
import api from "../api"; // uses axios + token injection
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import {EllipsisVerticalIcon} from "@heroicons/react/24/solid";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardData, setBoardData] = useState({ name: "", description: "", members: []});
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
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
      
      const newBoards = await api.get("/boards", { params: { userId: user.id } });
      setBoards(newBoards.data);
      setIsModalOpen(false);
      setBoardData({ name: "", description: "", members: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (board) => {
    setBoardToDelete(board);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/boards/${boardToDelete.id}`);
      setBoards(boards.filter((b) => b.id !== boardToDelete.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete board");
    } finally {
      setConfirmOpen(false);
      setBoardToDelete(null);
    }
  };
  
  const openBoard = (id) => {
    window.location.href = `/board/${id}`;
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

      {/* Boards list */}
      <ul className="space-y-2">
        {boards.map((b) => (
          <div
            key={b.id}
            className="relative bg-white rounded-lg shadow p-4 border hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold">{b.name}</h2>

              {/* Only admins see menu */}
              {b.role === "admin" && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === b.id ? null : b.id)
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>

                  {openMenu === b.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          alert("Modify feature coming soon!");
                          setOpenMenu(null);
                        }}
                      >
                        Modify
                      </button>
                      <button
                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 text-sm"
                        onClick={() => {
                          setOpenMenu(null);
                          handleDeleteClick(b);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {b.description || "No description"}
            </p>

            <span
              className={`mt-3 inline-block text-xs px-2 py-1 rounded ${
                b.role === "admin"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {b.role}
            </span>
            <button
            onClick={() => openBoard(b.id)}
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 shadow transition"
            title="Open board"
            >
            Open
          </button>
          </div>
        ))}
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Board"
        message={
          boardToDelete
            ? `Are you sure you want to delete "${boardToDelete.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      </ul>
    </div>
  );
}
