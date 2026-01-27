import { Metadata } from 'next';
import Link from 'next/link';
import CreateTaskContent from './create-task-content'; // Client component for interactive parts
import Header from '@/components/layout/header';
import MainContent from '@/components/layout/main-content';

export const metadata: Metadata = {
  title: 'Create Task | Todo Application',
  description: 'Create a new task in your Todo application',
};

export default function CreateTaskPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <MainContent>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Task
              </h1>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                ← Back to Dashboard
              </Link>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500 animate-fadeIn">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Task Details</h2>
                <p className="text-gray-600 text-sm">
                  Fill in the details for your new task. Make sure to provide a descriptive title and clear description.
                </p>
              </div>

              <CreateTaskContent />
            </div>
          </div>
        </div>
      </MainContent>
    </div>
  );
}