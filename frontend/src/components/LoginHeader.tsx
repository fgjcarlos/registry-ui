import React from 'react';

const LoginHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-primary/10 rounded-lg">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-base-content">Registry Login</h2>
        <p className="text-sm text-base-content/60">Enter your credentials to continue</p>
      </div>
    </div>
  );
};

export default React.memo(LoginHeader);
