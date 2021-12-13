1. Open Terminal
2. Install dependencies:

    Linux requires the X11 developement libraries and `libpng` to build native Node modules.

    ```sh
    sudo apt install nodejs git python3 g++ libX11-devel libXtst-devel libpng-devel`
    ```

#### Notes
* To build RPMs, you need `rpmbuild`

    ```sh
    sudo dnf install rpm-build
    ```