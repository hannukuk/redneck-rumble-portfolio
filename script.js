document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", () => { }));

const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeButton = document.querySelector(".lightbox-close");

let scale = 1;
let panX = 0;
let panY = 0;
let dragging = false;
let startX = 0;
let startY = 0;

function updateImageTransform() {
  lightboxImage.style.transform =
    `translate(${panX}px, ${panY}px) scale(${scale})`;
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
}

document.querySelectorAll(".zoomable-image").forEach((image) => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.dataset.full || image.src;
    lightboxImage.alt = image.alt;

    scale = 1;
    panX = 0;
    panY = 0;
    updateImageTransform();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

lightboxImage.addEventListener("wheel", (event) => {
  event.preventDefault();

  scale = Math.min(8, Math.max(1, scale * (event.deltaY < 0 ? 1.2 : 1 / 1.2)));
  updateImageTransform();
}, { passive: false });

lightboxImage.addEventListener("pointerdown", (event) => {
  dragging = true;
  startX = event.clientX - panX;
  startY = event.clientY - panY;
  lightboxImage.setPointerCapture(event.pointerId);
});

lightboxImage.addEventListener("pointermove", (event) => {
  if (!dragging) return;

  panX = event.clientX - startX;
  panY = event.clientY - startY;
  updateImageTransform();
});

lightboxImage.addEventListener("pointerup", () => {
  dragging = false;
});

lightboxImage.addEventListener("pointercancel", () => {
  dragging = false;
});

closeButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});