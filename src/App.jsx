// src/App.jsx
import Rope from "./components/Rope.jsx";

export default function App() {
  return (
    <div
      className="
        w-screen min-h-screen bg-gradient-to-b from-blue-200 to-blue-400
        flex justify-center items-start relative overflow-auto
        px-10
        pt-10 md:pt-20 lg:pt-32
      "
    >
      <Rope />
    </div>
  );
}
