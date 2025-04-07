import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight } from "lucide-react"

export function RecentClaims() {
  const claims = [
    {
      id: "CLM-2025-001",
      date: "May 5, 2025",
      type: "Auto Accident",
      status: "Processing",
      amount: "$4,250.00",
    },
    {
      id: "CLM-2025-002",
      date: "Apr 12, 2025",
      type: "Home Water Damage",
      status: "Approved",
      amount: "$2,800.00",
    },
    {
      id: "CLM-2024-089",
      date: "Dec 3, 2024",
      type: "Auto Theft",
      status: "Completed",
      amount: "$18,500.00",
    },
  ]

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div key={claim.id} className="flex flex-col p-4 rounded-lg border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{claim.type}</h4>
              <p className="text-sm text-muted-foreground">
                {claim.date} • Claim #{claim.id}
              </p>
            </div>
            <Badge
              variant={
                claim.status === "Processing" ? "outline" : claim.status === "Approved" ? "default" : "secondary"
              }
            >
              {claim.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold">{claim.amount}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <FileText className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Details</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full">
        View All Claims
      </Button>
    </div>
  )
}

