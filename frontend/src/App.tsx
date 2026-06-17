import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ApplicationList from "./pages/ApplicationList";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<ApplicationList />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
