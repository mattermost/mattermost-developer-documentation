**NOTE:** We don't officially support Arch Linux for use with the Mattermost Desktop App. The provided guide is unofficial.

1. Open Terminal
2. Install NodeJS via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating):

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    nvm install --lts
    ```

3. Install other dependencies:

    Linux requires the X11 developement libraries and `libpng` to build native Node modules.
    Arch requires `libffi` since it's not installed by default.

    ```sh
    sudo pacman -S install npm git python3 gcc make libx11 libxtst libpng libffi
    ```

#### Notes
* To build RPMs, you need `rpmbuild`

    ```sh
    sudo pacman -S install rpm
    ```