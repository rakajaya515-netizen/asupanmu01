const grid =
document.getElementById("videoGrid");

const searchInput =
document.getElementById("searchInput");

const loadingText =
document.getElementById("loading");

let loading = false;

let allVideos = [];

// simpan ID agar tidak duplikat
const loadedIds = new Set();

async function loadVideos() {

  if (loading) return;

  loading = true;

  loadingText.style.display = "block";

  try {

    // random cache breaker
    const random =
    Math.floor(Math.random() * 999999);

    const res = await fetch(
      `/api/videos?rand=${random}`
    );

    const json = await res.json();

    let videos = json.data || [];

    // acak video
    videos = shuffle(videos);

    // filter duplicate
    const uniqueVideos =
    videos.filter(video => {

      if (loadedIds.has(video.id)) {
        return false;
      }

      loadedIds.add(video.id);

      return true;

    });

    // simpan semua
    allVideos.push(...uniqueVideos);

    appendVideos(uniqueVideos);

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
        />

        <div class="overlay">
          <h3>${video.title}</h3>
        </div>

      </a>
    `;

    grid.appendChild(card);

  });

}

// random shuffle
function shuffle(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
    Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
    [array[j], array[i]];

  }

  return array;

}

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

// load pertama
loadVideos();
