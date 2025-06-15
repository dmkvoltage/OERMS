import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GradeDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Grade distribution chart will be displayed here
        </div>
      </CardContent>
    </Card>
  )
} 