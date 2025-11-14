export default function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg w-72 flex-shrink-0 flex items-center justify-center text-gray-500 text-lg font-medium"
    >
      + {label}
    </button>
  );
}
