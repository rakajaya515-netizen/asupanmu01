const grid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");

let allVideos = [];
let visible = 20;

async function loadVideos() {

  try {

    const res = await fetch("/api/videos");

    const json = await res.json();

    allVideos = json.data || [];

    renderVideos();

  } catch(err) {

    console.log(err);

  }

}

function renderVideos(filter = "") {

  grid.innerHTML = "";

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(filter)
  );

  filtered.slice(0, visible).forEach(video => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a href="${video.url}" target="_blank">

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

searchInput.addEventListener("input", e => {

  renderVideos(e.target.value.toLowerCase());

});

window.addEventListener("scroll", () => {

  if (
    window.innerHeight + window.scrollY
    >= document.body.offsetHeight - 500
  ) {

    visible += 20;

    renderVideos(
      searchInput.value.toLowerCase()
    );

  }

});

loadVideos();
