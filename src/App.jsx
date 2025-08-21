// src/App.jsx
import Rope from "./components/Rope.jsx";

export default function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex justify-center items-start p-10 relative overflow-hidden">
      <Rope />
    </div>
  );
}