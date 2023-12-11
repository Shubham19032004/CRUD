import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Form from "./Form.jsx";
import Data from "./Data.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Home() {
  return (
    <BrowserRouter>
      <nav className="Nav">
        <ul>
          <li>
            <Link to="/Form">Form</Link>
          </li>

          <li>
            <Link to="/Data">Data</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/Data" element={<Data />} />
        <Route path="/:Form" element={<Form />} />
        <Route path="/" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}
