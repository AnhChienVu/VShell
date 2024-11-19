# VShell

VShell is a powerful command-line interface (CLI) tool that leverages a Large Language Model (LLM) to process input files and generate a README file that will explain the source code functionaility and how to use it. Just imagine if someone give you a source code, and you want to have an overall idea about what it does, then use my application, it will give you a picture of it.Besides, it integrates with the OpenAI Chat Completions API (Groq) to deliver enhanced functionality for your data processing needs.

# Demo

https://github.com/user-attachments/assets/cd0679f1-82b6-4547-9291-a6374744fd70

# Features

- Accepts multiple input files as well as folders that has subfolders and files within as command-line arguments for streamlined batch processing.
- Streams output directly to the terminal via stdout by adding `-s/--stream` flag.
- Supports the option to save results to a specified output file instead of displaying them in the terminal.
- Integrates seamlessly with OpenAI’s Chat Completions API (Groq) to process input data.
- Logs detailed information about errors and debugging to stderr for easy troubleshooting.
- Supports the use of a .env file to configure API keys and other setup values automatically.
- Allows optional configuration of model parameters such as temperature for chat completion processing through a configuration file.

# Installation

- Step 1: Install package

  `npm install vshell`

- Step 2: Create `.env` file and create `GROQ_API_KEY`

  ```
  GROQ_API_KEY=<your_api_key>
  ```

# How to use

There are some examples included in the `Code` section of this package on [npmjs](https://www.npmjs.com/package/vshell?activeTab=code). Or you can run it using one of your own files placed in the root directory, or any other directory you might make

To run VShell, use the following command syntax:
`vshell file_name(s) <options>`

# Options

- -V, --version : Output the version number.
- -d, --debug : Enable detailed debug output.
- -u, --update : Update VShell to the latest version.
- -m, --model <model> : Specify the LLM model to use.
- -T, --temperature <number> : Set the temperature parameter for the model (Groq) (default: 0.2).
- -o, --output <file> : Specify an output file to save the results.
- -h, --help : Display help for VShell commands.
- -t, --token-usage : Speicfy specify the usage of token for prompt and response
- -s, --stream: Stream the output to `stdout` in real time

# TOML config

VShell supports reading a `.toml` configuration file in the user's home directory to use as pre-set options when provided

If you do not want to provide `options` when typing on command line, then create a `.config.toml` in the home directory, and provide options to use:

```
# temperature <number>: Set model temperature (0.1 to 2)
temperature = 0.5

# output: Specify output file to save result
output = output.md

# tokenUsage <boolean>: Get token usage information
tokenUsage = true

# debug <boolean>: Enable detailed debug message
debug = true

# stream <boolean>: Stream the output to console screen
stream = true
```

# Example

To process README.md with a custom temperature setting and save the result to output.txt, use:
`vshell ./README.md -t 0.5 -o output.txt`
This version improves the clarity and professionalism of the README while retaining all the necessary details.
