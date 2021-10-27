const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtn = document.querySelectorAll(".del");
const editBtn = document.querySelectorAll(".edit");
let value;
const handleDelete = async (event) => {
  const target = event.target.parentNode.parentNode.parentNode.parentNode;
  const videoId = videoContainer.dataset.id;
  const commentId = target.dataset.id;
  await fetch(`/api/videos/${videoId}/comment/${commentId}/delete`);
  target.remove();
};

delBtn.forEach((item) => item.addEventListener("click", handleDelete));

const handleEditSubmit = async (target, before, input) => {
  console.log(target);
  const data = target.dataset.id;
  const videoId = videoContainer.dataset.id;
  value = input.value;
  target.innerHTML = before;
  if (value == "") {
    value = target.querySelector(".text").innerText;
  }
  const delBtn = target.querySelector(".del");
  const editBtn = target.querySelector(".edit");
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
  delBtn.addEventListener("click", handleDelete);
  editBtn.addEventListener("click", handleEdit);
};
const handleEdit = (event) => {
  const parent = event.target.parentNode.parentNode.parentNode.parentNode;
  const before = parent.innerHTML;
  const form = document.createElement("form");
  const textInput = document.createElement("input");
  textInput.type = "text";
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
    event.preventDefault();
    handleEditSubmit(parent, before, textInput);
  });
  returnBtn.addEventListener("click", () => {
    handleEditReturn(parent, before);
  });
};

editBtn.forEach((item) => item.addEventListener("click", handleEdit));

const addComment = (text, id, url, username) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const img = document.createElement("img");
  img.src = url;
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
  newComment.appendChild(img);
  newComment.appendChild(infoDiv);
  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit edit";
  mainBtnDiv.appendChild(delBtn);
  mainBtnDiv.appendChild(editIcon);
  mainDiv.appendChild(mainTextDiv);
  mainDiv.appendChild(mainBtnDiv);
  mainTextDiv.appendChild(textSpan);
  infoDiv.appendChild(mainDiv);
  videoComments.prepend(newComment);
  delBtn.addEventListener("click", handleDelete);
  editIcon.addEventListener("click", handleEdit);
};

const handleSubmit = async (event) => {
  const url = event.target.dataset.url;
  const username = event.target.dataset.username;
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
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
    addComment(text, newCommentId, url, username);
    textarea.value = "";
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
