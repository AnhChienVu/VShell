# Contributing to V_Shell

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the Table of Contents for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

## Table of Contents

1. [I have a question](#i-have-a-question)
2. [I want to contribute](#i-want-to-contribute)
3. [Installation](#installation)
4. [Configurations with Toml file](#configuration-with-toml)
5. [Prettier Installation and Configuration](#prettier-installation-and-configuration)
6. [Eslint Installation and Configuration](#eslint-installation-and-configuration)
7. [How to run Tests](#how-to-run-tests)
8. [Continous Integration](#Continuos Integration)

## I have a question

Before you ask a question, it is best to search for existing Issues that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an Issue.
- Provide as much context as you can about what you’re running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.
- We will then take care of the issue as soon as possible.

## I want to contribute

When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn’t leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the documentation. If you are looking for support, you might want to check this section).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the bug tracker.
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.

#### How Do I Submit a Good Bug Report?

You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <>.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an Issue. (Since we can’t be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the reproduction steps that someone else can follow to recreate the issue on their own. - This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

## Installation

To install and set up VShell, follow these steps:

1. Ensure Node.js is installed on your system.
2. Create a [Groq API Key](https://console.groq.com/login).
3. Clone the VShell repository to your local machine.
4. Navigate to the project folder in your terminal and run: npm install
5. Link the package globally: npm link
6. Create a .env file to store your Groq API key and other necessary configuration values.
   '''
   #.env file
   GROQ_API_KEY=your_groq_api_key
   '''

## Configuration with TOML

VShell allows users to set default configuration values via a `.toml` file. This is useful for defining reusable options without passing them as command-line arguments each time.

1. Create a `.toml` file in your **system’s home directory** or make a copy of the provided sample file

   ```bash
   cp ./.toml ~/.config.toml
   ```

2. Add the necessary configuration options in TOML format. Below is an example of how the file should look:

   ```toml
   model = "llama3-8b-8192"
   temperature = 0.7
   ```

3. Command-line arguments will always override the values provided in `.toml` config file. For instance, if you set the model in the file but pass a different model through the command line, the latter will take precedence.

## Prettier Installation and Configuration

1. Installing Prettier locally

You ensure each project uses the specific configuration and version it requires. This is especially helpful when collaborating, as everyone working on the project will format code consistently.

Run: `npm install`

2. Install Prettier Editor Extension

If you are using VScode to develop, go to Extension section and look for `Prettier - Code formatter` plugins. Then download and install it.

After finishing both 2 steps above, the plugins will always format your code based on its version that you installed locally. Because Prettier often changes the way they format code in each version.

3. Run Script

After writting your code, try to make sure you run the formatter script before creating a PR:

Run: `npm run format`

## Eslint Installation and Configuration

1. Installing Eslint locally

You ensure each project uses the specific configuration and version it requires. This is especially helpful when collaborating, as everyone working on the project will format code consistently.

Run: `npm install`

2. Install Eslint Editor Extension

If you are using VScode to develop, VSCode will suggest `Eslint` plugins to install from Extension section. Then you just download and install it
ESlint will run and check your code everytime you save code and if there is any problems in your code that will be presented in Problems window

3. Run Script

After writting your code, try to make sure you run the formatter script before creating a PR:

Run: `npm run lint`

4. Notes:
   Because this project is using the Eslint version 9.x so all of its configuration will be in `eslint.config.mjs` file only. If you need to add any configuration to eslint rule then just go to that file.

## How to run Tests

1. Running your tests can become tedious if you have to always run every test. What if you are working on a particular file/function, and want to run a single test over and over again while you fix a bug?

- You can run a single test: By adding `.only` in the test that you want to run it only

  Example:

  ```javascript
  test.only("should test something important", () => {
    expect(true).toBe(true);
  });
  ```

- You can run a single test suite: By specify that test suite's name that you want to run

  Example:

  ```bash
  npm run test-watch configHandler
  ```

- You can have your test runner watch for changes and run tests automatically when the test or source code is updated: By create a script inside `package.json` file

  Example:

  ```javascript
  // package.json
  "scripts": {
     "test-watch": "jest --watch --"
  }
  ```

2. Where the test should be written?

- You should follow the way of test structure written in this project. Every test file is always written at the same level of the code file

  Example:

  Source code file path: ./src/utils/configHandler.js

  Test file path: ./src/utils/configHandler.test.js

- To clean the jest cache. You can use the script: `npm run test-clear`

**Remember**: tests should be small. Don't write a test that tests everything. Slowly work toward testing everything by testing all the little things one by one. Eventually you'll have covered everything.

## Continuous Integration

To keep the default branch working all times, I implemented a CI pipeline that will automatically run all tests when contributors create a Pull Request or want to get merged in `main` branch. Then, make sure that you code pass and get the green check mark to be merged
