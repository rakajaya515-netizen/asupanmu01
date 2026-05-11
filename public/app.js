const grid =
document.getElementById("videoGrid");

const searchInput =
document.getElementById("searchInput");

const loadingText =
document.getElementById("loading");

let loading = false;

// semua video unik
let allVideos = [];

// simpan ID video
const loadedIds = new Set();

// simpan cache browser
const STORAGE_KEY = "ASUPANMU_VIDEOS";

// load cache awal
const cached =
JSON.parse(
  localStorage.getItem(STORAGE_KEY)
) || [];

cached.forEach(v => {

  loadedIds.add(v.id);

});

allVideos = cached;

// tampilkan cache dulu
appendVideos(allVideos);

// auto load video baru
loadVideos();

async function loadVideos() {

  if (loading) return;

  loading = true;

  loadingText.style.display = "block";

  try {

    // spam request berbeda
    for (let i = 1; i <= 10; i++) {

      const random =
        Date.now() + "_" + i;

      const res = await fetch(
        `/api/videos?page=${i}&r=${random}`
      );

      const json = await res.json();

      let videos = json.data || [];

      // acak
      videos = shuffle(videos);

      // filter video baru
      const uniqueVideos =
      videos.filter(video => {

        if (
          loadedIds.has(video.id)
        ) {
          return false;
        }

        loadedIds.add(video.id);

        return true;

      });

      // simpan
      allVideos.push(...uniqueVideos);

      // tampilkan
      appendVideos(uniqueVideos);

    }

    // cache browser
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(allVideos)
    );

  } catch(err) {

    console.log(err);

  }

  loadingText.style.display = "none";

  loading = false;

}

function appendVideos(videos) {

  videos.forEach(video => {

    const card =
    document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a
        href="${video.url}"
        target="_blank"
      >

        <img
          src="${video.thumbnail}"
          loading="lazy"
          alt="${video.title}"
        />

        <div class="overlay">
          <h3>${video.title}</h3>
        </div>

      </a>
    `;

    grid.appendChild(card);

  });

}

// search realtime
searchInput.addEventListener(
  "input",
  e => {

    const keyword =
    e.target.value.toLowerCase();

    grid.innerHTML = "";

    const filtered =
    allVideos.filter(v =>
      v.title
      .toLowerCase()
      .includes(keyword)
    );

    appendVideos(filtered);

  }
);

// infinite scroll
window.addEventListener(
  "scroll",
  () => {

    if (
      window.innerHeight +
      window.scrollY >=
      document.body.offsetHeight - 700
    ) {

      loadVideos();

    }

  }
);

// random shuffle
function shuffle(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [array[i], array[j]] =
    [array[j], array[i]];

  }

  return array;

}
