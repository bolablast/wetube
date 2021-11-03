const sectionContainer = document.querySelector(".typeOfSection");
const videoSection = sectionContainer.querySelector(".typeOfSection_video");
const likeVideoSection = sectionContainer.querySelector(
  ".typeOfSection_likeVideo"
);
const commentSection = sectionContainer.querySelector(".typeOfSection_comment");
const videoDiv = document.querySelector(".video-grid");
const likeVideoDiv = document.querySelector(".likeVideo-grid");
const commentDiv = document.querySelector(".comment-grid");

commentDiv.hidden = true;
likeVideoDiv.classList.add("none");

likeVideoSection.style.backgroundColor = "gainsboro";
commentSection.style.backgroundColor = "gainsboro";
videoSection.addEventListener("click", () => {
  videoDiv.classList.remove("none");
  likeVideoDiv.classList.add("none");
  commentDiv.hidden = true;
  videoSection.style.backgroundColor = "tomato";
  likeVideoSection.style.backgroundColor = "gainsboro";
  commentSection.style.backgroundColor = "gainsboro";
});
likeVideoSection.addEventListener("click", () => {
  videoDiv.classList.add("none");
  likeVideoDiv.classList.remove("none");
  commentDiv.hidden = true;
  videoSection.style.backgroundColor = "gainsboro";
  likeVideoSection.style.backgroundColor = "tomato";
  commentSection.style.backgroundColor = "gainsboro";
});
commentSection.addEventListener("click", () => {
  videoDiv.classList.add("none");
  likeVideoDiv.classList.add("none");
  commentDiv.hidden = false;
  videoSection.style.backgroundColor = "gainsboro";
  likeVideoSection.style.backgroundColor = "gainsboro";
  commentSection.style.backgroundColor = "tomato";
});
