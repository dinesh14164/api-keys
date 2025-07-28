import React from "react";

export default function CurrentPlanCard() {
  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-lg p-6 mb-8">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-medium">CURRENT PLAN</p>
          <h2 className="text-white text-3xl font-bold mt-2">Researcher</h2>
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-white text-sm">API Usage</span>
              <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-white text-sm mb-1">Plan</div>
            <div className="bg-white/20 rounded-full h-2 mb-4">
              <div className="bg-white h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white text-sm">Pay as you go</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/80 text-sm">0/1,000 Credits</div>
          <button className="mt-4 bg-white/20 text-white px-4 py-2 rounded text-sm hover:bg-white/30 transition-colors">
            📊 Manage Plan
          </button>
        </div>
      </div>
    </div>
  );
} 