import { SetupWizard } from "@/components/setup-wizard"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cameroon Examination Management System</h1>
          <p className="text-xl text-gray-600">Complete the setup to get started</p>
        </div>
        <SetupWizard />
      </div>
    </div>
  )
}
