export default async function handler(req, res) {

  try {

    const url =
      `https://vizey.net/api/v1/list?apikey=${process.env.API_KEY}&page=1`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0",
        "Accept":
          "application/json"
      }
    });

    const text =
      await response.text();

    res.status(200).send(text);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}
