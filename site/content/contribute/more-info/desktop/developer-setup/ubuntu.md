1. Open Terminal
2. Install NodeJS from NodeSource:

    ```sh
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

	* You might need to install `curl` as well:

        ```sh
        sudo apt install curl
        ```

3. Install other dependencies:

    Linux requires the X11 developement libraries and `libpng` to build native Node modules.

    ```sh
    sudo apt install git python3 g++ libx11-dev libxtst-dev libpng-dev
    ```

#### Notes
* To build RPMs, you need `rpmbuild`:

    ```sh
    sudo apt install rpm
    ```