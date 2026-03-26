import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType } from 'docx'

// ─── JSON Export / Import ───────────────────────────────────────────────────

export function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  saveAs(blob, `plan-sucesion-pns-${new Date().toISOString().slice(0, 10)}.json`)
}

export function importJSON(file, callback) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      callback(data)
    } catch {
      alert('Error: El archivo no es un JSON válido.')
    }
  }
  reader.readAsText(file)
}

// ─── PDF Export ──────────────────────────────────────────────────────────────

export async function exportPDF(elementId, filename = 'plan-sucesion.pdf') {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(filename)
  } catch (err) {
    console.error('Error exporting PDF', err)
    alert('Error al exportar PDF. Intenta de nuevo.')
  }
}

export async function exportFullPDF(data) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  // Cover page
  pdf.setFillColor(26, 46, 59)
  pdf.rect(0, 0, pageW, pageH, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(22)
  pdf.text('Plan de Sucesión', pageW / 2, 80, { align: 'center' })
  pdf.text('Business Intelligence', pageW / 2, 95, { align: 'center' })
  pdf.setFontSize(12)
  pdf.setTextColor(93, 202, 165)
  pdf.text('Provider Network Solutions — Puerto Rico', pageW / 2, 115, { align: 'center' })
  pdf.setTextColor(138, 148, 152)
  pdf.setFontSize(10)
  pdf.text(`${data.meta.period} · Documento Confidencial`, pageW / 2, 130, { align: 'center' })
  pdf.text(`Próxima revisión: ${data.meta.nextReview}`, pageW / 2, 140, { align: 'center' })

  // Stats page
  pdf.addPage()
  pdf.setFillColor(247, 248, 248)
  pdf.rect(0, 0, pageW, pageH, 'F')
  pdf.setTextColor(26, 46, 59)
  pdf.setFontSize(16)
  pdf.text('Resumen del Pipeline', 20, 30)

  const readyNow = data.collaborators.filter(c => c.readinessStatus === 'Listo ahora').length
  const readySoon = data.collaborators.filter(c => c.readinessStatus === 'Listo pronto').length
  const readyFuture = data.collaborators.filter(c => c.readinessStatus === 'Listo futuro').length

  pdf.setFontSize(11)
  pdf.setTextColor(107, 122, 128)
  let y = 50
  const stats = [
    `Total colaboradores: ${data.collaborators.length}`,
    `Listos ahora: ${readyNow}`,
    `Listos pronto: ${readySoon}`,
    `Listos futuro: ${readyFuture}`,
    `Índice de calidad: ${data.meta.qualityScore}/100`,
  ]
  stats.forEach(s => {
    pdf.setTextColor(26, 46, 59)
    pdf.text(s, 20, y)
    y += 10
  })

  // Collaborators pages
  data.collaborators.forEach((c) => {
    pdf.addPage()
    pdf.setFillColor(247, 248, 248)
    pdf.rect(0, 0, pageW, pageH, 'F')
    pdf.setTextColor(26, 46, 59)
    pdf.setFontSize(14)
    pdf.text(c.code, 20, 25)
    pdf.setFontSize(10)
    pdf.setTextColor(107, 122, 128)
    pdf.text(c.currentPosition, 20, 35)
    pdf.text(`Puesto objetivo: ${c.targetPosition}`, 20, 43)
    pdf.text(`Readiness: ${c.readinessStatus} (${c.readinessPercentage}%) · ${c.timelineMonths}`, 20, 51)

    let cy = 65
    pdf.setTextColor(26, 46, 59)
    pdf.setFontSize(11)
    pdf.text('Fortalezas:', 20, cy); cy += 8
    pdf.setFontSize(9)
    pdf.setTextColor(107, 122, 128)
    c.strengths.forEach(s => { pdf.text(`• ${s}`, 25, cy); cy += 7 })

    cy += 5
    pdf.setTextColor(26, 46, 59)
    pdf.setFontSize(11)
    pdf.text('Brechas críticas:', 20, cy); cy += 8
    pdf.setFontSize(9)
    c.gaps.forEach(g => {
      pdf.setTextColor(163, 45, 45)
      pdf.text(`• [${g.severity}] ${g.name}`, 25, cy); cy += 7
      if (cy > pageH - 20) { pdf.addPage(); cy = 20 }
    })

    cy += 5
    pdf.setTextColor(26, 46, 59)
    pdf.setFontSize(11)
    pdf.text('Plan de Desarrollo (IDP):', 20, cy); cy += 8
    pdf.setFontSize(9)
    c.idp.forEach(phase => {
      pdf.setTextColor(29, 158, 117)
      pdf.text(`Fase ${phase.phase} (${phase.duration}):`, 25, cy); cy += 7
      phase.actions.forEach(a => {
        if (cy > pageH - 20) { pdf.addPage(); cy = 20 }
        pdf.setTextColor(107, 122, 128)
        pdf.text(`  · ${a.text}`, 30, cy); cy += 6
      })
    })
  })

  pdf.save(`plan-sucesion-pns-completo-${new Date().toISOString().slice(0, 10)}.pdf`)
}

// ─── Word (DOCX) Export ──────────────────────────────────────────────────────

export async function exportDocx(data, collaboratorId = null) {
  const targets = collaboratorId
    ? data.collaborators.filter(c => c.id === collaboratorId)
    : data.collaborators

  const noBorder = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }

  const makeHeader = (text, level = HeadingLevel.HEADING_1) =>
    new Paragraph({ text, heading: level, spacing: { before: 300, after: 100 } })

  const makePara = (text, color = '1a2e3b') =>
    new Paragraph({ children: [new TextRun({ text, color, size: 20 })], spacing: { before: 80, after: 80 } })

  const makeBullet = (text, color = '6b7a80') =>
    new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text, color, size: 18 })], spacing: { before: 40 } })

  const sections = []

  // Cover
  sections.push(makeHeader('Plan de Sucesión — Business Intelligence', HeadingLevel.TITLE))
  sections.push(makePara('Provider Network Solutions — Puerto Rico'))
  sections.push(makePara(`${data.meta.period} · Documento Confidencial · People Operations`))
  sections.push(makePara(`Próxima revisión: ${data.meta.nextReview} · Responsable: ${data.meta.responsible}`))

  // Summary
  const readySoon = data.collaborators.filter(c => c.readinessStatus === 'Listo pronto').length
  sections.push(makeHeader('Resumen del Pipeline', HeadingLevel.HEADING_1))
  sections.push(makePara(`Colaboradores evaluados: ${data.collaborators.length}`))
  sections.push(makePara(`Listos pronto: ${readySoon} · Índice de calidad: ${data.meta.qualityScore}/100`))

  // Talent Cards
  sections.push(makeHeader('Perfiles Individuales — Talent Cards', HeadingLevel.HEADING_1))

  targets.forEach(c => {
    sections.push(makeHeader(c.code, HeadingLevel.HEADING_2))
    sections.push(makePara(`Puesto actual: ${c.currentPosition}`))
    sections.push(makePara(`Puesto objetivo: ${c.targetPosition}`))
    sections.push(makePara(`Readiness: ${c.readinessStatus} (${c.readinessPercentage}%) · Timeline: ${c.timelineMonths}`))

    sections.push(makeHeader('Fortalezas', HeadingLevel.HEADING_3))
    c.strengths.forEach(s => sections.push(makeBullet(s, '0f6e56')))

    sections.push(makeHeader('Brechas de Competencias', HeadingLevel.HEADING_3))
    c.gaps.forEach(g => sections.push(makeBullet(`[${g.severity}] ${g.name} — ${g.detail}`, 'A32D2D')))

    sections.push(makeHeader('Plan de Desarrollo Individual (IDP)', HeadingLevel.HEADING_3))
    c.idp.forEach(phase => {
      sections.push(makePara(`Fase ${phase.phase} (${phase.duration}):`, '1D9E75'))
      phase.actions.forEach(a => sections.push(makeBullet(
        `${a.status === 'done' ? '✓' : a.status === 'inprogress' ? '◔' : '○'} ${a.text}`,
        '534AB7'
      )))
    })
  })

  // Recommendations
  sections.push(makeHeader('Recomendaciones Estratégicas', HeadingLevel.HEADING_1))
  data.recommendations.forEach(r => {
    sections.push(makePara(`Prioridad ${r.priority}: ${r.title}`, '1a2e3b'))
    sections.push(makePara(r.detail, '6b7a80'))
  })

  const doc = new Document({
    styles: { paragraphStyles: [] },
    sections: [{ properties: {}, children: sections }],
  })

  const blob = await Packer.toBlob(doc)
  const fname = collaboratorId
    ? `talent-card-${collaboratorId.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.docx`
    : `plan-sucesion-pns-completo-${new Date().toISOString().slice(0, 10)}.docx`
  saveAs(blob, fname)
}
