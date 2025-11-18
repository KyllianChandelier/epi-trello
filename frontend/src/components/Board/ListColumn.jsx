import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

import { useState, useRef, useEffect } from "react";
import api from "../../api";
// import CardItem from "./CardItem";

export default function ListColumn({ list, board, refreshBoard }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameMode, setRenameMode] = useState(false);
  const [title, setTitle] = useState(list.title);

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // Close menu & rename mode when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (
        renameMode &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        cancelRename();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [renameMode]);

  // Auto-focus rename input
  useEffect(() => {
    if (renameMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renameMode]);

  const saveRename = async () => {
    if (!title.trim()) return cancelRename();
    try {
      await api.patch(`/lists/${list.id}`, { title });
      setRenameMode(false);
      refreshBoard();
    } catch (err) {
      console.error(err);
      alert("Failed to rename list");
    }
  };

  const cancelRename = () => {
    setTitle(list.title);
    setRenameMode(false);
  };

  const moveList = async (direction) => {
    try {
      await api.patch(`/lists/${list.id}/move`, { direction });
      refreshBoard();
    } catch (err) {
      console.error(err);
      alert("Failed to move list");
    }
  };

  const deleteList = async () => {
    try {
      await api.delete(`/lists/${list.id}`);
      refreshBoard();
    } catch (err) {
      console.error(err);
      alert("Failed to delete list");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 w-72 flex-shrink-0 relative">

      {/* Header */}
      <div className="flex justify-between items-start">

        {renameMode ? (
          <input
            ref={inputRef}
            className="border w-full rounded px-2 py-1 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRename();
              if (e.key === "Escape") cancelRename();
            }}
            onBlur={saveRename}
          />
        ) : (
          <h3 className="font-semibold text-gray-800 text-sm">{list.title}</h3>
        )}

        {board.role === "admin" && (
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {menuOpen && board.role === "admin" && (
        <div
          ref={menuRef}
          className="absolute right-2 top-10 w-40 bg-white border rounded shadow-lg z-10"
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              setRenameMode(true);
            }}
            className="flex gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
          >
            <PencilIcon className="h-4 w-4" /> Rename
          </button>

          <button
            onClick={() => moveList("left")}
            className="flex gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Move Left
          </button>

          <button
            onClick={() => moveList("right")}
            className="flex gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
          >
            <ArrowRightIcon className="h-4 w-4" /> Move Right
          </button>

          <button
            onClick={deleteList}
            className="flex gap-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 text-sm"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </button>
        </div>
      )}

      {/* Cards */}
      <div className="mt-3 space-y-2">
        {list.cards.map((card) => (
          <div
            key={card.id}
            className="bg-gray-50 border rounded p-2 text-sm text-gray-800"
          >
            {card.title}
          </div>
        ))}

        {/* Add card */}
        <button
          className="text-left text-sm text-gray-500 hover:text-gray-700 w-full mt-2"
          onClick={async () => {
            const title = prompt("Card title:");
            if (!title || !title.trim()) return;

            await api.post(`/lists/${list.id}/cards`, { title });
            refreshBoard();
          }}
        >
          + Add card
        </button>
      </div>
    </div>
  );
}
