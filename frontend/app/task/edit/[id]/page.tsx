import { Metadata } from 'next';
import Link from 'next/link';
import EditTaskContent from '@/components/tasks/edit-task-content';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Edit Task | Todo Application',
    description: 'Edit your task details'
  };
}

export default function EditTaskPage({ params }: { params: { id: string } }) {
  // Pass task ID to the client component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Task
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
                Update the details for your task
              </p>
            </div>

            {/* Task form will be implemented as a client component */}
            <EditTaskContent taskId={params.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
