import "./App.css";
import Banner from "./components/Banner/Banner";
import TodoPage from "./pages/TodoPage/TodoPage";
import FollowersPage from "./pages/FollowersPage/FollowersPage";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Banner />
            <Routes>
                <Route path="/" element={<TodoPage />} />
                <Route path="/followers" element={<FollowersPage />} />
            </Routes>
        </div>
    );
}

export default App;
