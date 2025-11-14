import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

import BoardHeader from "../components/Board/BoardHeader";
import ListColumn from "../components/Board/ListColumn";
import AddButton from "../components/Board/AddButton";

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
        navigate("/boards");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!board) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <BoardHeader
        board={board}
        showMembers={showMembers}
        setShowMembers={setShowMembers}
        onBack={() => navigate("/boards")}
      />

      <main className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-w-max">
          {board.lists.map((list) => (
            <ListColumn key={list.id} list={list} />
          ))}

          {board.role === "admin" && (
            <AddButton label="Add New List" onClick={() => setShowAddList(true)} />
          )}
        </div>
      </main>

      {/* Modal */}
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
                className="px-3 py-2 bg-gray-100 rounded"
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={async () => {
                  try {
                    const res = await api.post(`/boards/${board.id}/lists`, {
                      name: newListName.trim(),
                    });

                    setBoard({
                      ...board,
                      lists: [...board.lists, res.data],
                    });

                    setShowAddList(false);
                    setNewListName("");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to create list");
                  }
                }}
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
