# Where Plates Collide: Philippine Trench Website

An interactive website for **Modeling Earth's Dynamic Processes, Challenge 3 (Philippine
Earthquake)**. It explains the Philippine Trench subduction zone and why the Philippines is so
prone to earthquakes.

**Live site:** https://aguynamedkent7.github.io/Nicho-website/

---

## 1. Opening it on your device

### Easiest way: just open the link
Open **https://aguynamedkent7.github.io/Nicho-website/** in Chrome, Edge or Firefox. It works
on laptops and phones, and you don't need to install anything.

> ⚠️ The site needs **internet**: the map, the 3D model and live earthquake data load online.
> Check the classroom Wi-Fi before presenting. If there's no Wi-Fi, use a phone hotspot.

### Getting your own copy of the files (optional)
Only do this if you want the files on your computer.

**Option A: Download ZIP (no tools needed)**
1. Go to https://github.com/Aguynamedkent7/Nicho-website
2. Click the green **Code** button, then **Download ZIP**, then unzip it.

**Option B: Git**
```bash
git clone https://github.com/Aguynamedkent7/Nicho-website.git
cd Nicho-website
git pull   # run this later to get any updates
```

**Running the files locally:** double-clicking `index.html` will **not** work, because browsers
block the 3D model when a page is opened as a file. Start a small local server in the folder
instead:
```bash
python -m http.server 8000
```
Then open http://localhost:8000. You can also use the "Live Server" extension in VS Code.

---

## 2. Changing the group name

The title slide says **"Presented by Group ___"**. Here's how to change it.

### On the GitHub website (easiest, and it updates the live site)
1. Open https://github.com/Aguynamedkent7/Nicho-website/blob/main/index.html
2. Click the ✏️ **pencil icon** (Edit this file) at the top right.
3. Press `Ctrl + F` and search for `Group ___`. You'll find this line:
   ```html
   <p class="byline">Presented by Group ___</p>
   ```
4. Replace `Group ___` with your group's name and members, for example:
   ```html
   <p class="byline">Presented by Group 3: Juan, Maria, Jose, Ana</p>
   ```
   Only change the text **between** `>` and `</p>`. Don't delete the `<p ...>` tags.
5. Click **Commit changes…**, then **Commit changes** again.
6. Wait about 1–2 minutes and refresh the live site. The new name will appear.

> You need edit access to the repo for this. If you don't have it, ask Kent to add you as a
> collaborator or to make the change.

### On your own copy
Open `index.html` in any text editor (Notepad or VS Code), make the same change and save.
This only changes **your copy**, not the live link.

---

## 3. How to present

1. Open the live site and press **`F`** for fullscreen. Press `F` or `Esc` to exit.
2. Press **`↓`** or **`→`** for the next slide and **`↑`** or **`←`** for the previous one.
   You can also click the dots on the right edge of the screen.
3. Don't use the mouse wheel inside the map, or it will zoom the map instead of scrolling
   the page.

### Slide by slide

| # | Slide | What to do while presenting |
|---|-------|-----------------------------|
| – | **Title** | Introduce the topic and your group. |
| 1 | **Tectonic map** | Click the **thick red line** (Philippine Trench) to show its info card. Click **"▶ Play history"** to watch major earthquakes appear from 1918 to 2025. Tick **"Live quakes"** to show real earthquakes from the last 30 days: yellow = shallow, red = deep. The deep ones sit further west because the sinking plate goes deeper as it moves under the islands. |
| 2 | **3D model** | This is the **main model** for the challenge. It plays automatically. Click the step buttons (1–5) to explain each part: plates converge → stress builds → **earthquake** → **tsunami** → magma and volcanoes. Drag the model to rotate it. Use **Pause** and the slider to stop on a moment. |
| 3 | **Why so many quakes** | This covers the part of the challenge about the Philippines' susceptibility. Go through the numbers and the six reasons. |
| 4 | **Magnitude** | Tap **M4 → M9** on the right to show the house getting more damaged. Press **〰 Shake** to replay the shaking. Key point: each step up is about **32× more energy**. |
| 5 | **When the ground shakes** | Drop, Cover, Hold On, plus the tsunami warning signs. |
| 6 | **Quiz** | Ask the class! Click an answer to reveal whether it's right. **Reset** clears it. |
| – | **Sources** | Show this at the end if the teacher asks where the information came from. |

### Tips
- Practise once on the laptop you'll present with, especially the 3D model.
- If the 3D model is slow on an old laptop, pause it and use the step buttons instead.
- If "Live quakes" shows an error, the internet dropped. The rest of the site still works
  once the page has loaded.

---

## Where things are (for editing)

| File | What's inside |
|------|---------------|
| `index.html` | All the page text (titles, cards, group name) |
| `js/data.js` | Facts: trenches, earthquakes, volcanoes, magnitude levels, model captions, quiz questions |
| `style.css`, `viz.css`, `graphics.css` | Colors and layout |
| `js/model*.js` | The 3D model and its animation |
| `js/map.js` | The interactive map |

Sources: PHIVOLCS, USGS, WorldRiskReport, MMEIRS. The full list is on the last slide.
