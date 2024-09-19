# VShell
VShell is a powerful command-line interface (CLI) tool that leverages a Large Language Model (LLM) to process input files and generate meaningful output. It integrates with the OpenAI Chat Completions API (Groq) to deliver enhanced functionality for your data processing needs.

# Features
* Accepts multiple input files as command-line arguments for streamlined batch processing.
* Streams output directly to the terminal via stdout by default.
* Supports the option to save results to a specified output file instead of displaying them in the terminal.
* Integrates seamlessly with OpenAI’s Chat Completions API (Groq) to process input data.
* Logs detailed information about errors and debugging to stderr for easy troubleshooting.
* Supports the use of a .env file to configure API keys and other setup values automatically.
* Allows optional configuration of model parameters such as temperature for chat completion processing.

# Installation
To install and set up VShell, follow these steps:
1. Ensure Node.js is installed on your system.
2.  Create a [Groq API Key](https://console.groq.com/login).
3.  Clone the VShell repository to your local machine.
4.  Navigate to the project folder in your terminal and run: npm install
5. Link the package globally: npm link
6. Create a .env file to store your Groq API key and other necessary configuration values.
   '''
   #.env file
   GROQ_API_KEY=your_groq_api_key
   '''

# Usage
Essentially, if you are using Node.js, you have to run it by:
   ``node server.js file_name(s) <arguements>``
So if you do not want to write node server.js everytime you run, instead using vshell, you can follow these instructions below:
1. Ensure Your Project is Set Up: Make sure you have your project files ready, including server.js and .env.
2. Add a bin Field to package.json: Ensure your package.json has a bin field that points to your server.js file. Here’s an example:
   ```
   {
     "bin": {
    "vshell": "src/server.js"
     },
     "scripts": {
    "start": "node src/server.js"
     },
   }
   ```
3. Ensure the server.js file has executable permissions:
   ```chmod +x server.js```
4. Use npm link to create a global symlink for your package:
   ```npm link```
5. To run VShell, use the following command:
   ```vshell file_name(s) <arguements>```

# Options
  - -V, --version : Output the version number.
  - -d, --debug : Enable detailed debug output.
  - -u, --update : Update VShell to the latest version.
  - -m, --model <model> : Specify the LLM model to use.
  - -T, --temperature <number> : Set the temperature parameter for the model (Groq) (default: 0.2).
  - -o, --output <file> : Specify an output file to save the results.
  - -h, --help : Display help for VShell commands.
  - -t, --token-usage : Speicfy specify the usage of token for prompt and response

# Example
To process README.md with a custom temperature setting and save the result to output.txt, use:
  ``vshell ./README.md -t 0.5 -o output.txt``
This version improves the clarity and professionalism of the README while retaining all the necessary details.

