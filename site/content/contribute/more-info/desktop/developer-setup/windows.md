1. Install Chocolatey: https://chocolatey.org/install
2. Install Visual Studio Community: https://visualstudio.microsoft.com/vs/community/
	- Include **Desktop development with C++** when installing
3. Open PowerShell
4. Install dependencies

    ```sh
    choco install nvm git python3
    ```

5. Restart PowerShell (to refresh the environment variables)
6. Run `nvm install lts` and `nvm use lts` to install and use the latest NodeJS LTS version.
