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

## Associating an AppImage with a File Type

To associate an AppImage with a certain file type, you can follow these steps:

* Create a `.desktop` file for your AppImage. This file will define the association between the AppImage and the file type.
* Update the MIME type database to recognize the new file type and associate it with your AppImage.

### Steps to associate an AppImage with a file type

1. **Create a `.desktop` file:**
   * Create a new file with a `.desktop` extension, for example, `jampal.desktop`.
   * Add the following content to the file, replacing `<path-to-appimage>` with the actual path to your AppImage and `<file-extension>` with the file extension you want to associate:

     ```ini
     [Desktop Entry]
     Name=JamPal
     Exec=<path-to-appimage> %f
     Icon=<path-to-icon>
     Type=Application
     MimeType=application/x-<file-extension>;
     ```

2. **Update the MIME type database:**
   * Create a new file with a `.xml` extension, for example, `jampal-mime.xml`.
   * Add the following content to the file, replacing `<file-extension>` with the file extension you want to associate:

     ```xml
     <?xml version="1.0" encoding="UTF-8"?>
     <mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">
       <mime-type type="application/x-<file-extension>">
         <comment>JamPal File</comment>
         <glob pattern="*.jpl"/>
       </mime-type>
     </mime-info>
     ```

3. **Install the `.desktop` and MIME type files:**
   * Copy the `.desktop` file to the appropriate directory:

     ```sh
     cp jampal.desktop ~/.local/share/applications/
     ```

   * Copy the MIME type file to the appropriate directory:

     ```sh
     cp jampal-mime.xml ~/.local/share/mime/packages/
     ```

4. **Update the MIME type database:**
   * Run the following command to update the MIME type database:

     ```sh
     update-mime-database ~/.local/share/mime
     ```

5. **Update the desktop database:**
   * Run the following command to update the desktop database:

     ```sh
     update-desktop-database ~/.local/share/applications
     ```

After completing these steps, your AppImage should be associated with the specified file type, and you should be able to open files with that extension using your AppImage.

## Licence
MIT licence
