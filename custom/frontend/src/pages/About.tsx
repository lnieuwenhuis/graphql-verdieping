export function About() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About This Project
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          This project demonstrates the integration between a React frontend and a Go GraphQL backend
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Frontend</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• React 18 with TypeScript</li>
              <li>• Vite for build tooling</li>
              <li>• Tailwind CSS for styling</li>
              <li>• React Router DOM for routing</li>
              <li>• Apollo Client for GraphQL</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Backend</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Go with gqlgen</li>
              <li>• GraphQL API</li>
              <li>• CORS enabled</li>
              <li>• Sample data queries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}