"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { DocumentScanner } from "@/components/document-scanner"
import { useToast } from "@/hooks/use-toast"

const claimFormSchema = z.object({
  policyNumber: z.string().min(1, {
    message: "Please enter your policy number.",
  }),
  claimType: z.string({
    required_error: "Please select a claim type.",
  }),
  incidentDate: z.string().min(1, {
    message: "Please enter the incident date.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

export default function ClaimsPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof claimFormSchema>>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      policyNumber: "",
      claimType: "",
      incidentDate: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof claimFormSchema>) {
    toast({
      title: "Claim submitted successfully",
      description: "Your claim has been received and is being processed.",
    })

    // Reset form and scan results
    form.reset()
    setScanResults(null)
  }

  const handleScanComplete = (result: string) => {
    setScanResults(result)
    setIsScanning(false)

    // Update the description field with AI analysis
    form.setValue("description", `${form.getValues("description")} \n\nAI Analysis: ${result}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">File a Claim</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Claim Information</CardTitle>
              <CardDescription>Provide details about your insurance claim.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="policyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your policy number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="claimType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select claim type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="auto-accident">Auto Accident</SelectItem>
                            <SelectItem value="auto-theft">Auto Theft</SelectItem>
                            <SelectItem value="auto-damage">Vehicle Damage</SelectItem>
                            <SelectItem value="home-damage">Home Damage</SelectItem>
                            <SelectItem value="home-theft">Home Theft</SelectItem>
                            <SelectItem value="medical">Medical Claim</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what happened in detail"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Include all relevant details about the incident.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setIsScanning(true)}>
                      Scan Documents/Damage
                    </Button>
                    <Button type="submit">Submit Claim</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document & Damage Scanner</CardTitle>
              <CardDescription>Use your camera to scan documents or capture damage for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
              {isScanning ? (
                <DocumentScanner onScanComplete={handleScanComplete} onCancel={() => setIsScanning(false)} />
              ) : scanResults ? (
                <div className="space-y-4 w-full">
                  <div className="p-4 border rounded-md bg-muted">
                    <h3 className="font-medium mb-2">AI Analysis Results:</h3>
                    <p className="text-sm">{scanResults}</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setIsScanning(true)}>
                    Scan Again
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M15 8h.01" />
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                      <circle cx="12" cy="14" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">No Scans Yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click "Scan Documents/Damage" to use your camera for AI-powered analysis
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

