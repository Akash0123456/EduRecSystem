import React from 'react';
import { Header } from '../../components/Header';

export const Settings = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-gray-900 min-h-screen">
      <Header />
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-[69px]">
        <div className="max-w-4xl mx-auto w-full p-6">
          <h1 className="text-3xl font-bold text-gray-100 mb-6">Settings</h1>
          
          <div className="bg-[#1f293780] border border-gray-700 rounded-lg p-6 mb-6">
            <p className="text-gray-300 mb-4">
              Currently being worked on.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
