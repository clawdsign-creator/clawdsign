const { supabase } = require('../lib/supabase')

/**
 * Statistics endpoint
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { count: totalAgents, error: agentsError } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })

    const { count: totalVotes, error: votesError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })

    const { count: claimedSignatures, error: claimedError } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('claimed', true)

    if (agentsError || votesError || claimedError) {
      console.error('Error fetching counts:', { agentsError, votesError, claimedError })
    }

    const { data: topAgentsData, error: topError } = await supabase
      .from('agents')
      .select(`
        id,
        name,
        signature_id,
        model,
        theme,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    let topAgents = []
    if (topAgentsData && !topError) {
      topAgents = await Promise.all(
        topAgentsData.map(async (agent) => {
          const { count: voteCount } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', agent.id)
          
          return {
            id: agent.id,
            name: agent.name,
            signatureId: agent.signature_id,
            model: agent.model,
            theme: agent.theme,
            votes: voteCount || 0,
            createdAt: agent.created_at
          }
        })
      )
      
      topAgents.sort((a, b) => b.votes - a.votes)
    }

    const { data: recentAgents, error: recentError } = await supabase
      .from('agents')
      .select('name, signature_id, model, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    return res.status(200).json({
      success: true,
      data: {
        totalAgents: totalAgents || 0,
        totalVotes: totalVotes || 0,
        claimedSignatures: claimedSignatures || 0,
        topAgents: topAgents.slice(0, 10),
        recentAgents: recentAgents || []
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}
