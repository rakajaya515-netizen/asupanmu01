export default async function handler(req, res) {

  try {

    const page =
      Number(req.query.page || 1);

    let allVideos = [];

    // ======================
    // VIZEY
    // ======================

    const vizeyRes = await fetch(
      `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}&limit=12`
    );

    const vizeyJson =
      await vizeyRes.json();

    const vizeyVideos =
      (vizeyJson.data || []).map(v => ({

        id: `vz_${v.id}`,

        title: v.title,

        thumbnail:
          v.thumbnail ||
          "https://via.placeholder.com/300x450?text=Asupanmu",

        watch:
          `https://v1deeyy.click/e/${v.id}`,

        source: "VIZEY",

        createdAt:
          new Date(v.createdAt || 0).getTime()

      }));

    allVideos.push(...vizeyVideos);

    // ======================
    // DOOD
    // ======================

    const doodRes = await fetch(
      `https://doodapi.co/api/file/list?key=${process.env.DOOD_API_KEY}&page=${page}`
    );

    const doodJson =
      await doodRes.json();

    const doodVideos =
      (doodJson.result?.files || []).map(v => ({

        id: `dd_${v.file_code}`,

        title:
          v.title || "Untitled",

        thumbnail:
          v.splash_img ||
          "https://via.placeholder.com/300x450?text=DOOD",

        watch:
          `https://dood.so/e/${v.file_code}`,

        source: "DOOD",

        createdAt:
          new Date(v.uploaded || 0).getTime()

      }));

    allVideos.push(...doodVideos);

    // ======================
    // HAPUS DUPLIKAT
    // ======================

    const uniqueVideos =
      Array.from(

        new Map(
          allVideos.map(v => [v.id, v])
        ).values()

      );

    // ======================
    // SORT TERBARU
    // ======================

    uniqueVideos.sort(
      (a,b) => b.createdAt - a.createdAt
    );

    // ======================
    // CACHE
    // ======================

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    res.status(200).json(uniqueVideos);

  } catch(err){

    res.status(500).json({
      error: err.message
    });

  }

}
