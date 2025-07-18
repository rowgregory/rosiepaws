import { generateSeizureReport } from './seizure-report'

interface PDFOptions {
  includeCharts?: boolean
  includeFullLog?: boolean
  veterinarianName?: string
  clinicName?: string
  ownerName?: string
  petPhoto?: string
}

// PDF Generation using jsPDF (you'll need to install: npm install jspdf)
export const generateSeizurePDFReport = async (seizureData: any[], options: PDFOptions = {}) => {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import('jspdf')

  // Generate the report data
  const report = generateSeizureReport(seizureData, {
    format: 'veterinary',
    dateRange: 'all'
  })

  // Create new PDF document
  const doc = new jsPDF()
  let yPosition = 20

  // Helper functions
  const addText = (text: string, x: number = 20, fontSize: number = 12, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', style)
    doc.text(text, x, yPosition)
    yPosition += fontSize * 0.5 + 2
  }

  const addSection = (title: string) => {
    yPosition += 10
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPosition - 8, 180, 12, 'F')
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(title, 20, yPosition)
    yPosition += 15
  }

  const checkPageBreak = () => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
  }

  // Header
  doc.setFillColor(139, 92, 246) // Purple header
  doc.rect(0, 0, 210, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('VETERINARY SEIZURE REPORT', 20, 20)

  doc.setTextColor(0, 0, 0)
  yPosition = 45

  // Pet Information
  addSection('PET INFORMATION')
  addText(`Pet Name: ${report.petName}`, 20, 12, 'bold')
  if (seizureData[0]?.pet) {
    const pet = seizureData[0].pet
    addText(`Breed: ${pet.breed || 'Not specified'}`)
    addText(`Type: ${pet.type}`)
    addText(`Age: ${pet.age || 'Not specified'}`)
  }
  addText(`Report Generated: ${report.reportDate}`)
  addText(`Report Period: ${report.reportPeriod}`)

  // Clinic Information (if provided)
  if (options.clinicName || options.veterinarianName) {
    checkPageBreak()
    addSection('CLINIC INFORMATION')
    if (options.clinicName) addText(`Clinic: ${options.clinicName}`)
    if (options.veterinarianName) addText(`Veterinarian: ${options.veterinarianName}`)
    if (options.ownerName) addText(`Pet Owner: ${options.ownerName}`)
  }

  // Executive Summary
  checkPageBreak()
  addSection('EXECUTIVE SUMMARY')
  addText(`Total Seizures: ${report.summary.totalSeizures}`, 20, 12, 'bold')
  addText(`Average Frequency: ${report.summary.averageFrequency.toFixed(2)} seizures/week`)
  addText(`Average Duration: ${report.summary.averageDuration.toFixed(1)} minutes`)
  addText(`Most Common Type: ${report.summary.mostCommonType}`)
  addText(`Most Common Severity: ${report.summary.mostCommonSeverity}`)
  addText(`Risk Assessment: ${report.riskAssessment}`, 20, 12, 'bold')

  // Set risk assessment color
  const riskColors = {
    LOW: [34, 197, 94], // Green
    MODERATE: [234, 179, 8], // Yellow
    HIGH: [249, 115, 22], // Orange
    CRITICAL: [239, 68, 68] // Red
  }

  if (riskColors[report.riskAssessment as keyof typeof riskColors]) {
    const [r, g, b] = riskColors[report.riskAssessment as keyof typeof riskColors]
    doc.setTextColor(r, g, b)
    addText(`⚠️ ${report.riskAssessment} RISK LEVEL`, 20, 14, 'bold')
    doc.setTextColor(0, 0, 0)
  }

  // Clinical Analysis
  checkPageBreak()
  addSection('CLINICAL ANALYSIS')

  // Seizure Type Distribution
  addText('Seizure Type Distribution:', 20, 12, 'bold')
  Object.entries(report.analysis.typeDistribution).forEach(([type, count]) => {
    addText(`• ${type.replace('_', ' ')}: ${count} episodes`)
  })

  yPosition += 5

  // Severity Distribution
  addText('Severity Distribution:', 20, 12, 'bold')
  Object.entries(report.analysis.severityDistribution).forEach(([severity, count]) => {
    addText(`• ${severity}: ${count} episodes`)
  })

  // Trigger Analysis
  if (Object.keys(report.analysis.triggerAnalysis).length > 0) {
    checkPageBreak()
    addText('Identified Triggers:', 20, 12, 'bold')
    Object.entries(report.analysis.triggerAnalysis)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .forEach(([trigger, count]) => {
        addText(`• ${trigger}: ${count} occurrences`)
      })
  }

  // Recovery Analysis
  if (report.analysis.recoveryAnalysis.average > 0) {
    checkPageBreak()
    addText('Recovery Time Analysis:', 20, 12, 'bold')
    addText(`Average Recovery: ${report.analysis.recoveryAnalysis.average.toFixed(1)} minutes`)
    addText(`Longest Recovery: ${report.analysis.recoveryAnalysis.longest} minutes`)
    addText(`Shortest Recovery: ${report.analysis.recoveryAnalysis.shortest} minutes`)
  }

  // Risk Factors
  if (report.analysis.riskFactors.length > 0) {
    checkPageBreak()
    addSection('RISK FACTORS')
    report.analysis.riskFactors.forEach((factor: string) => {
      addText(`⚠️ ${factor}`, 20, 11)
    })
  }

  // Recommendations
  checkPageBreak()
  addSection('CLINICAL RECOMMENDATIONS')
  report.recommendations.forEach((recommendation: string) => {
    addText(`• ${recommendation}`, 20, 11)
  })

  // Veterinary-Specific Analysis
  if (report.analysis.clinicalAssessment) {
    checkPageBreak()
    addSection('CLINICAL ASSESSMENT')
    const clinical = report.analysis.clinicalAssessment
    addText(`Seizure Pattern: ${clinical.seizurePattern}`, 20, 12, 'bold')
    addText(`Medication Assessment: ${clinical.medicationEffectiveness}`)
    if (clinical.emergencyProtocol) {
      doc.setTextColor(239, 68, 68)
      addText('🚨 Emergency Protocol Required', 20, 12, 'bold')
      doc.setTextColor(0, 0, 0)
    }
    if (clinical.clustersIdentified) {
      addText('⚠️ Cluster seizures identified - requires immediate attention')
    }
  }

  // Seizure Log (if requested)
  if (options.includeFullLog && seizureData.length > 0) {
    checkPageBreak()
    addSection('DETAILED SEIZURE LOG')

    seizureData.slice(0, 10).forEach((seizure, index) => {
      checkPageBreak()
      const seizureDate = new Date(seizure.timeRecorded)
      addText(
        `${index + 1}. ${seizureDate.toLocaleDateString()} at ${seizureDate.toLocaleTimeString()}`,
        20,
        11,
        'bold'
      )
      addText(`   Type: ${seizure.seizureType?.replace('_', ' ') || 'Not specified'}`)
      addText(`   Severity: ${seizure.severity || 'Not specified'}`)
      addText(`   Duration: ${(seizure.duration / 60).toFixed(1)} minutes`)
      if (seizure.triggerFactor) addText(`   Trigger: ${seizure.triggerFactor}`)
      if (seizure.recoveryTime) addText(`   Recovery: ${seizure.recoveryTime} minutes`)
      if (seizure.notes) addText(`   Notes: ${seizure.notes}`)
      yPosition += 3
    })

    if (seizureData.length > 10) {
      addText(`... and ${seizureData.length - 10} more episodes (see digital records)`)
    }
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Seizure Report - ${report.petName} - Page ${i} of ${pageCount}`, 20, 285)
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 290)
    doc.text('This report is intended for veterinary professionals only', 120, 290)
  }

  return doc
}
