"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent } from "@/components/ui/card"

export function RiskVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    // Sample risk data
    const riskData = [
      { category: "Collision", score: 72, maxScore: 100 },
      { category: "Theft", score: 85, maxScore: 100 },
      { category: "Natural Disaster", score: 60, maxScore: 100 },
      { category: "Personal Liability", score: 90, maxScore: 100 },
      { category: "Medical", score: 78, maxScore: 100 },
    ]

    // Set up dimensions
    const margin = { top: 30, right: 30, bottom: 70, left: 60 }
    const width = 600 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(riskData.map((d) => d.category))
      .padding(0.2)

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")

    // Y axis
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0])

    svg.append("g").call(d3.axisLeft(y))

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Risk Assessment by Category")

    // Create color scale
    const colorScale = d3.scaleLinear<string>().domain([0, 50, 100]).range(["#ef4444", "#eab308", "#22c55e"])

    // Add bars
    svg
      .selectAll("rect")
      .data(riskData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.category) as number)
      .attr("y", (d) => y(d.score))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.score))
      .attr("fill", (d) => colorScale(d.score))
      .attr("rx", 4)

    // Add labels
    svg
      .selectAll(".label")
      .data(riskData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.category) as number) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.score) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.score)
      .style("font-size", "12px")
      .style("font-weight", "bold")
  }, [])

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-1">Overall Risk Score</h3>
            <div className="text-2xl font-bold">72/100</div>
            <p className="text-xs text-muted-foreground">Good - Low Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-1">Recommended Actions</h3>
            <ul className="text-xs space-y-1">
              <li>• Install home security system</li>
              <li>• Complete defensive driving course</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-1">Potential Savings</h3>
            <div className="text-2xl font-bold">$420/yr</div>
            <p className="text-xs text-muted-foreground">By implementing recommendations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

