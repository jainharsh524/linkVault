import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import Vault from "./pages/vault";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F5F3ED] flex flex-col text-[#000000]">
        <Header />

        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <main className="max-w-4xl mx-auto px-4 py-16">
                  <div className="text-center mb-14">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">
                      Share Files & Text{" "}
                      <span className="text-[#5A5A5A]">Securely</span>
                    </h1>
                    <p className="text-lg text-[#5A5A5A]">
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

        <footer className="py-10 text-center text-[#5A5A5A] text-sm border-t border-[#BEB8A8]">
          &copy; {new Date().getFullYear()} LinkVault. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}
