"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiKeysService } from "../../../lib/database";
import { useToast } from "../../hooks/useToast";
import ToastNotification from "../../components/dashboard/ToastNotification";

function ProtectPageContent() {
  const searchParams = useSearchParams();
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyData, setKeyData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const {
    showToast,
    toastMessage,
    toastType,
    showToastNotification,
    hideToast
  } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset validation when API key changes
  useEffect(() => {
    if (mounted) {
      setHasValidated(false);
      setValidationResult(null);
      setKeyData(null);
      setLoading(true);
    }
  }, [searchParams, mounted]);

  useEffect(() => {
    if (!mounted || hasValidated) return;
    
    const validateApiKey = async () => {
      const apiKey = searchParams.get('apiKey');
      
      if (!apiKey) {
        setValidationResult({ valid: false, message: 'No API key provided' });
        showToastNotification('No API key provided', 'error');
        setLoading(false);
        setHasValidated(true);
        return;
      }

      try {
        setLoading(true);
        console.log('Validating API key:', apiKey);
        const result = await apiKeysService.validateApiKey(apiKey);
        setValidationResult(result);
        setKeyData(result.keyData);

        if (result.valid) {
          showToastNotification('Valid API key /protect can be accessed', 'success');
        } else {
          showToastNotification('Invalid API key', 'error');
        }
      } catch (error) {
        console.error('Validation error:', error);
        setValidationResult({ valid: false, message: 'Error validating API key' });
        showToastNotification('Error validating API key', 'error');
      } finally {
        setLoading(false);
        setHasValidated(true);
      }
    };

    validateApiKey();
  }, [mounted, hasValidated]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {!mounted ? 'Loading...' : 'Validating API key...'}
          </p>
                </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center">
            {validationResult?.valid ? (
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {validationResult?.valid ? 'Access Granted' : 'Access Denied'}
          </h1>
          
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {validationResult?.message || 'Checking API key validation...'}
          </p>
        </div>

        {validationResult?.valid ? (
          <div className="mt-12">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  🎉 Welcome to Protected Area
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">API Key Status</h3>
                    <p className="text-green-700 dark:text-green-300">✅ Valid and Active</p>
                  </div>
                  
                  {keyData && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Key Information</h3>
                      <p className="text-blue-700 dark:text-blue-300">Name: {keyData.name}</p>
                      <p className="text-blue-700 dark:text-blue-300">Usage: {keyData.usage || 0}</p>
                    </div>
                  )}
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <h3>What you can access:</h3>
                  <ul>
                    <li>Protected API endpoints</li>
                    <li>Advanced features and analytics</li>
                    <li>Premium data and resources</li>
                    <li>Priority support</li>
                  </ul>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href="/playground"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Test Another Key
                  </a>
                  <a
                    href="/dashboards"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🚫 Access Denied
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  The API key you provided is not valid or has expired. Please check your key and try again.
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-8">
                  <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">Common Issues:</h3>
                  <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                    <li>• API key is incorrect or misspelled</li>
                    <li>• API key has been deleted or revoked</li>
                    <li>• API key format is invalid</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/playground"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Try Again
                  </a>
                  <a
                    href="/dashboards"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Create New API Key
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <ToastNotification
          show={showToast}
          message={toastMessage}
          type={toastType}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}

export default function ProtectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ProtectPageContent />
    </Suspense>
  );
} 