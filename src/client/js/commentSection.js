const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtn = document.querySelectorAll(".del");
const editBtn = document.querySelectorAll(".edit");
const like = document.querySelectorAll(".likeCommentIcon");
const dislike = document.querySelectorAll(".dislikeCommentIcon");

const handleCommentLike = async (event) => {
  const videoId = videoContainer.dataset.id;
  const parent = event.target.parentNode;
  const commentId = parent.parentNode.parentNode.dataset.id;
  const likeIcon = parent.querySelector(".likeCommentIcon");
  const dislikeIcon = parent.querySelector(".dislikeCommentIcon");
  const likeSpan = parent.querySelector(".likeCommentNumber");
  const dislikeSpan = parent.querySelector(".dislikeCommentNumber");
  const likeClassList = likeIcon.classList;
  const dislikeClassList = dislikeIcon.classList;
  let likeNumber = parseInt(likeSpan.innerText);
  let dislikeNumber = parseInt(dislikeSpan.innerText);
  likeClassList.toggle("fas");
  likeClassList.toggle("far");
  if (dislikeClassList.contains("fas")) {
    dislikeClassList.remove("fas");
    dislikeClassList.add("far");
    dislikeNumber = dislikeNumber - 1;
    dislikeSpan.innerText = dislikeNumber;
    await fetch(`/api/videos/${videoId}/comment/${commentId}/dislike/down`, {
      method: "POST",
    });
    console.log("댓글 싫어요 내림");
  }
  if (likeClassList.contains("fas")) {
    likeNumber = likeNumber + 1;
    likeSpan.innerText = likeNumber;
    await fetch(`/api/videos/${videoId}/comment/${commentId}/like/up`, {
      method: "POST",
    });
    console.log("댓글 좋아요 올림");
  } else {
    likeNumber = likeNumber - 1;
    likeSpan.innerText = likeNumber;
    await fetch(`/api/videos/${videoId}/comment/${commentId}/like/down`, {
      method: "POST",
    });
    console.log("댓글 좋아요 내림");
  }
};

const handleCommentDislike = async (event) => {
  const videoId = videoContainer.dataset.id;
  const parent = event.target.parentNode;
  const commentId = parent.parentNode.parentNode.dataset.id;
  const likeIcon = parent.querySelector(".likeCommentIcon");
  const dislikeIcon = parent.querySelector(".dislikeCommentIcon");
  const likeSpan = parent.querySelector(".likeCommentNumber");
  const dislikeSpan = parent.querySelector(".dislikeCommentNumber");
  const likeClassList = likeIcon.classList;
  const dislikeClassList = dislikeIcon.classList;
  let likeNumber = parseInt(likeSpan.innerText);
  let dislikeNumber = parseInt(dislikeSpan.innerText);
  dislikeClassList.toggle("fas");
  dislikeClassList.toggle("far");
  if (likeClassList.contains("fas")) {
    likeClassList.remove("fas");
    likeClassList.add("far");
    likeNumber = likeNumber - 1;
    likeSpan.innerText = likeNumber;
    await fetch(`/api/videos/${videoId}/comment/${commentId}/like/down`, {
      method: "POST",
    });
    console.log("댓글 좋아요 내림");
  }
  if (dislikeClassList.contains("fas")) {
    dislikeNumber = dislikeNumber + 1;
    dislikeSpan.innerText = dislikeNumber;
    await fetch(`/api/videos/${videoId}/comment/${commentId}/dislike/up`, {
      method: "POST",
    });
    console.log("댓글 싫어요 올림");
  } else {
    dislikeNumber = dislikeNumber - 1;
    dislikeSpan.innerText = dislikeNumber;
    await fetch(`/api/videos/${videoId}/comment/${commentId}/dislike/down`, {
      method: "POST",
    });
    console.log("댓글 싫어요 내림");
  }
};

like.forEach((item) => item.addEventListener("click", handleCommentLike));
dislike.forEach((item) => item.addEventListener("click", handleCommentDislike));

let value;

const handleDelete = async (event) => {
  const target = event.target.parentNode.parentNode.parentNode.parentNode;
  const videoId = videoContainer.dataset.id;
  const commentId = target.dataset.id;
  await fetch(`/api/videos/${videoId}/comment/${commentId}/delete`, {
    method: "DELETE",
  });
  target.remove();
};

delBtn.forEach((item) => item.addEventListener("click", handleDelete));

const handleEditSubmit = async (target, before, input) => {
  const data = target.dataset.id;
  const videoId = videoContainer.dataset.id;
  value = input.value;
  target.innerHTML = before;
  target.classList.add("edit");
  const span = document.createElement("span");
  span.innerText = "(수정됨)";
  span.classList.add("edited");
  if (
    document
      .querySelector(".edit")
      .querySelector(".video__comment_owner")
      .querySelector(".edited")
  ) {
    document
      .querySelector(".edit")
      .querySelector(".video__comment_owner")
      .querySelector(".edited")
      .remove();
  }
  document
    .querySelector(".edit")
    .querySelector(".video__comment_owner")
    .appendChild(span);
  if (value == "") {
    value = target.querySelector(".text").innerText;
  }
  const delBtn = target.querySelector(".del");
  const editBtn = target.querySelector(".edit");
  const likeIcon = target.querySelector(".likeCommentIcon");
  const dislikeIcon = target.querySelector(".dislikeCommentIcon");
  likeIcon.addEventListener("click", handleCommentLike);
  dislikeIcon.addEventListener("click", handleCommentDislike);
  delBtn.addEventListener("click", handleDelete);
  editBtn.addEventListener("click", handleEdit);
  target.querySelector(".text").innerText = value;
  await fetch(`/api/videos/${videoId}/comment/${data}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
};

const handleEditReturn = (target, before) => {
  target.innerHTML = "";
  target.innerHTML = before;
  const delBtn = target.querySelector(".del");
  const editBtn = target.querySelector(".edit");
  const likeIcon = target.querySelector(".likeCommentIcon");
  const dislikeIcon = target.querySelector(".dislikeCommentIcon");
  likeIcon.addEventListener("click", handleCommentLike);
  dislikeIcon.addEventListener("click", handleCommentDislike);
  delBtn.addEventListener("click", handleDelete);
  editBtn.addEventListener("click", handleEdit);
};
const handleEdit = (event) => {
  const parent = event.target.parentNode.parentNode.parentNode.parentNode;
  const before = parent.innerHTML;
  const form = document.createElement("form");
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = parent.querySelector(".text").innerText;
  const submitInput = document.createElement("input");
  submitInput.type = "submit";
  submitInput.value = "✅";
  const returnBtn = document.createElement("span");
  returnBtn.innerText = "❌";
  form.appendChild(textInput);
  form.appendChild(submitInput);
  form.appendChild(returnBtn);
  parent.innerHTML = "";
  parent.appendChild(form);
  form.addEventListener("submit", (event) => {
    console.log(textInput.value.length);
    if (textInput.value.length > 1200) {
      return alert("1200자 아래로 작성해주세요");
    }
    event.preventDefault();
    handleEditSubmit(parent, before, textInput);
  });
  returnBtn.addEventListener("click", () => {
    handleEditReturn(parent, before);
  });
};

editBtn.forEach((item) => item.addEventListener("click", handleEdit));

const addComment = (text, id, url, username, userId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const a = document.createElement("a");
  a.href = `/users/${userId}`;
  newComment.appendChild(a);
  const img = document.createElement("img");
  img.src = url;
  img.crossOrigin = true;
  a.appendChild(img);
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("video__comment_info");
  const ownerDiv = document.createElement("div");
  ownerDiv.classList.add("video__comment_owner");
  const ownerSpan = document.createElement("span");
  ownerSpan.innerText = username;
  infoDiv.appendChild(ownerDiv);
  ownerDiv.appendChild(ownerSpan);
  const timeSpan = document.createElement("span");
  timeSpan.innerText = "방금 전";
  timeSpan.classList.add("video__comment_time");
  ownerDiv.appendChild(timeSpan);
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("video__comment_main");
  const mainTextDiv = document.createElement("div");
  mainTextDiv.classList.add("video__comment_main_text");
  const textSpan = document.createElement("span");
  textSpan.classList.add("text");
  textSpan.innerText = text;
  const mainBtnDiv = document.createElement("div");
  mainBtnDiv.classList.add("video__comment_main_btn");
  const delBtn = document.createElement("span");
  delBtn.innerText = "❌";
  delBtn.className = "del";
  newComment.appendChild(infoDiv);
  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit edit";
  const likeDiv = document.createElement("div");
  const likeSpan = document.createElement("span");
  likeSpan.innerText = 0;
  likeSpan.classList.add("likeCommentNumber");
  const likeIcon = document.createElement("i");
  likeIcon.classList.add("far");
  likeIcon.classList.add("fa-thumbs-up");
  likeIcon.classList.add("fa-x");
  likeIcon.classList.add("likeCommentIcon");
  const dislikeSpan = document.createElement("span");
  dislikeSpan.innerText = 0;
  dislikeSpan.classList.add("dislikeCommentNumber");
  const dislikeIcon = document.createElement("i");
  dislikeIcon.classList.add("far");
  dislikeIcon.classList.add("fa-thumbs-down");
  dislikeIcon.classList.add("fa-x");
  dislikeIcon.classList.add("dislikeCommentIcon");
  likeDiv.appendChild(likeIcon);
  likeDiv.appendChild(likeSpan);
  likeDiv.appendChild(dislikeIcon);
  likeDiv.appendChild(dislikeSpan);
  likeIcon.addEventListener("click", handleCommentLike);
  dislikeIcon.addEventListener("click", handleCommentDislike);
  mainBtnDiv.appendChild(delBtn);
  mainBtnDiv.appendChild(editIcon);
  mainDiv.appendChild(mainTextDiv);
  mainDiv.appendChild(mainBtnDiv);
  mainTextDiv.appendChild(textSpan);
  infoDiv.appendChild(mainDiv);
  infoDiv.appendChild(likeDiv);
  videoComments.prepend(newComment);
  delBtn.addEventListener("click", handleDelete);
  editIcon.addEventListener("click", handleEdit);
};

const handleSubmit = async (event) => {
  const userId = event.target.dataset.userid;
  const url = event.target.dataset.url;
  const username = event.target.dataset.username;
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  if (text.length > 1200) {
    return alert("1200자 이내로 작성해주세요");
  }
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId, url, username, userId);
    textarea.value = "";
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
