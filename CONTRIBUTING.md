# Contributing to LumX²

We'd love for you to contribute to our source code and to make LumX² even better than it is today! Here are the guidelines we'd like you to follow:

- [Code of Conduct](#code-of-conduct)
- [Got a question or a problem?](#got-a-question-or-a-problem-)
- [Found an issue?](#found-an-issue-)
- [Want a feature?](#want-a-feature-)
- [Submission guidelines](#submission-guidelines)
- [Coding rules](#coding-rules)
- [Git commit guidelines](#git-commit-guidelines)

## <a name="code-of-conduct"></a> Code of Conduct

As heavy users of [Angular](https://github.com/angular/angular), we encourage you to read and follow the [Angular Code of Conduct](https://github.com/angular/code-of-conduct/blob/master/CODE_OF_CONDUCT.md).

## <a name="got-a-question-or-a-problem-"></a> Got a question or a problem?

If you have questions about how to use LumX², please direct these to [StackOverflow](http://stackoverflow.com/questions/tagged/lumx).

## <a name="found-an-issue-"></a> Found an issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our [GitHub Repository](https://github.com/lumapps/lumx/issues). Even better you can submit a Pull Request with a fix.

If you are feeling lucky, you can even fix it yourself and submit a Pull Request.
Before opening a Pull Request, please see the Submission Guidelines below.

## <a name="want-a-feature-"></a> Want a feature?

You can request a new feature by submitting an issue to our GitHub Repository.

If you would like to implement a new feature then consider what kind of change it is, discuss it with us before hand in your issue, so that we can better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project.

## <a name="submission-guidelines"></a> Submission guidelines

### Submitting an issue

Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue. Help us to minimize the effort by not reporting duplicate issues. Providing the following information will increase the chances of your issue being dealt with quickly:

- **Motivation for or Use Case** - explain why this is a bug for you
- **LumX² Version(s)** - is it a regression?
- **Browsers and Operating System** - is this a problem with all browsers or only IE8?
- **Reproduce the Error** - provide a live example (using [Plunker](http://plnkr.co/edit) or [JSFiddle](http://jsfiddle.net/)) or a unambiguous set of steps.

### Submitting a pull request

Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/lumapps/lumx/pulls) for an open or closed Pull Request
that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch

```shell
git checkout -b <feat|fix>/<descriptive branch name> master
```

* Create your patch.
* Follow our [Coding Rules](#rules).
* Commit your changes using a descriptive commit message that follows our
[commit message conventions](#commit-message-format).
* Check and test your changes locally.

```shell
npm run -s lint:all && npm run -s tests
```

* Push your branch to GitHub:

```shell
git push origin <full branch name>
```

* In GitHub, send a pull request to `lumx:master`.
* If we suggest changes then:
    * Make the required updates.
    * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

```shell
git rebase upstream master -i
git push -f
```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

```shell
git push origin --delete <full branch name>
```

* Check out the master branch:

```shell
git checkout master -f
```

* Delete the local branch:

```shell
git branch -D <full branch name>
```

* Update your master with the latest upstream version:

```shell
git pull --ff upstream master
```

## <a name="coding-rules"></a> Coding rules

We're using TypeScript, Javascript and [SCSS](http://sass-lang.com/) to build the framework. We're also using NPM and Wepack to help you contribute:

- `npm start` will build the project, watch for modifications (with hot-reload) and serve an example application.
- `npm run -s lint:all` will check the coding style and lint all your configs and source files
- `npm run -s tests` will run all unit and E2E tests and produce reports (available in `tests/client/(unit|e2e)/report`)
- `npm run -s build:prod` will update the dist folder with the last contents and make a production ready package.

Many other NPM command are available. Use `npm run -s help` to get a list of all available tasks.
You can also read [the full description of the toolchain](To be done).

Our coding convention is the following:

- 4 spaces for indentation, for TypeScript, Javascript and SCSS.
- Wrap all codes at 120 characters.

For TypeScript and Javascript:

- Use [camelCase](https://en.wikipedia.org/wiki/Camel_case), except for constants in [UPPER_SNAKE_CASE](https://en.wikipedia.org/wiki/Snake_case).
- Use the [One True Brace Style (1TBS)](https://en.wikipedia.org/wiki/Indent_style#1TBS).

You can read the [full JavaScript code convention](To be done), the [full TypeScript code convention](To be done) and the [full Angular code convention](To be done).

All submitted TypeScript/JavaScript code must be properly documented. You *must* at least document all your functions, methods and members using the JSDoc format. More information about the documentation format is available in the [full JavaScript code convention](To be done) and the [full TypeScript code convention](To be done).

For SCSS:

- Except for the line wrap, please refer to [the Harry Roberts css guidelines](http://cssguidelin.es/).
- For the CSS properties, we follow the [concentric order](http://rhodesmill.org/brandon/2011/concentric-css/)

You can read the [full SCSS code convention](To be done).

For the ease of use and contributing, most of the coding styles are enforced with TSLint, ESLint and SASS-Lint. So as long as the pre-commit script let you commit, you should be good.

## <a name="git-commit-guidelines"></a> Git commit guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more readable messages** that are easy to follow when looking through the **project history**.

We recommend you to use [Commitizen](https://github.com/commitizen/cz-cli) with the `git cz` command to help you construct your commit message and be sure to match these guidelines.

For the ease of use and contributing, most of the commit message style is enforced. So as long as the pre-commit script let you commit, you should be good.

### Commit message format

Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on github as well as in various git tools.

### Type

Must be one of the following:

* **feat**: a new feature
* **fix**: a bug fix
* **theme**: a change concerning (S)CSS themes/styles
* **docs**: documentation only changes
* **lint**: changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc)
* **refactor**: a code change that neither fixes a bug or adds a feature
* **perf**: a code change that improves performance
* **test**: adding missing tests or correcting existing tests
* **build**: changes that affect the build system or external dependencies (gulp, npm, webpack, ...)
* **ci**: changes to the CI configuration files and scripts
* **chore**: miscellaneous changes
* **revert**: reverts a previous commit

### Scope

The scope could be anything specifying place of the commit change. For example `notification', 'dropdown', etc.
The scope must be written in [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).

If the commit reverts a previous commit, it should contains the (short) reverted commit SHA1.

### Subject

A brief but meaningfull description of the change.
Here are some recommandation for writing your subject:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no "." (dot) at the end

If the commit reverts a previous commit, it should contains the title of the reverted commit.

### Body

The body should include the motivation for the change and contrast this with previous behavior.
If the commit reverts a previous commit, explain why you reverted it.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.
The breaking changes must be at the end of the commit with only "BROKEN:" before the list of breaking changes. They must be each on a new line.

### Commit example

```
feat(toto-service): provide toto for all

Before we had to do another thing. There was this and this problem.
Now, by using "toto", it's simpler and the problems are managed.

Closes PR #25
Fixes #15
BROKEN:
first thing broken
second thing broken
```

## <a name="code-comments-guidelines"></a> Code comments guidelines

Your comments must be concise but meaningfull. You don't have to be too verbose in your comments.
You must comment **all** your functions, methods and members (using [JSDoc](http://usejsdoc.org/)), but you don't have to comment all your code. If your code is self-describing, it's useless to add comments.

When you have to write comments in your code, please follow the guidelines bellow.

### Comment Message Format

```js
// <type> [<developer>]: <details>.
```

or

```js
/* <type> [<developer>].
 *
 * <details>.
 */
```

### Type

Must be one of the following:

* **FIXME**: should be corrected
* **HACK**: a dirty workaround
* **TODO**: something to be done
* **XXX**: warn other programmers of problematic or misguiding code
* **UX**: user experience, notice about non-trivial code

### Developer

The developer who created the comment.

### Details

The details explaining precisely the reason of the code:

* use the imperative, present tense: "change" not "changed" nor "changes"
* capitalize first letter
* finish you sentence by a "." (dot)
