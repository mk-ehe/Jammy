const container = document.getElementById("container");
const bgVideo = document.getElementById("bg-video");

let activeBtn = null;
let activeSongElement = null;

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

fetch("songs.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(song => {
            const songElement = document.createElement("div");
            songElement.classList.add("song-card");

            songElement.innerHTML = `
                <img class="cover" src="${song.cover_img}">
                <div class="song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <span class="duration">${formatTime(song.duration)}</span>
            `;

            const playBtn = document.createElement("button");
            playBtn.classList.add("play-btn");
            playBtn.textContent = "▶";
            bgVideo.volume = .2;
            
            if (song.main_color) {
                songElement.style.setProperty("--active-color", song.main_color+"4f");
                songElement.style.setProperty("--active-color-hover", song.main_color+"63");
            }

            playBtn.addEventListener("click", () => {
                const isNewSong = !bgVideo.src.includes(song.video_file);

                if (isNewSong) {
                    if (activeBtn) {
                        activeBtn.textContent = "▶";
                        playBtn.style.paddingBottom = "5px";
                        activeSongElement.classList.remove("active-card");
                    }

                    bgVideo.src = song.video_file;
                    bgVideo.style.display = "block";
                    bgVideo.play();
                    
                    playBtn.textContent = "⏸";
                    playBtn.style.paddingBottom = "9px";
                    
                    activeBtn = playBtn;
                    activeSongElement = songElement;
                    activeSongElement.classList.add("active-card");

                    container.style.setProperty("--main-color", song.main_color+"af");
                    container.style.setProperty("--main-color-hover", song.main_color);

                } else {
                    if (bgVideo.paused) {
                        bgVideo.play();
                        playBtn.textContent = "⏸";
                        playBtn.style.paddingBottom = "9px";
                    } else {
                        bgVideo.pause();
                        playBtn.textContent = "▶";
                        playBtn.style.paddingBottom = "5px";
                    }   
                    activeBtn = playBtn;
                }
            });
            songElement.addEventListener("dblclick", () => {
                playBtn.click();
            })

            songElement.appendChild(playBtn); 
            container.appendChild(songElement);
        });
        });
