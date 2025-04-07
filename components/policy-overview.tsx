"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Car, Home, Heart } from "lucide-react"

export function PolicyOverview() {
  const [activePolicy, setActivePolicy] = useState("auto")

  const policies = {
    auto: {
      type: "Auto Insurance",
      policyNumber: "AUTO-12345-XYZ",
      status: "Active",
      startDate: "Jan 15, 2025",
      endDate: "Jan 15, 2026",
      premium: "$89.99/month",
      vehicle: "2022 Toyota Camry",
      coverage: [
        { type: "Liability", amount: "$250,000/$500,000" },
        { type: "Collision", amount: "$500 deductible" },
        { type: "Comprehensive", amount: "$250 deductible" },
        { type: "Uninsured Motorist", amount: "$250,000" },
        { type: "Medical Payments", amount: "$10,000" },
      ],
    },
    home: {
      type: "Home Insurance",
      policyNumber: "HOME-67890-ABC",
      status: "Active",
      startDate: "Mar 10, 2025",
      endDate: "Mar 10, 2026",
      premium: "$125.50/month",
      property: "123 Main St, Anytown, USA",
      coverage: [
        { type: "Dwelling", amount: "$350,000" },
        { type: "Personal Property", amount: "$175,000" },
        { type: "Liability", amount: "$300,000" },
        { type: "Additional Living Expenses", amount: "$70,000" },
        { type: "Medical Payments", amount: "$5,000" },
      ],
    },
    life: {
      type: "Life Insurance",
      policyNumber: "LIFE-54321-DEF",
      status: "Active",
      startDate: "Sep 5, 2024",
      endDate: "Sep 5, 2054",
      premium: "$45.75/month",
      beneficiary: "Jane Doe (Spouse)",
      coverage: [
        { type: "Death Benefit", amount: "$500,000" },
        { type: "Cash Value", amount: "$12,500 (current)" },
        { type: "Accidental Death", amount: "$1,000,000" },
      ],
    },
  }

  const currentPolicy = policies[activePolicy as keyof typeof policies]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="auto" onValueChange={setActivePolicy}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Auto</span>
          </TabsTrigger>
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </TabsTrigger>
          <TabsTrigger value="life" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Life</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="space-y-4">
          <PolicyDetails policy={policies.auto} />
        </TabsContent>
        <TabsContent value="home" className="space-y-4">
          <PolicyDetails policy={policies.home} />
        </TabsContent>
        <TabsContent value="life" className="space-y-4">
          <PolicyDetails policy={policies.life} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PolicyDetails({ policy }: { policy: any }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{policy.type}</h3>
          <p className="text-sm text-muted-foreground">Policy #{policy.policyNumber}</p>
        </div>
        <Badge variant={policy.status === "Active" ? "default" : "destructive"}>{policy.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium">Policy Period</h4>
          <p className="text-sm">
            {policy.startDate} - {policy.endDate}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Premium</h4>
          <p className="text-sm">{policy.premium}</p>
        </div>
        {policy.vehicle && (
          <div className="col-span-2">
            <h4 className="text-sm font-medium">Vehicle</h4>
            <p className="text-sm">{policy.vehicle}</p>
          </div>
        )}
        {policy.property && (
          <div className="col-span-2">
            <h4 className="text-sm font-medium">Property</h4>
            <p className="text-sm">{policy.property}</p>
          </div>
        )}
        {policy.beneficiary && (
          <div className="col-span-2">
            <h4 className="text-sm font-medium">Beneficiary</h4>
            <p className="text-sm">{policy.beneficiary}</p>
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Coverage Details</h4>
        <div className="space-y-2">
          {policy.coverage.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm p-2 rounded-md bg-muted/50">
              <span>{item.type}</span>
              <span className="font-medium">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <FileText className="h-4 w-4" />
          View Documents
        </Button>
        <Button size="sm">Manage Policy</Button>
      </div>
    </div>
  )
}

