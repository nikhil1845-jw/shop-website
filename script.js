// Change this one phone number to the shop's WhatsApp number, including country code.
const WHATSAPP_PHONE = "917488088041";

// This helper builds a WhatsApp link with a ready-to-send message.
function makeWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

// This helper creates a safe product photo area and replaces missing photos with a gray placeholder.
function makeProductPhoto(product) {
  const photo = document.createElement("div");
  photo.className = "product-card-photo";

  const image = document.createElement("img");
  image.src = `images/${product.folder}/01.jpg`;
  image.alt = product.name;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    photo.classList.add("photo-placeholder");
    image.remove();
    const symbol = document.createElement("span");
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = product.category === "ratan" ? "✦" : "◉";
    photo.append(symbol);
  }, { once: true });
  photo.append(image);
  return photo;
}

// This helper builds a product card from the editable product list.
function makeProductCard(product) {
  const link = document.createElement("a");
  link.className = "product-card";
  link.href = `product.html?id=${encodeURIComponent(product.id)}`;
  link.append(makeProductPhoto(product));

  const details = document.createElement("div");
  details.className = "product-card-details";
  const category = document.createElement("span");
  category.className = "product-card-category";
  category.textContent = product.category === "ratan" ? "RATAN" : "RUDRAKSH";
  const name = document.createElement("h2");
  name.textContent = product.name;
  const price = document.createElement("p");
  price.textContent = product.price;
  const explore = document.createElement("span");
  explore.className = "product-card-link";
  explore.textContent = "View details →";
  details.append(category, name, price, explore);
  link.append(details);
  return link;
}

// This function puts the right category products on each collection page.
function renderProductList() {
  document.querySelectorAll("[data-product-list]").forEach((list) => {
    const category = list.dataset.productList;
    const products = window.SHOP_PRODUCTS.filter((product) => product.category === category);
    if (products.length === 0) {
      list.textContent = "No products are available in this collection yet.";
      return;
    }
    products.forEach((product) => list.append(makeProductCard(product)));
  });
}

// This function loads one product and prepares its spin-photo sequence from the URL id.
function loadProductDetail() {
  const productPage = document.querySelector("[data-product-detail]");
  if (!productPage) return;

  const productId = new URLSearchParams(window.location.search).get("id");
  const product = window.SHOP_PRODUCTS.find((item) => item.id === productId);
  if (!product) {
    document.querySelector("[data-product-name]").textContent = "Product not found";
    document.querySelector("[data-product-category]").textContent = "COLLECTION";
    document.querySelector("[data-product-price]").textContent = "";
    document.querySelector("[data-product-description]").textContent = "This product link may be out of date. Browse our collections to find another item.";
    document.querySelector("[data-product-whatsapp]").hidden = true;
    document.querySelector("[data-spin-viewer]").hidden = true;
    document.querySelector(".spin-controls").hidden = true;
    document.title = "Product not found | Rangoli Pujan Bhandar";
    return;
  }

  document.title = `${product.name} | Rangoli Pujan Bhandar`;
  document.querySelector("[data-product-name]").textContent = product.name;
  document.querySelector("[data-product-category]").textContent = product.category === "ratan" ? "RATAN / GEMSTONE" : "RUDRAKSH";
  document.querySelector("[data-product-price]").textContent = product.price;
  document.querySelector("[data-product-description]").textContent = product.description;
  document.querySelector("[data-product-whatsapp]").href = makeWhatsAppUrl(`Hello, I would like to know more about ${product.name}.`);
  initSpinViewer(product);
}

// This viewer preloads numbered images and supports touch, mouse, buttons, and auto-rotation.
function initSpinViewer(product) {
  const viewer = document.querySelector("[data-spin-viewer]");
  const controls = document.querySelector(".spin-controls");
  const image = viewer.querySelector("[data-spin-image]");
  const placeholder = viewer.querySelector("[data-spin-placeholder]");
  const loading = viewer.querySelector("[data-spin-loading]");
  const imageCount = Math.max(0, Number.parseInt(product.spinImages, 10) || 0);
  const frames = Array.from({ length: imageCount }, (_, index) => {
    const frameNumber = String(index + 1).padStart(2, "0");
    const frame = new Image();
    frame.src = `images/${product.folder}/${frameNumber}.jpg`;
    return frame;
  });
  let currentFrame = 0;
  let dragStartX = null;
  let autoRotateTimer = null;

  // This displays a loaded photo or the gray placeholder when that frame is missing.
  function showFrame(index) {
    if (frames.length === 0) {
      image.hidden = true;
      placeholder.hidden = false;
      return;
    }
    currentFrame = (index + frames.length) % frames.length;
    const frame = frames[currentFrame];
    if (frame.complete && frame.naturalWidth > 0) {
      image.src = frame.src;
      image.alt = `${product.name}, view ${currentFrame + 1} of ${frames.length}`;
      image.hidden = false;
      placeholder.hidden = true;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      placeholder.hidden = false;
    }
  }

  // This waits for every requested photo, while missing files remain valid placeholders.
  const preloadComplete = Promise.all(frames.map((frame) => new Promise((resolve) => {
    if (frame.complete) {
      resolve();
    } else {
      frame.addEventListener("load", resolve, { once: true });
      frame.addEventListener("error", resolve, { once: true });
    }
  })));
  showFrame(0);
  preloadComplete.then(() => {
    loading.hidden = true;
    showFrame(0);
  });

  // These controls let a shopper rotate the image without dragging.
  controls.querySelector("[data-spin-prev]").addEventListener("click", () => showFrame(currentFrame - 1));
  controls.querySelector("[data-spin-next]").addEventListener("click", () => showFrame(currentFrame + 1));
  const autoButton = controls.querySelector("[data-spin-auto]");
  autoButton.addEventListener("click", () => {
    if (autoRotateTimer === null) {
      autoRotateTimer = window.setInterval(() => showFrame(currentFrame + 1), 180);
      autoButton.textContent = "Stop auto-rotate";
      autoButton.setAttribute("aria-pressed", "true");
    } else {
      window.clearInterval(autoRotateTimer);
      autoRotateTimer = null;
      autoButton.textContent = "Start auto-rotate";
      autoButton.setAttribute("aria-pressed", "false");
    }
  });

  // This changes the displayed view as the shopper drags with a mouse or finger.
  viewer.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    dragStartX = event.clientX;
    viewer.setPointerCapture(event.pointerId);
  });
  viewer.addEventListener("pointermove", (event) => {
    if (dragStartX === null) return;
    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) >= 12) {
      showFrame(currentFrame + (distance < 0 ? 1 : -1));
      dragStartX = event.clientX;
    }
  });
  const finishDragging = () => { dragStartX = null; };
  viewer.addEventListener("pointerup", finishDragging);
  viewer.addEventListener("pointercancel", finishDragging);
}

// This starts the parts of the page that are needed on the current HTML file.
document.addEventListener("DOMContentLoaded", () => {
  renderProductList();
  loadProductDetail();
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const homeWhatsApp = document.querySelector(".hero .button-gold");
  if (homeWhatsApp) homeWhatsApp.href = makeWhatsAppUrl("Hello, I would like to know more about your collection.");
});
