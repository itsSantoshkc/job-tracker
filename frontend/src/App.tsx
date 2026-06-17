import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ApplicationList from "./pages/ApplicationList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ApplicationList />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
