export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.vidara.com/videos", {
      headers: {
        Authorization: "Bearer " + process.env.API_KEY
      }
    });

    const text = await response.text();

    res.status(200).json({
      status: response.status,
      body: text
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
