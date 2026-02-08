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

function playSong(song, playBtn, songElement) {
    if (song.volume) {
        bgVideo.volume = song.volume;
    } else {
        bgVideo.volume = .28;
    }
    const isNewSong = !bgVideo.src.includes(song.video_file);

    if (isNewSong) {
        if (activeBtn) {
            activeBtn.textContent = "▶";
            activeSongElement.classList.remove("active-card");
        }

        bgVideo.src = song.video_file;
        bgVideo.style.display = "block";
        bgVideo.play();
        
        playBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="padding-top: 2px">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
        `;
        
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
            playBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="padding-top: 2px">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
            `;
        } else {
            bgVideo.pause();
            playBtn.textContent = "▶";
        }   
        activeBtn = playBtn;
    }
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
            playBtn.tabIndex = -1;
            playBtn.classList.add("play-btn");
            playBtn.textContent = "▶";
            
            if (song.main_color) {
                songElement.style.setProperty("--active-color", song.main_color+"30");
                songElement.style.setProperty("--active-color-hover", song.main_color+"4c");
                songElement.style.setProperty("--main-color-border", song.main_color);
            }

            playBtn.addEventListener("click", () => {
                playSong(song, playBtn, songElement);
            });

            playBtn.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                playBtn.click();
            })

            songElement.addEventListener("dblclick", () => {
                if (activeSongElement === songElement) {
                    bgVideo.currentTime = 0;
                    bgVideo.play();
                    playBtn.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="padding-top: 2px">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    `;
                } else {
                    playBtn.click();
                }
            })
            songElement.appendChild(playBtn); 
            container.appendChild(songElement);
        });

        continueBtn.addEventListener('click', () => {
            warningContainer.classList.add("warning-container-hidden");

            const allButtons = document.querySelectorAll('.song-card .play-btn');
            if (allButtons.length > 0) {
                const randomIndex = Math.floor((Math.random() * allButtons.length));
                const randomBtn = allButtons[randomIndex];
                randomBtn.click();
                randomBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });


const iconEyeOpen = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
</svg>`;

const iconEyeClosed = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.15C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.27,4.75 8.07,5.27L10.08,7.29C10.65,7.11 11.29,7 12,7Z" />
</svg>`;

hideBtn.addEventListener("click", () => {
    container.classList.toggle("hidden");
    bgVideo.classList.toggle("video-bg-undimmed")
    if (container.classList.contains("hidden")) {
        hideBtn.innerHTML = iconEyeOpen;
    } else {
        hideBtn.innerHTML = iconEyeClosed;
    }   
});

setTimeout(() => {warningHeader.classList.add("showing-up-trasition");}, 500)
setTimeout(() => {warningDesc.classList.add("showing-up-trasition");}, 1500)
setTimeout(() => {continueBtn.classList.add("showing-up-trasition");}, 3500)