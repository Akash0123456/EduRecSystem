import React from 'react';
import { Header } from '../../components/Header';

export const About = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-gray-900 min-h-screen">
      <Header />
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-[69px]">
        <div className="max-w-4xl mx-auto w-full p-6">
          <h1 className="text-3xl font-bold text-gray-100 mb-6">About EduRec</h1>
          
          <div className="bg-[#1f293780] border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              EduRec is an AI-powered educational assistant designed exclusively for academic purposes. 
              Our mission is to provide students and educators with reliable, well-sourced information 
              that enhances the learning experience.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-100 mt-6 mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#111827] p-4 rounded-lg">
                <h3 className="text-cyan-400 font-medium mb-2">Educational Focus</h3>
                <p className="text-gray-300 text-sm">Strictly designed for academic and learning purposes</p>
              </div>
              <div className="bg-[#111827] p-4 rounded-lg">
                <h3 className="text-cyan-400 font-medium mb-2">Credible Sources</h3>
                <p className="text-gray-300 text-sm">Every response includes references to academic sources</p>
              </div>
              <div className="bg-[#111827] p-4 rounded-lg">
                <h3 className="text-cyan-400 font-medium mb-2">Analysis Methodology</h3>
                <p className="text-gray-300 text-sm">Transparent explanation of how answers are formulated</p>
              </div>
              <div className="bg-[#111827] p-4 rounded-lg">
                <h3 className="text-cyan-400 font-medium mb-2">User-Friendly Interface</h3>
                <p className="text-gray-300 text-sm">Clean, modern UI with dark theme for comfortable reading</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-100 mt-6 mb-4">How It Works</h2>
            <div className="flex flex-col space-y-4 mb-4">
              <div className="flex items-start">
                <div className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                <p className="text-gray-300">Ask any educational question in the chat interface</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                <p className="text-gray-300">EduRec analyzes your question and searches for reliable academic sources</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                <p className="text-gray-300">Receive a comprehensive answer with cited sources and methodology</p>
              </div>
              <div className="flex items-start">
                <div className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</div>
                <p className="text-gray-300">Click on source links to explore the original academic materials</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-100 mt-6 mb-4">Technology</h2>
            <p className="text-gray-300 mb-4">
              EduRec is built using modern web technologies including React, TypeScript, and Tailwind CSS.
              The AI capabilities are powered by OpenAI's advanced language models, specifically optimized
              for educational content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
