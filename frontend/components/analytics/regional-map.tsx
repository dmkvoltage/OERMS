"use client"

export function RegionalMap() {
  const regions = [
    { name: "Centre", x: 45, y: 40, passRate: 82.1, color: "bg-green-500" },
    { name: "Littoral", x: 35, y: 55, passRate: 79.8, color: "bg-green-400" },
    { name: "West", x: 25, y: 45, passRate: 76.5, color: "bg-yellow-500" },
    { name: "Northwest", x: 20, y: 30, passRate: 74.2, color: "bg-yellow-400" },
    { name: "Southwest", x: 15, y: 50, passRate: 73.8, color: "bg-yellow-400" },
    { name: "East", x: 65, y: 45, passRate: 71.4, color: "bg-orange-400" },
    { name: "North", x: 40, y: 20, passRate: 69.8, color: "bg-orange-500" },
    { name: "Adamawa", x: 55, y: 30, passRate: 68.9, color: "bg-orange-500" },
    { name: "Far North", x: 45, y: 10, passRate: 67.3, color: "bg-red-400" },
  ]

  return (
    <div className="relative w-full h-96 bg-slate-100 rounded-lg overflow-hidden">
      {/* Simplified Cameroon map outline */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <path
          d="M20 25 L25 20 L35 15 L50 10 L60 15 L70 20 L75 30 L80 40 L75 50 L70 60 L60 65 L50 70 L40 75 L30 70 L20 60 L15 50 L10 40 L15 30 Z"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2"
          className="opacity-50"
        />
      </svg>

      {/* Region markers */}
      {regions.map((region, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ left: `${region.x}%`, top: `${region.y}%` }}
        >
          <div
            className={`w-4 h-4 ${region.color} rounded-full shadow-lg group-hover:scale-125 transition-transform`}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              <div className="font-semibold">{region.name}</div>
              <div>{region.passRate}% Pass Rate</div>
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold mb-2">Pass Rate</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-xs">80%+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-xs">70-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-xs">60-69%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span className="text-xs">Below 60%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
