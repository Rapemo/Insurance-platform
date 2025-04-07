"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"

interface DocumentScannerProps {
  onScanComplete: (result: string) => void
  onCancel: () => void
}

export function DocumentScanner({ onScanComplete, onCancel }: DocumentScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg")
    setCapturedImage(imageDataUrl)
    setIsCapturing(false)

    // Simulate AI analysis
    analyzeImage(imageDataUrl)
  }

  const analyzeImage = (imageUrl: string) => {
    setIsAnalyzing(true)

    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // Mock AI analysis results
      const mockResults = [
        "Vehicle damage detected on front bumper and driver-side door.",
        "Estimated repair cost: $2,500 - $3,200 based on similar damage patterns.",
        "Damage appears consistent with a side-impact collision.",
        "No structural damage detected to frame components.",
        "Recommended: Professional body shop assessment for final estimate.",
      ].join("\n\n")

      onScanComplete(mockResults)
      setIsAnalyzing(false)
    }, 2000)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setIsCapturing(true)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-[4/3] bg-black rounded-lg overflow-hidden">
        {!capturedImage ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </>
        ) : (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-contain" />
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-center">Analyzing image with AI...</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {!capturedImage ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={captureImage}>
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={retakePhoto} disabled={isAnalyzing}>
              Retake
            </Button>
            <Button variant="default" disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Use This Image"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

