import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-[#BEB8A8] bg-[#F5F3ED]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <a href="http://localhost:3000/" className="flex items-center gap-3 group">
              
              <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center shadow-md transition-colors group-hover:bg-[#5A5A5A]">
                <svg
                  className="w-5 h-5 text-[#DDD4BC]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <span className="text-xl font-semibold tracking-tight text-[#000000]">
                LinkVault
              </span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="http://localhost:3000/"
              className="text-[#5A5A5A] hover:text-[#000000] font-medium transition-colors"
            >
              New Link
            </a>

            <a
              href="https://github.com/jainharsh524/linkVault/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A5A5A] hover:text-[#000000] font-medium transition-colors"
            >
              Github
            </a>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;
