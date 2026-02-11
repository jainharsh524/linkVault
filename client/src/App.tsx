import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import Vault from "./pages/Vault";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <main className="max-w-4xl mx-auto px-4 py-12">
                  <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                      Share Files & Text{" "}
                      <span className="text-indigo-600">Securely</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                      Paste text or upload files with automatic expiry and password protection.
                    </p>
                  </div>
                  <UploadSection />
                </main>
              }
            />

            <Route path="/vault/:id" element={<Vault />} />
          </Routes>
        </div>

        <footer className="py-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} LinkVault. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}
