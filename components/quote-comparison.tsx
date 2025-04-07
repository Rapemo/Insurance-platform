import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

interface Quote {
  provider: string
  monthlyPremium: number
  coverage: number
  deductible: number
  benefits: string[]
  rating: number
}

export function QuoteComparison({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">AI-Generated Quotes</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Based on your information, we've generated the following quotes from top providers.
      </p>

      <div className="space-y-4">
        {quotes.map((quote, index) => (
          <Card key={index} className={index === 0 ? "border-primary" : ""}>
            {index === 0 && <Badge className="absolute -top-2 right-4">Best Value</Badge>}
            <CardHeader>
              <CardTitle>{quote.provider}</CardTitle>
              <CardDescription className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(quote.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm">({quote.rating})</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold">${quote.monthlyPremium}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span className="font-medium">${quote.coverage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Deductible</span>
                    <span className="font-medium">${quote.deductible}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {quote.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Select Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

