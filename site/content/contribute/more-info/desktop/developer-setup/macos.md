1. Install Homebrew: http://brew.sh
2. Open Terminal
3. Install dependencies

    ```sh
    brew install node@16 git python3
    ```

4. Add NodeJS to PATH:

    ```sh
    echo 'export PATH="/usr/local/opt/node@16/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
    ```