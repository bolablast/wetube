const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");
console.log("sdaf");
const handlePlayCLick = (e) => {
  // if the video is playing, pause it
  if (video.paused) {
    playBtn.innerText = "Pause";
    video.play();
  } else {
    playBtn.innerText = "Play";
    video.puased();
  }
  // else play the video
};

const handlePause = () => (playBtn.innerText = "Play");

const handlePlay = () => (playBtn.innerText = "Pause");

const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
