const container = document.getElementById("container");
const bgVideo = document.getElementById("bg-video");
const hideBtn = document.getElementById('hide-btn');
const player = document.getElementById("player");
const warningContainer = document.getElementById("warning-container");
const warningHeader = document.getElementById("warning-header");
const warningDesc = document.getElementById("warning-desc");
const continueBtn = document.getElementById("continue-btn");

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
            
            if (song.main_color) {
                songElement.style.setProperty("--active-color", song.main_color+"30");
                songElement.style.setProperty("--active-color-hover", song.main_color+"4c");
                songElement.style.setProperty("--main-color-border", song.main_color);
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

                    if (song.main_color) {
                        container.style.setProperty("--main-color", song.main_color+"af");
                        container.style.setProperty("--main-color-hover", song.main_color);
                        hideBtn.style.setProperty("--main-color", song.main_color)
                        hideBtn.style.setProperty("--main-color-hover", song.main_color+"30")
                        player.style.setProperty("--active-color", song.main_color+"a4")
                        player.style.setProperty("--active-color-hover", song.main_color)
                    }
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
                if (activeSongElement === songElement) {
                    bgVideo.currentTime = 0;
                    bgVideo.play();
                    playBtn.textContent = "⏸";
                } else {
                    playBtn.click();
                }
            })
            songElement.appendChild(playBtn); 
            container.appendChild(songElement);
        });

        bgVideo.volume = .25;

        hideBtn.addEventListener("click", () => {
            container.classList.toggle("hidden");
            bgVideo.classList.toggle("video-bg-undimmed")
            if (container.classList.contains("hidden")) {
                hideBtn.textContent = "show";
            } else {
                hideBtn.textContent = "hide";
            }   
        });

        setTimeout(() => {
            warningHeader.classList.add("showing-up-trasition");
        },500)
        setTimeout(() => {
            warningDesc.classList.add("showing-up-trasition");
        }, 1500)
        setTimeout(() => {
            continueBtn.classList.add("showing-up-trasition");
        }, 3500)

        continueBtn.addEventListener('click', () => {
            warningContainer.classList.add("warning-container-hidden");

            const allButtons = document.querySelectorAll('.play-btn');
            if (allButtons.length > 0) {
                const randomIndex = Math.floor(Math.random() * allButtons.length);
                const randomBtn = allButtons[randomIndex];

                randomBtn.click();
                randomBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        })
    });