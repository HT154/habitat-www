---
title: Install Habitat
draft: false
---

# Install Habitat

Below you'll find installation instructions for each platform and their requirements. The Habitat CLI is currently supported on Linux, Mac, and Windows.

## Download and Install the Habitat CLI

From building packages to running services, everything in Habitat is done through the hab command-line interface (CLI). To get started using Habitat, you need to download and install the hab CLI that corresponds to your workstation OS.

### Install Habitat for Linux

> Requires 64-bit processor with kernel 2.6.32 or later

Once you have downloaded the package, extract the hab binary with tar to `/usr/local/bin` or add its location to your `PATH` (e.g. `tar -xvzf hab.tgz -C /usr/local/bin --strip-components 1`).

[Download Habitat for Linux](https://api.bintray.com/content/habitat/stable/linux/x86_64/hab-%24latest-x86_64-linux.tar.gz?bt_package=hab-x86_64-linux)

### Install Habitat for Mac

> Requires 64-bit processor running 10.9 or later

Once you have downloaded the `hab` CLI, unzip it onto your machine. Unzipping to `/usr/local/bin` should place it on your `PATH`. In order to use the Habitat Studio, you'll also need to install Docker for Mac.

[Download Habitat for Mac](https://api.bintray.com/content/habitat/stable/darwin/x86_64/hab-%24latest-x86_64-darwin.zip?bt_package=hab-x86_64-darwin)

[Download Docker for Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac)

**Install Habitat Using Homebrew**

Habitat can also be installed with Homebrew, by running the following commands:

```
$ brew tap habitat-sh/habitat
$ brew install hab
```

### Install Habitat for Windows

> Requires 64-bit Windows 10 Pro, Enterprise, or Education editions (1511 November update, build 10586 or later) with Hyper-V enabled

Once you have downloaded the `hab` CLI, unzip it onto your machine. We suggest unzipping to `C:\habitat` and then adding that folder to your `PATH` variable. Here’s how to do that with Powershell:

```
$ $env:PATH += ";C:\habitat"
```

In order to use the Habitat Studio, you'll also need to install Docker for Windows.

[Download Habitat for Windows](https://api.bintray.com/content/habitat/stable/windows/x86_64/hab-%24latest-x86_64-windows.zip?bt_package=hab-x86_64-windows)

[Download Docker for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows)

## Configure Your Workstation

Once Habitat has been installed, the `hab` CLI makes it easy to get your workstation configured by guiding through the setup process. To set up your workstation, run `hab setup` and follow the instructions.

![Screenshot of hab setup output in CLI](/images/screenshots/hab-setup.png)

Setup asks you to create a new origin and a set of origin keys. Optionally, you can also provide a [GitHub personal access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) to upload packages to the public depot and share them with the Habitat community.

> The GitHub personal access token needs information provided from the `user:email` and `read:org` OAuth scopes. Habitat uses the information provided through these scopes for authentication and to determine features based on team membership.

> For more information about using Habitat Builder, see the section on [Working with Builder]({{< relref "/docs/using-builder.md" >}}).

During setup, you may elect to provide anonymous usage data of the `hab` CLI. This information is used by the Habitat team to improve the CLI experience. For information on the types of data we gather and how we intend to use it, see [Analytics in Habitat]({{< relref "docs/about-analytics.md" >}}).

## Download and Install FAQ

This section tracks some frequently encountered questions around downloading and installing the `hab` binary.

**Q: What if I want an old version of `hab`?**

A: We've got you covered! The script we provide for doing curlbash installations (see below) will allow you to specify a `-v` flag to pull down a specific version of Habitat.

**Q: Oh, a curlbash! I (love||hate) those.**

A: Indeed they are divisive, we know. That's why we provide a few different ways for you to download. If you'd like to take a look at the script in advance of running it, you can find it in [the core habitat repo](https://github.com/habitat-sh/habitat/blob/master/components/hab/install.sh).

Install Habitat via curlbash using the following command:

```
$ curl https://raw.githubusercontent.com/habitat-sh/habitat/master/components/hab/install.sh | sudo bash
```

Or to retrieve a specific version:

```
$ curl https://raw.githubusercontent.com/habitat-sh/habitat/master/components/hab/install.sh | sudo bash -s -- -v 0.54.0
```

If you're staunchly in the anti-curlbash camp, you can get the latest packages from our [download page]({{< relref "/docs/install-habitat.md" >}}) or via releases on [Bintray](https://bintray.com/habitat).
