const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const response = await axios.get(
      `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}`
    );

    res.setHeader(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=600'
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed fetch video',
      error: error.message
    });
  }
};
