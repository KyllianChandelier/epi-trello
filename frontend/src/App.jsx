import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/ping").then(res => setMsg(res.data.message));
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-2xl font-bold">
      Backend says: {msg}
    </div>
  );
}

export default App;
