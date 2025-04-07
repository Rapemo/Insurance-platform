"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DashboardHeader } from "@/components/dashboard-header"
import { QuoteComparison } from "@/components/quote-comparison"

const quoteFormSchema = z.object({
  insuranceType: z.string({
    required_error: "Please select an insurance type.",
  }),
  coverage: z.number().min(50000).max(1000000),
  age: z.string().min(1, {
    message: "Please enter your age.",
  }),
  zipCode: z.string().min(5, {
    message: "Please enter a valid ZIP code.",
  }),
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
})

export default function QuotePage() {
  const [quotes, setQuotes] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      insuranceType: "auto",
      coverage: 250000,
      age: "",
      zipCode: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
    },
  })

  const insuranceType = form.watch("insuranceType")

  async function onSubmit(values: z.infer<typeof quoteFormSchema>) {
    setLoading(true)

    // Simulate API call to get quotes
    setTimeout(() => {
      // Mock response data
      const mockQuotes = [
        {
          provider: "SafeGuard Insurance",
          monthlyPremium: 89.99,
          coverage: values.coverage,
          deductible: 500,
          benefits: ["Roadside assistance", "Rental car coverage", "Accident forgiveness"],
          rating: 4.7,
        },
        {
          provider: "Secure Plus",
          monthlyPremium: 102.5,
          coverage: values.coverage,
          deductible: 250,
          benefits: ["24/7 customer service", "New car replacement", "Gap coverage"],
          rating: 4.5,
        },
        {
          provider: "ValueProtect",
          monthlyPremium: 78.25,
          coverage: values.coverage * 0.9, // Slightly less coverage
          deductible: 1000,
          benefits: ["Multi-policy discount", "Safe driver rewards"],
          rating: 4.2,
        },
      ]

      setQuotes(mockQuotes)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Get a Quote</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Quote Calculator</CardTitle>
              <CardDescription>
                Fill out the form below to get AI-generated quotes from multiple providers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="insuranceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select insurance type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="auto">Auto Insurance</SelectItem>
                            <SelectItem value="home">Home Insurance</SelectItem>
                            <SelectItem value="life">Life Insurance</SelectItem>
                            <SelectItem value="health">Health Insurance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Amount: ${field.value.toLocaleString()}</FormLabel>
                        <FormControl>
                          <Slider
                            min={50000}
                            max={1000000}
                            step={10000}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>Adjust the slider to set your desired coverage amount.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter your age" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter ZIP code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {insuranceType === "auto" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="vehicleYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Year</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 2020" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vehicleMake"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Make</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Toyota" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="vehicleModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Model</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Camry" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Generating Quotes..." : "Get Quotes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div>
            {quotes ? (
              <QuoteComparison quotes={quotes} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-6">
                  <h3 className="text-xl font-semibold mb-2">No Quotes Generated Yet</h3>
                  <p className="text-muted-foreground">
                    Fill out the form and click "Get Quotes" to see AI-generated insurance quotes.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

