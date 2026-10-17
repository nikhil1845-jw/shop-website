# Rangoli Pujan Bhandar

A responsive, static shop website for two collections only: Ratan (gemstones) and Rudraksh. It uses plain HTML, CSS, and JavaScript, and works without a backend or build step.

## Run it with Live Server

1. Open this folder in Visual Studio Code.
2. Install the free **Live Server** extension if you do not already have it.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Browse the Ratan and Rudraksh collections, then open a product to try its spin viewer.

You can also open `index.html` directly in a browser. Live Server is useful while editing because it refreshes the page when files change.

## Change the WhatsApp number and shop details

- In `script.js`, change `WHATSAPP_PHONE` near the top to the shop number, including the country code, with digits only. For example, an Indian number begins with `91`.
- Update the address, opening times, and phone placeholders in the footer of `index.html`, `ratan.html`, `rudraksh.html`, and `product.html`.

The home page and product pages build WhatsApp links from the number in `script.js`.

## Add a product

1. Open `products.js` and copy an existing product object.
2. Give the new product a unique URL-friendly `id`, a `name`, and a `category` of either `ratan` or `rudraksh`.
3. Set its `price` (or leave it as `"Price on request"`), `description`, and a unique `folder` name.
4. Set `spinImages` to the number of photos you plan to provide. The viewer expects sequential names such as `01.jpg`, `02.jpg`, and so on.
5. Create `images/<folder>/` and add the product's photos there. The collection cards and product detail page will use this data automatically.

The sample products already have folders in `images/`; they are empty until you add product photos. Missing photos are shown as gray placeholders instead of broken images.

## Add spin photos

For a product whose `folder` is `ruby`, put its photos here:

```text
images/
└── ruby/
    ├── 01.jpg
    ├── 02.jpg
    ├── 03.jpg
    └── ... continue up to the product's spinImages count
```

Use JPG photos with the same framing and lighting, photographed at evenly spaced angles around the product. The viewer preloads the sequence and supports dragging, previous/next buttons, and auto-rotation. If a photo is missing, the viewer shows a placeholder for that angle.

## Publish on GitHub Pages

1. Create a GitHub repository and upload all the files and the `images` folder, keeping the folder structure unchanged.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing the site and the `/ (root)` folder, then save.
5. Wait for GitHub Pages to publish, then open the Pages URL shown in Settings.

All links and image paths are relative, so the site works when hosted at the root of a GitHub Pages project site. Keep filenames and paths letter-for-letter consistent; GitHub Pages hosting is case-sensitive.
