import * as ImagePicker from "expo-image-picker"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"
import { createWorker } from "tesseract.js"

interface OCRResult {
   text: string
   amount?: number
}

export async function scanBill(): Promise<OCRResult> {
   // Request camera permission
   const { status } = await ImagePicker.requestCameraPermissionsAsync()
   if (status !== "granted") {
      throw new Error("Camera permission is required")
   }

   // Capture image
   const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
   })

   if (!result.assets || result.assets.length === 0) {
      throw new Error("No image captured")
   }

   // Optimize image for OCR
   const processedImage = await manipulateAsync(
      result.assets[0].uri,
      [
         { resize: { width: 1000 } },
      ],
      { format: SaveFormat.JPEG }
   )

   // Initialize Tesseract worker
   const worker = await createWorker("eng")
   await worker.reinitialize()

   // Perform OCR
   const { data: { text } } = await worker.recognize(processedImage.uri)
   await worker.terminate()

   // Extract amount using regex
   const amountMatch = text.match(/(?:Rs\.?|₹)\s*(\d+(?:\.\d{2})?)/i)
   const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined

   return {
      text,
      amount
   }
}
