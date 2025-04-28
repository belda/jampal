# JamPal
A handy tool for musicians to have an overview of song chords and structure.

## About
Jampal is a handy tool best suited for small bands or hosting musicians. You can easily outline the song 
structure (verses,choruses, etc) and the chords, that are played.

It is best suited to run on a fullscreen fullHD TV (eg. from a RaspberryPI:-)

## Features
* quick song structure editing
* visual metronome with tap tempo
* colorizing song parts to quickly see the parts
* estimated song duration
* client side JavaScript, can be run offline
* notes
* quick keyboard control

## Requirements
* Chromium/Google Chrome browser
* Landscape 1920x1080 display (can run on HDready, but not as nicely)

## Demo
You can check demo (F11 for fullscreen before) [JamPal demo](https://belda.github.io/jampal/jampal.html)

## TODOs
* nicer metronome
* audio click for metronome
* another section for lyrics
* some music theory tools using teoria.js (https://github.com/saebekassebil/teoria)
* integrate https://github.com/tardate/jtab
* NextCloud integration
* fix font size after resize

## Building and Packaging

### Prerequisites
- Node.js
- npm
- Electron

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/belda/jampal.git
   cd jampal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install electron-builder:
   ```
   npm install electron-builder --save-dev
   ```

### Building
To build the app for Mac, Fedora, Ubuntu, and Raspbian, run:
```
npm run build
```

### Running the Packaged App
After building, you can find the packaged app in the `dist` directory. Follow the platform-specific instructions to run the app:

#### Mac
1. Open the `dist` directory.
2. Find the `.dmg` file and open it.
3. Drag the app to the Applications folder.

#### Fedora/Ubuntu
1. Open the `dist` directory.
2. Find the `.AppImage` or `.deb` file.
3. For `.AppImage`, make it executable and run it:
   ```
   chmod +x jampal-<version>.AppImage
   ./jampal-<version>.AppImage
   ```
4. For `.deb`, install it using dpkg:
   ```
   sudo dpkg -i jampal-<version>.deb
   ```

#### Raspbian
1. Open the `dist` directory.
2. Find the `.deb` file.
3. Install it using dpkg:
   ```
   sudo dpkg -i jampal-<version>.deb
   ```

## Licence
MIT licence
