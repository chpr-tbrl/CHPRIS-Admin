# Contributing to CHPR-IS

Thank you for supporting CHPR-IS. Please follow the steps below to get started.

Existing features can be found in [features.md](FEATURES.md)

## Project Structure

We use three main branches in our workflow: [stable(master)](https://github.com/smswithoutborders/smswithoutborders.com/tree/master), [dev](https://github.com/smswithoutborders/smswithoutborders.com/tree/dev) and [testing](https://github.com/smswithoutborders/smswithoutborders.com/tree/testing)

* The [stable](https://github.com/smswithoutborders/smswithoutborders.com/tree/master) branch contains the code for the latest release version of the project
* [dev](https://github.com/smswithoutborders/smswithoutborders.com/tree/dev) is the active development branch. All recent changes and contributions go here
* [testing](https://github.com/smswithoutborders/smswithoutborders.com/tree/testing) is where we try out newly developed features in prepartion for a release.

In summary, we build, test then deploy

## Getting started

Create a fork of the [project](https://github.com/smswithoutborders/smswithoutborders.com)

Switch to the dev branch

```bash
git checkout dev
```

You can confirm you are on the dev branch by running

```bash
git branch
```

Create the branch you will be working from

 ```bash
git checkout -b <your branch name here>
 ```

Update your local branch with a rebase pull to avoid merge conflicts

 ```bash
git pull -r
 ```

## Style Guide

### Project structure

This project is built with [React](https://reactjs.org/) and was bootstraped with [Create React App](https://github.com/facebook/create-react-app) which specifies environment variable naming conventions.

Files are grouped [by type](https://reactjs.org/docs/faq-structure.html) and placed in subfolders under [src](../src). Each subfolder contains an index file for [barrel exports](https://github.com/basarat/typescript-book/blob/master/docs/tips/barrel.md).

### Design and tooling

Our design guidelines are based on [IBM Carbon](https://carbondesignsystem.com/) which specifies every single aspect of design from layout to colors and typography.

We also rely heavily on the [carbon react component library](http://react.carbondesignsystem.com/) based on carbon design system for all components of the UI

We use [Redux](https://redux.js.org/) for state management and as such [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for data fetching and API Calls.

### Code formatting

[Prettier VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) is the defacto for code formatting. Code that is well formatted is easier to read and review

### Commit messages

We follow the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for all commits. Please reference this guide when writting commit messages.

## Adding features

Please create a new branch to work on a new feature. That way you can easily roll back if something goes wrong. Once complete open a pull request and we will be happy to review and merge your contribution.

New features are very welcome but should first be discussed with the team for guidance.

New  pages, components and features can be created in their respective folders and linked accordingly. Helper functions can be defined under utils

All routes are defined in [App.js](../src/App.js) and any new routes can be added there.

## Testing

Some parts of the project are inter-connected. Whenever a component in this section gets updated, it is advised to test all other components related to it. Please see the [testing guide](TESTING.md)

## Reporting Issues

New issues can be opened on Github. Please check to make sure it has not been reported before.

## Fixing Issues

When writting commit messages for fixes, please reference the issue being solved by adding the issue number in the commit message like below. [learn more](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)

```bash
fix(component):  critical bug in example component, fixes #12
```
