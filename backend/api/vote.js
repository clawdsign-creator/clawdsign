const { supabase } = require('../lib/supabase')

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
      .select('id')
      .eq('signature_id', signatureId)
      .single()

    if (agentError || !agent) {
      return res.status(404).json({ error: 'Signature not found' })
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
        return res.status(409).json({ error: 'Already voted for this signature' })
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
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Failed to submit vote',
        details: error.message 
      })
    }

    await supabase.rpc('increment_counter', { counter_name: 'total_votes' })

    return res.status(201).json({
      success: true,
      message: 'Vote submitted successfully',
      data: {
        id: data.id,
        votedAt: data.voted_at
      }
    })

  } catch (error) {
    console.error('Error submitting vote:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}
