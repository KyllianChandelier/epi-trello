import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");


  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await api.get(`/boards/${id}`);
        setBoard(res.data);
      } catch (err) {
        console.error(err);
        alert("Could not load board");
        navigate("/boards");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id, navigate]);

  if (loading) return <div className="p-6 text-gray-500">Loading board...</div>;
  if (!board) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-800">{board.name}</h1>
          {board.description && (
            <p className="text-gray-500 text-sm">{board.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              board.role === "admin"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {board.role}
          </span>

          {/* Members dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition"
            >
              <UserIcon className="h-4 w-4" />
              <span>Members</span>
              <ChevronDownIcon
                className={`h-4 w-4 transform transition-transform ${
                  showMembers ? "rotate-180" : ""
                }`}
              />
            </button>

            {showMembers && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-56 p-2 z-20">
                {board.members.map((m) => (
                  <div
                    key={m.user.id}
                    className="flex justify-between items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <span>{m.user.name || m.user.email}</span>
                    {m.role === "admin" && (
                      <span className="text-xs text-blue-600 font-medium">
                        admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/boards")}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
        </div>
      </header>

      {/* Board body */}
      <main className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-w-max">
            {/* Render existing lists */}
            {board.lists.length > 0 ? (
            board.lists.map((list) => (
                <div
                key={list.id}
                className="bg-white rounded-lg shadow p-3 w-72 flex-shrink-0"
                >
                <h3 className="font-semibold text-gray-800 mb-2">{list.name}</h3>

                <div className="space-y-2">
                    {/* Placeholder for cards */}
                    <div className="bg-gray-50 border rounded p-2 text-sm text-gray-600">
                    Example card
                    </div>
                    <div className="bg-gray-50 border rounded p-2 text-sm text-gray-600">
                    Another card
                    </div>
                </div>
                </div>
            ))
            ) : (
            <p className="text-gray-500 italic self-center mt-10">
                No lists yet.
            </p>
            )}

            {/* Add List button — always visible for admins */}
            {board.role === "admin" && (
            <button
                onClick={() => setShowAddList(true)}
                className="bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg w-72 flex-shrink-0 flex items-center justify-center text-gray-500 text-lg font-medium"
            >
                + Add New List
            </button>
            )}
        </div>
        </main>

        {/* Add List Modal */}
        {showAddList && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Create New List</h2>

            <input
                type="text"
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
                <button
                onClick={() => setShowAddList(false)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                Cancel
                </button>
                <button
                onClick={async () => {
                    if (!newListName.trim()) return;
                    try {
                    const res = await axios.post(
                        `http://localhost:3001/boards/${id}/lists`,
                        { name: newListName },
                        {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        }
                    );
                    setBoard({
                        ...board,
                        lists: [...board.lists, res.data],
                    });
                    setNewListName("");
                    setShowAddList(false);
                    } catch (err) {
                    console.error(err);
                    alert("Failed to create list");
                    }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                Create
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
}
