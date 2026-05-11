export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${process.env.API_KEY}&page=1`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    // cache ringan
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
