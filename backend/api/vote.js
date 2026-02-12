const { supabase } = require('../lib/supabase')

/**
 * Vote submission endpoint
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
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
    const { signatureId, category, voterId } = req.body

    if (!signatureId || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['signatureId', 'category']
      })
    }

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name')
      .eq('signature_id', signatureId)
      .single()

    if (agentError || !agent) {
      return res.status(404).json({ 
        error: 'Agent signature not found',
        signatureId 
      })
    }

    if (voterId) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('agent_id', agent.id)
        .eq('category', category)
        .eq('voter_id', voterId)
        .single()

      if (existingVote) {
        return res.status(409).json({ 
          error: 'Already voted for this signature in this category'
        })
      }
    }

    const { data, error } = await supabase
      .from('votes')
      .insert([
        {
          agent_id: agent.id,
          category,
          voter_id: voterId || null,
          voted_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase vote error:', error)
      return res.status(500).json({ 
        error: 'Failed to submit vote',
        details: error.message 
      })
    }

    return res.status(201).json({
      success: true,
      message: `Vote submitted for ${agent.name}! 🗳️`,
      data: {
        id: data.id,
        agentName: agent.name,
        category,
        votedAt: data.voted_at
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
