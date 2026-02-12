const { supabase } = require('../lib/supabase')
const { generateSignature } = require('../utils/signatureGenerator')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, model, theme, skillsCount, claimedBy } = req.body

    if (!name || !model || !theme || !skillsCount) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'model', 'theme', 'skillsCount']
      })
    }

    if (skillsCount < 1 || skillsCount > 20) {
      return res.status(400).json({
        error: 'skillsCount must be between 1 and 20'
      })
    }

    const signature = generateSignature({ name, model, theme, skillsCount })

    const { data: existing, error: checkError } = await supabase
      .from('agents')
      .select('*')
      .eq('signature_id', signature.signatureId)
      .single()

    if (existing) {
      return res.status(409).json({ 
        error: 'Signature already claimed',
        existingAgent: {
          name: existing.name,
          claimedAt: existing.claimed_at
        }
      })
    }

    const { data, error } = await supabase
      .from('agents')
      .insert([
        {
          name,
          model,
          theme,
          skills_count: skillsCount,
          signature_id: signature.signatureId,
          signature_hash: signature.hash,
          signature_svg: signature.svg,
          claimed: true,
          claimed_by: claimedBy || null,
          claimed_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ 
        error: 'Failed to claim signature',
        details: error.message 
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Signature claimed successfully! 🎉',
      data: {
        id: data.id,
        name: data.name,
        signatureId: data.signature_id,
        signatureSvg: data.signature_svg,
        claimedAt: data.claimed_at
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}
