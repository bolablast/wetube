const likeIcon = document.getElementById("likeIcon");
const dislikeIcon = document.getElementById("dislikeIcon");
const likeSpan = document.getElementById("likeNumber");
const dislikeSpan = document.getElementById("dislikeNumber");
const videoId = document.getElementById("videoContainer").dataset.id;
let likeNumber = parseInt(likeSpan.innerText);
let dislikeNumber = parseInt(dislikeSpan.innerText);

const handleLike = async () => {
  if (dislikeIcon.classList.contains("fas")) {
    dislikeIcon.classList.add("far");
    dislikeIcon.classList.remove("fas");
    dislikeNumber = dislikeNumber - 1;
    dislikeSpan.innerText = dislikeNumber;
    await fetch(`/api/videos/${videoId}/dislike/down`, {
      method: "POST",
    });
    console.log("싫어요 내림");
  }
  likeIcon.classList.toggle("far");
  likeIcon.classList.toggle("fas");
  if (likeIcon.classList.contains("fas")) {
    likeNumber = likeNumber + 1;
    likeSpan.innerText = likeNumber;
    await fetch(`/api/videos/${videoId}/like/up`, {
      method: "POST",
    });
    console.log("좋아요 오름");
  } else if (likeIcon.classList.contains("far")) {
    likeNumber = likeNumber - 1;
    likeSpan.innerText = likeNumber;
    await fetch(`/api/videos/${videoId}/like/down`, {
      method: "POST",
    });
    console.log("좋아요 내림");
  }
};

const handleDislike = async () => {
  if (likeIcon.classList.contains("fas")) {
    likeIcon.classList.add("far");
    likeIcon.classList.remove("fas");
    likeNumber = likeNumber - 1;
    likeSpan.innerText = likeNumber;
    await fetch(`/api/videos/${videoId}/like/down`, {
      method: "POST",
    });
    console.log("좋아요 내림");
  }
  dislikeIcon.classList.toggle("far");
  dislikeIcon.classList.toggle("fas");
  if (dislikeIcon.classList.contains("fas")) {
    dislikeNumber = dislikeNumber + 1;
    dislikeSpan.innerText = dislikeNumber;
    await fetch(`/api/videos/${videoId}/dislike/up`, {
      method: "POST",
    });
    console.log("싫어요 올림");
  } else {
    dislikeNumber = dislikeNumber - 1;
    dislikeSpan.innerText = dislikeNumber;
    await fetch(`/api/videos/${videoId}/dislike/down`, {
      method: "POST",
    });
    console.log("싫어요 내림");
  }
};

likeIcon.addEventListener("click", handleLike);
dislikeIcon.addEventListener("click", handleDislike);
