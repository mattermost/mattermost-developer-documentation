1. Open Terminal
2. Install dependencies:

    Linux requires the X11 developement libraries and `libpng` to build native Node modules.
    Arch requires `libffi` since it's not installed by default.

    ```sh
    sudo pacman -S install nodejs npm git python3 gcc make libx11 libxtst libpng libffi
    ```

#### Notes
* To build RPMs, you need `rpmbuild`

    ```sh
    sudo pacman -S install rpm
    ```