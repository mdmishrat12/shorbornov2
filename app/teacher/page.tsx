import RoleProtected from "@/components/protected/role-protected";

export default function TeacherPage() {
  return (
    <RoleProtected allowedRoles={['teacher', 'admin']}>
      <div className="min-h-screen bg-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-700 mb-3">My Classes</h2>
                <ul className="space-y-2">
                  <li className="text-blue-600">Mathematics 101 - 30 Students</li>
                  <li className="text-blue-600">Advanced Calculus - 25 Students</li>
                </ul>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-700 mb-3">Grade Assignments</h2>
                <ul className="space-y-2">
                  <li className="text-blue-600">15 assignments pending</li>
                  <li className="text-blue-600">5 assignments to create</li>
                </ul>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-700 mb-3">Student Progress</h2>
                <ul className="space-y-2">
                  <li className="text-blue-600">View student analytics</li>
                  <li className="text-blue-600">Generate reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleProtected>
  );
}