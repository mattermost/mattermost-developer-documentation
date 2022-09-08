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
    
---
For Mac with Apple Chip (M1 architecture):
- Enable [Rosetta](https://support.apple.com/en-us/HT211861)
- Use the latest NodeJS@16 (>=v16.16)
- Update [xcode](https://developer.apple.com/xcode/) to latest version (>=v13.4.1)
