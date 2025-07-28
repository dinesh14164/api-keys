"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function DebugPage() {
  const [envCheck, setEnvCheck] = useState({});
  const [connectionTest, setConnectionTest] = useState(null);

  useEffect(() => {
    checkEnvironment();
    testConnection();
  }, []);

  const checkEnvironment = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setEnvCheck({
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlFormat: supabaseUrl ? supabaseUrl.includes('supabase.co') : false,
      keyFormat: supabaseKey ? supabaseKey.length > 50 : false
    });
  };

  const testConnection = async () => {
    try {
      setConnectionTest({ status: 'testing', message: 'Testing connection...' });
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('count', { count: 'exact' });

      if (error) {
        setConnectionTest({ 
          status: 'error', 
          message: error.message,
          details: error
        });
      } else {
        setConnectionTest({ 
          status: 'success', 
          message: 'Connection successful!',
          data
        });
      }
    } catch (err) {
      setConnectionTest({ 
        status: 'error', 
        message: err.message,
        details: err
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Debug Information</h1>
      
      {/* Environment Variables Check */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${envCheck.hasUrl ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>NEXT_PUBLIC_SUPABASE_URL: {envCheck.hasUrl ? '✓ Set' : '✗ Missing'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${envCheck.hasKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envCheck.hasKey ? '✓ Set' : '✗ Missing'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${envCheck.urlFormat ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>URL Format: {envCheck.urlFormat ? '✓ Valid' : '✗ Invalid (should contain supabase.co)'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${envCheck.keyFormat ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Key Format: {envCheck.keyFormat ? '✓ Valid' : '✗ Invalid (should be long string)'}</span>
          </div>
        </div>
      </div>

      {/* Connection Test */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Connection Test</h2>
        {connectionTest && (
          <div className={`p-4 rounded ${
            connectionTest.status === 'success' ? 'bg-green-50 text-green-800' :
            connectionTest.status === 'error' ? 'bg-red-50 text-red-800' :
            'bg-yellow-50 text-yellow-800'
          }`}>
            <p className="font-medium">{connectionTest.message}</p>
            {connectionTest.details && (
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(connectionTest.details, null, 2)}
              </pre>
            )}
          </div>
        )}
        <button 
          onClick={testConnection}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Again
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
        <div className="prose dark:prose-invert">
          <ol>
            <li>Make sure your <code>.env.local</code> file is in the root directory</li>
            <li>Verify your Supabase URL and anon key are correct</li>
            <li>Restart your development server after changing environment variables</li>
            <li>Run the SQL schema in your Supabase dashboard</li>
            <li>Check that the api_keys table exists in Supabase Table Editor</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 