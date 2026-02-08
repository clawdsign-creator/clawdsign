const { supabase } = require('../lib/supabase')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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
      throw new Error('Failed to fetch stats')
    }

    const { data: topAgents, error: topError } = await supabase
      .from('agents')
      .select(`
        id,
        name,
        signature_id,
        model,
        theme,
        votes:votes(count)
      `)
      .order('votes.count', { ascending: false })
      .limit(10)

    return res.status(200).json({
      success: true,
      data: {
        totalAgents: totalAgents || 0,
        totalVotes: totalVotes || 0,
        claimedSignatures: claimedSignatures || 0,
        topAgents: topAgents || []
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}
