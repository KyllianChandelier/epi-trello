import { ChevronDownIcon, UserIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BoardHeader({
  board,
  showMembers,
  setShowMembers,
  onBack,
}) {
  return (
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

        {/* Members Dropdown */}
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

        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </button>
      </div>
    </header>
  );
}
