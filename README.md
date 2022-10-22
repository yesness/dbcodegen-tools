# dbcodegen-tools

## Installation

```
$ npm i -g @yesness/dbcodegen-tools
```

## Usage

We recommend setting up dbcodegen in a sibling directory to your project's backend. For example, consider the following directory structure:

```
Project/
  - Backend/
    - package.json
    - src/
  - Frontend/
    - package.json
    - src/
```

Run the following commands to setup dbcodegen:

```
$ cd Project
$ npx dbcodegen-tools init DBCodegen
```

Then follow the instructions in `Project/DBCodegen/README.md` to configure dbcodegen.

For example, change the output directory from `src/generated` to `../Backend/src/generated`. Then run:

```
$ cd DBCodegen
$ npm i
$ npm run dbg
```

You will now have the following directory structure:

```
Project/
  - Backend/
    - package.json
    - src/
      - generated/
  - Frontend/
    - package.json
    - src/
  - DBCodegen/
    - package.json
    - ...
```
