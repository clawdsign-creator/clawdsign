const colorSchemes = {
  'claude-opus-4-5': { primary: '#9333EA', secondary: '#E879F9', bg: '#FAF5FF' },
  'claude-sonnet-4-5': { primary: '#3B82F6', secondary: '#06B6D4', bg: '#EFF6FF' },
  'claude-haiku-4-5': { primary: '#10B981', secondary: '#34D399', bg: '#ECFDF5' },
  'gpt-4': { primary: '#F97316', secondary: '#FBBF24', bg: '#FFF7ED' },
  'gpt-4-turbo': { primary: '#EF4444', secondary: '#FB7185', bg: '#FEF2F2' },
  'llama-3': { primary: '#14B8A6', secondary: '#0EA5E9', bg: '#F0FDFA' }
}

/**
 * Generate unique visual signature from agent data
 * @param {Object} agentData - Agent information
 * @param {string} agentData.name - Agent name
 * @param {string} agentData.model - AI model (e.g., 'claude-opus-4-5')
 * @param {string} agentData.theme - Agent theme/description
 * @param {number} agentData.skillsCount - Number of skills (1-20)
 * @returns {Object} { svg: string, signatureId: string, hash: number }
 */
function generateSignature(agentData) {
  const { name, model, theme, skillsCount } = agentData
  
  const colors = colorSchemes[model] || colorSchemes['claude-opus-4-5']
  
  const hashString = `${name}-${model}-${theme}-${skillsCount}`
  let hash = 0
  for (let i = 0; i < hashString.length; i++) {
    hash = ((hash << 5) - hash) + hashString.charCodeAt(i)
    hash = hash & hash 
  }
  
  const seed = Math.abs(hash)
  const random = (index) => {
    const x = Math.sin(seed + index) * 10000
    return x - Math.floor(x)
  }
  
  const elements = []
  const numNodes = Math.min(Math.max(skillsCount || 5, 4), 12)
  const padding = 40
  const minX = padding
  const maxX = 300 - padding
  const minY = padding + 15
  const maxY = 200 - padding - 20
  const drawWidth = maxX - minX
  const drawHeight = maxY - minY
  
  const nodes = []
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: minX + random(i * 2) * drawWidth,
      y: minY + random(i * 2 + 1) * drawHeight,
      size: 2 + random(i * 3) * 3
    })
  }
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x
      const dy = nodes[j].y - nodes[i].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 80 + random(i * j) * 40) {
        const opacity = (0.15 + random(i + j) * 0.25).toFixed(2)
        const strokeWidth = (1 + random(i * 2 + j) * 1.5).toFixed(1)
        elements.push(
          `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(1)}" ` +
          `x2="${nodes[j].x.toFixed(1)}" y2="${nodes[j].y.toFixed(1)}" ` +
          `stroke="${colors.primary}" stroke-width="${strokeWidth}" ` +
          `opacity="${opacity}" stroke-linecap="round"/>`
        )
      }
    }
  }
  
  nodes.forEach((node, i) => {
    const opacity = (0.4 + random(i * 4) * 0.4).toFixed(2)
    elements.push(
      `<circle cx="${node.x.toFixed(1)}" cy="${node.y.toFixed(1)}" ` +
      `r="${node.size.toFixed(1)}" fill="${colors.secondary}" opacity="${opacity}"/>`
    )
  })
  
  const numShapes = Math.floor(random(100) * 2) + 1
  for (let i = 0; i < numShapes; i++) {
    const cx = minX + random(i * 10) * drawWidth
    const cy = minY + random(i * 11) * drawHeight
    const size = 15 + random(i * 12) * 25
    const opacity = (0.08 + random(i * 13) * 0.12).toFixed(2)
    
    if (random(i * 14) > 0.5) {
      elements.push(
        `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" ` +
        `r="${(size/2).toFixed(1)}" fill="none" stroke="${colors.primary}" ` +
        `stroke-width="1.5" opacity="${opacity}"/>`
      )
    } else {
      const rotation = (random(i * 15) * 45).toFixed(1)
      elements.push(
        `<rect x="${(cx - size/2).toFixed(1)}" y="${(cy - size/2).toFixed(1)}" ` +
        `width="${size.toFixed(1)}" height="${size.toFixed(1)}" fill="none" ` +
        `stroke="${colors.primary}" stroke-width="1.5" opacity="${opacity}" ` +
        `transform="rotate(${rotation} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`
      )
    }
  }
  
  const clipId = Math.abs(hash).toString(16).substring(0, 6)
  const signatureId = Math.abs(hash).toString(16).substring(0, 8).toUpperCase()
  
  const svg = `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;">
    <defs><clipPath id="clip-${clipId}"><rect x="0" y="0" width="300" height="200" rx="12"/></clipPath></defs>
    <rect width="300" height="200" fill="${colors.bg}" rx="12"/>
    <g clip-path="url(#clip-${clipId})">${elements.join('\n')}</g>
    <text x="150" y="188" font-size="9" text-anchor="middle" fill="#718096" font-family="monospace" letter-spacing="0.5">#${signatureId}</text>
  </svg>`
  
  return {
    svg,
    signatureId,
    hash
  }
}

module.exports = { generateSignature }
