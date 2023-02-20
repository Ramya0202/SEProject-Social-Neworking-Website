import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Authentication, Dashboard } from "./pages";

function App() {
  const token = useSelector((state) => state.authReducer.data);
  return (
    <div
      className="App"
      style={{
        height: "auto",
      }}
    >
      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/home"
          element={token ? <Dashboard /> : <Navigate to="../auth" />}
        />
        <Route
          path="/auth"
          element={token ? <Navigate to="../home" /> : <Authentication />}
        />
      </Routes>
    </div>
  );
}

export default App;
