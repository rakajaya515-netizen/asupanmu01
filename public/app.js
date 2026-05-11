const grid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");

let allVideos = [];

async function loadVideos() {

  try {

    const res = await fetch("/api/videos");

    const json = await res.json();

    allVideos = json.data || [];

    renderVideos(allVideos);

  } catch(err) {

    console.log(err);

  }
}

function renderVideos(videos){

  grid.innerHTML = "";

  videos.forEach(video => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a href="${video.url}" target="_blank">
        <img src="${video.thumbnail}" loading="lazy"/>
        <div class="overlay">
          <h3>${video.title}</h3>
        </div>
      </a>
    `;

    grid.appendChild(card);

  });

}

searchInput.addEventListener("input", (e)=>{

  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);

});

loadVideos();
