export default function ListColumn({ list }) {
  return (
    <div className="bg-white rounded-lg shadow p-3 w-72 flex-shrink-0">
      <h3 className="font-semibold text-gray-800 mb-2">{list.title}</h3>

      <div className="space-y-2">
        <div className="bg-gray-50 border rounded p-2 text-sm text-gray-600">
          Example card
        </div>
        <div className="bg-gray-50 border rounded p-2 text-sm text-gray-600">
          Another card
        </div>
      </div>
    </div>
  );
}
