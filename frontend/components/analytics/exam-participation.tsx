"use client"

export function ExamParticipation() {
  const examTypes = [
    {
      name: "GCE Advanced Level",
      registered: 45678,
      attended: 43892,
      completed: 43234,
      color: "bg-blue-500",
    },
    {
      name: "GCE Ordinary Level",
      registered: 67890,
      attended: 65234,
      completed: 64567,
      color: "bg-green-500",
    },
    {
      name: "Baccalauréat",
      registered: 34567,
      attended: 33456,
      completed: 33123,
      color: "bg-purple-500",
    },
    {
      name: "BEPC",
      registered: 56789,
      attended: 54678,
      completed: 54234,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      {examTypes.map((exam, index) => {
        const attendanceRate = (exam.attended / exam.registered) * 100
        const completionRate = (exam.completed / exam.attended) * 100

        return (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">{exam.name}</h4>
              <div className="text-sm text-slate-600">{exam.registered.toLocaleString()} registered</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Attendance Rate</span>
                <span className="font-medium">{attendanceRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`${exam.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span className="font-medium">{completionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`${exam.color} opacity-75 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
