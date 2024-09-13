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
To run VShell, use the following command:
  ``vshell file_name(s) <arguements>``

# Options
  - -V, --version : Output the version number.
  - -d, --debug : Enable detailed debug output.
  - -u, --update : Update VShell to the latest version.
  - -m, --model <model> : Specify the LLM model to use.
  - -t, --temperature <number> : Set the temperature parameter for the model (Groq) (default: 0.2).
  - -o, --output <file> : Specify an output file to save the results.
  - -h, --help : Display help for VShell commands.

# Example
To process README.md with a custom temperature setting and save the result to output.txt, use:
  ``vshell ./README.md -t 0.5 -o output.txt``
This version improves the clarity and professionalism of the README while retaining all the necessary details.

