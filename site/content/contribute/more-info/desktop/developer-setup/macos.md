1. Install Homebrew: http://brew.sh
2. Open Terminal
3. Install dependencies

    ```sh
    brew install git python3
    ```

4. Install NVM using the official install script

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    ```

    After installing, follow the post-install steps shown by the installer to add the necessary lines to your shell profile (for example `~/.zshrc` or `~/.bash_profile`). Then open a new terminal and run:

    ```sh
    nvm install --lts
    ```
