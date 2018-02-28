---
title: Developing Packages
draft: false
---

# Developing Packages

In Habitat, the unit of automation is the application itself. This section includes content related specifically to the process and workflow of developing a plan that will instruct Habitat in how to to build, deploy, and manage your application.

## Writing a Plan

Packages are the cryptographically-signed tarballs that are uploaded, downloaded, unpacked, and installed in Habitat. They are built from shell scripts known as plans, but may also include application lifecycle hooks and service configuration files that describe the behavior and configuration of a running package.

At the center of Habitat packaging is the plan. This is a directory comprised of shell scripts and optional configuration files that define how you download, configure, make, install, and manage the lifecycle of the software in the package. For more conceptual information on packages can be found in the [Packages glossary topic]({{< relref "/docs/glossary.md" >}}).

As a way to start to understand plans, let's look at an example `plan.sh` for [sqlite](http://www.sqlite.org/):

```
pkg_name=sqlite
pkg_version=3130000
pkg_origin=core
pkg_license=('Public Domain')
pkg_maintainer="The Habitat Maintainers <humans@habitat.sh>"
pkg_description="A software library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine."
pkg_upstream_url=https://www.sqlite.org/
pkg_source=https://www.sqlite.org/2016/${pkg_name}-autoconf-${pkg_version}.tar.gz
pkg_filename=${pkg_name}-autoconf-${pkg_version}.tar.gz
pkg_dirname=${pkg_name}-autoconf-${pkg_version}
pkg_shasum=e2797026b3310c9d08bd472f6d430058c6dd139ff9d4e30289884ccd9744086b
pkg_deps=(core/glibc core/readline)
pkg_build_deps=(core/gcc core/make core/coreutils)
pkg_lib_dirs=(lib)
pkg_include_dirs=(include)
pkg_bin_dirs=(bin)
```

> On Windows, we would create a `plan.ps1` file instead. All the variable names are the same but we use Powershell syntax so, for example, `pkg_deps=(core/glibc core/readline)` becomes `$pkg_deps=@("core/glibc", "core/readline")`.

It has the name of the software, the version, where to download it, a checksum to verify the contents are what we expect, runtime dependencies on `core/glibc` and `core/readline`, build-time dependencies on `core/coreutils`, `core/make`, `core/gcc`, library files in `lib`, header files in `include`, and a binary file in `bin`. Also, because it's a core plan, it has a description and upstream URL for the source project included.

> The `core` prefix is the origin of those dependencies. For more information, see [Create an Origin]({{< relref "/docs/using-builder.md#creating-an-origin" >}}).

When you have finished creating your plan and call `build` in the Habitat studio, the following occurs:

1. The build script ensures that the origin key is available to sign the package.
1. If specified in `pkg_source`, a compressed file containing the source code is downloaded.
1. The checksum of that file, specified in `pkg_shasum`, is validated.
1. The source is extracted into a temporary cache.
1. Unless overridden, the callback methods will build and install the binary or library via `make` and `make install`, respectively, for Linux based builds.
1. Your package contents (binaries, runtine dependencies, libraries, assets, etc.) are then compressed into a tarball.
1. The tarball is signed with your origin key and given a `.hart` file extension.

After the build script completes, you can then upload your package to Habitat Builder, or install and start your package locally.

> The plan.sh or plan.ps1 file is the only required file to create a package. Configuration files, runtime hooks, and other source files are optional.


All plans must have a `plan.sh` or `plan.ps1` at the root of the plan context. They may even include both if a package is targeting both Windows and Linux platforms. This file will be used by the `hab-plan-build` command to build your package. To create a plan, do the following:

1. If you haven't done so already, [download the `hab` CLI]({{  }}) and install it per the instructions on the download page.

1. Run `hab setup` and follow the instructions.

1. The easiest way to create a plan is to use the `hab plan init` subcommand. This subcommand will create a directory, known as the plan context, that contains your plan file and any runtime hooks and/or templated configuration data.

    To use it, navigate to the root of your project and run `hab plan init`. This will create a new `habitat` sub-directory with a `plan.sh` and a package name based on that of the directory. It will also include a default.toml file as well as config and hooks directories for you to populate as needed. For example:

    ```
    $ cd /path/to/yourplan
    $ hab plan init
    ```

    will result in a new `habitat` directory located at `/path/to/yourplan/habitat`. A `plan.sh` file will be created and the `pkg_name` variable in `plan.sh` will be set to `yourplan`. Also, any environment variables that you have previouly set (such as `HAB_ORIGIN`) will be used to populate the respective `pkg_*` variables

    If you want to generate a Powershell based plan file for building Windows packages, use the `--windows` option:

    ```
    PS C:\\> hab plan init --windows yourplan
    ```

    This generates a `plan.ps1` with proper Powershell variables, arrays, hashtables and functions.

    If you want to auto-populate more of the `pkg_*` variables, you also have the option of setting them when calling `hab plan init`, as shown in the following example:

    ```
    $ env pkg_svc_user=someuser pkg_deps="(core/make core/coreutils)" \
        pkg_license="('MIT' 'Apache-2.0')" pkg_bin_dirs="(bin sbin)" \
        pkg_version=1.0.0 pkg_description="foo" pkg_maintainer="you" \
        hab plan init yourplan
    ```

    See [`hab plan init`]({{< relref "/docs/reference.md#hab-plan-init" >}}) for more information on how to use this subcommand.

1. Now that you have stubbed out your plan file in your plan context, open it and begin modifying it to suit your needs.

When writing a plan, it's important to understand that you are defining both how the package is built and the actions Habitat will take when the Supervisor starts and manages the child processes in the package. The following sections explain what you need to do for each phase.

### Buildtime workflow

For buildtime installation and configuration, workflow steps need to be included in the plan file to define how you will install your application source files into a package. Before writing your plan, you should know and understand how your application binaries are currently built, installed, what their dependencies are, and where your application or software library expects to find those dependencies.

The main steps in the buildtime workflow are the following:

1. Create your fully-qualified package identifier.
1. Add licensing and contact information.
1. (Optional) Download and unpack your source files.
1. Define your dependencies.
1. (Optional) Override any default build phases you need to using callbacks.

#### Create your package identifier

The origin is a place for you to set default privacy rules, store your packages, and collaborate with teammates. For example, the "core" origin is where the core maintainers of Habitat share packages that are foundational to building other packages. If you would like to browse them, they are located in the [core-plans repo](https://github.com/habitat-sh/core-plans), and on [Habitat Builder's Core Origin](https://bldr.habitat.sh/#/pkgs/core).

Creating packages for a specific origin requires that you have access to the secret key for that origin. The secret key will be used to sign the package when it is built by the hab-plan-build command. Keys are kept in `$HOME/.hab/cache/keys` on the host machine and `/hab/cache/keys` while in the studio. For more information on keys, see [Keys]({{< relref "/docs/glossary.md#keys" >}}).

The next important part of your package identifier is the name of the package. Standard naming convention is to base the name of the package off of the name of the source or project you download and install into the package.

Every package needs a version number to use as part of its package identification. The `hab plan init` subcommand creates a version for you, but in general, you have two options for adding versioning:

* Explicitly add `pkg_version` to your plan file
* Use the `pkg_version` and `update_pkg_version` (or` Set-PkgVersion` in a `plan.ps1`) helper functions to compute `pkg_version`

The following shows how to set pkg_version:

plan.sh

```
pkg_version="1.2.8"
```

plan.ps1

```
$pkg_version="1.2.8"
```

See [Basic settings]({{< relref "/docs/reference.md#plan-settings" >}}) and [Utility functions]({{< relref "/docs/reference.md#utility-functions" >}}) for more information on these versioning options.

#### Add Licensing and Contact Information

You should enter your contact information in your plan.

Most importantly, you should update the `pkg_license` value to indicate the type of license (or licenses) that your source files are licensed under. Valid license types can be found at [](https://spdx.org/licenses/). You can include multiple licenses as an array.

> Because all arrays in the pkg_* settings are shell arrays, they are whitespace delimited.

#### Download and Unpack Your Source Files

Add in the `pkg_source` value that points to where your source files are located at. Any `wget` url will work; however, unless you're downloading a tarball from a public endpoint, you may need to modify how you download your source files and where in your plan.sh you perform the download operation.

Habitat supports retrieving source files from GitHub. When cloning from GitHub, it is recommended to use `https` URIs because they are proxy friendly, whereas `git@github` or `git://` are not. To download the source from a GitHub repository, implement `do_download()` in your plan.sh (or `Invoke-Download` in a plan.ps1) and add a reference the `core/git` package as a build dependency. Because Habitat does not contain a system-wide CA cert bundle, you must use the `core/cacerts` package and export the `GIT_SSL_CAINFO` environment variable to point to the `core/cacerts` package on Linux. Here’s an example of how to do this in the `do_download()` callback.

```
do_download() {
  export GIT_SSL_CAINFO="$(pkg_path_for core/cacerts)/ssl/certs/cacert.pem"
  git clone https://github.com/chef/chef
  pushd chef
  git checkout $pkg_version
  popd
  tar -cjvf $HAB_CACHE_SRC_PATH/${pkg_name}-${pkg_version}.tar.bz2 </span>
      --transform "s,^./chef,chef-${pkg_version}," ./chef </span>
      --exclude chef/.git --exclude chef/spec
  pkg_shasum=$(trim $(sha256sum $HAB_CACHE_SRC_PATH/${pkg_filename} | cut -d " " -f 1))
}
```

The plan.ps1 equivalent would be:

```
Function Invoke-Download {
  git clone https://github.com/chef/chef
  pushd chef
  git checkout $pkg_version
  popd
  Compress-Archive -Path chef/* -DestinationPath $HAB_CACHE_SRC_PATH/$pkg_name-$pkg_version.zip -Force
  $script:pkg_shasum = (Get-FileHash -path $HAB_CACHE_SRC_PATH/$pkg_name-$pkg_version.zip -Algorithm SHA256).Hash.ToLower()
}

```

After you have either specified your source in `pkg_source`, or overridden the `do_download()` or `Invoke-Download` callback, create a sha256 checksum for your source archive and enter it as the `pkg_shasum` value. The build script will verify this after it has downloaded the archive.

> If your computed value does not match the value calculated by the hab-plan-build script, an error with the expected value will be returned when you execute your plan.

#### Define Your Dependencies

Applications have two types of dependencies: buildtime and runtime.

Declare any build dependencies in `pkg_build_deps` and any run dependencies in `pkg_deps`. You can include version and release information when declaring dependencies if your application is bound to a particular version.

The package `core/glibc` is typically listed as a run dependency and core/coreutils as a build dependency, however, you should not take any inference from this. There are no standard dependencies that every package must have. For example, the package for a Node.js application may incluce only the `core/node` package as a run dependency. You should include only those dependencies that would natively be part of the build or runtime dependencies of your application.

There is a third type of dependency called a transitive dependency. These are the run dependencies of either the build or run dependencies listed in your plan. You do not need to explicitly declare transitive dependencies, but they are included in the list of dependencies when your package is built. See [Package contents]({{< relref "/docs/reference.md#package-contents" >}}) for more information.

#### Override Build Phases with Callbacks

As shown in an example above, there are occasions when you want to override the default behavior of the `hab-plan-build` script. The [Plan Syntax guide]({{< relref "/docs/best-practices.md#plan-syntax" >}}) lists the default implementations for [build phase callbacks]({{< relref "/docs/reference.md#callbacks" >}}), but if you need to reference specific packages in the process of building your applications or services, then you need to override the default implementations as in the example below.

```
pkg_name=httpd
pkg_origin=core
pkg_version=2.4.18
pkg_maintainer="The Habitat Maintainers <humans@habitat.sh>"
pkg_license=('apache')
pkg_source=http://www.apache.org/dist/${pkg_name}/${pkg_name}-${pkg_version}.tar.gz
pkg_shasum=1c39b55108223ba197cae2d0bb81c180e4db19e23d177fba5910785de1ac5527
pkg_deps=(core/glibc core/expat core/libiconv core/apr core/apr-util core/pcre core/zlib core/openssl)
pkg_build_deps=(core/patch core/make core/gcc)
pkg_bin_dirs=(bin)
pkg_lib_dirs=(lib)
pkg_exports=(
  [port]=serverport
)
pkg_svc_run="httpd -DFOREGROUND -f $pkg_svc_config_path/httpd.conf"
pkg_svc_user="root"

do_build() {
  ./configure --prefix=$pkg_prefix \
              --with-expat=$(pkg_path_for expat) \
              --with-iconv=$(pkg_path_for libiconv) \
              --with-pcre=$(pkg_path_for pcre) \
              --with-apr=$(pkg_path_for apr) \
              --with-apr-util=$(pkg_path_for apr-util) \
              --with-z=$(pkg_path_for zlib) \
              --enable-ssl --with-ssl=$(pkg_path_for openssl)\
              --enable-modules=most --enable-mods-shared=most
  make
}

```

In this example, the `core/httpd` plan references several other core packages through the use of the `pkg_path_for` function before `make` is called. You can use a similar pattern if you need reference a binary or library when building your source files.

Or consider this override from a plan.ps1:

```
function Invoke-Build {
    Push-Location "$PLAN_CONTEXT"
    try {
        cargo build --release --verbose
        if($LASTEXITCODE -ne 0) {
            Write-Error "Cargo build failed!"
        }
    }
    finally { Pop-Location }
}

```

Here the plan is building an application written in Rust. So it overrides `Invoke-Build` and uses the `cargo` utility included in its build-time dependency on `core/rust`.

> Powershell plan function names differ from their Bash counterparts in that they use the `Invoke` verb instead of the `do_` prefix.

When overriding any callbacks, you may use any of the variables, settings, or functions in the Plan syntax guide, except for the runtime template data. Those can only be used in [Application Lifecycle Hooks]({{< relref "/docs/reference.md#hooks" >}}) once a Habitat service is running.

### Runtime Workflow

Similar to defining the setup and installation experience at buildtime, behavior for your application or service needs to be defined for the Supervisor. This is done at runtime through Application lifecycle hooks. See [Application Lifecycle Hooks]({{< relref "/docs/reference.md#hooks" >}}) for more information and examples.

If you only need to start the application or service when the Habitat service starts, you can instead use the `pkg_svc_run` setting and specify the command as a string. When your package is created, a basic run hook will be created by Habitat.

You can use any of the [runtime configuration settings]({{< relref "/docs/reference.md#template-data" >}}), either defined by you in your config file, or defined by Habitat.

Once you are done writing your plan, use the studio to [build your package]({{< relref "/docs/developing-packages.md#plan-builds" >}}).

* [Write plans]({{< relref "/docs/developing-packages.md#write-plans" >}}): Describes what a plan is and how to create one.
* [Add configuration to plans]({{< relref "/docs/developing-packages.md#add-configuration" >}}): Learn how to make your running service configurable by templatizing configuration files in your plan.
* [Binary-only packages](/docs/best-practices.md#binary-wrapper): Learn how to create packages from software that comes only in binary form, like off-the-shelf or legacy programs.

You may also find the [plan syntax guide]({{< relref "/docs/reference.md" >}}) useful. It lists the settings, variables, and functions that you can use when creating your plan.

## Configuration Templates

Habitat allows you to templatize your application's native configuration files using Handlebars syntax. The following sections describe how to create tunable configuration elements for your application or service.

Template variables, also referred to as tags, are indicated by double curly braces:` {{a_variable}}`. In Habitat, tunable config elements are prefixed with `cfg.` to indicate that the value is user-tunable.

Here's an example of how to make a configuration element user-tunable. Assume that we have a native configuration file named `service.conf`. In `service.conf`, the following configuration element is defined:

```
recv_buffer 128
```

We can make this user tunable like this:

```
recv_buffer {{cfg.recv_buffer}}
```

Habitat can read values that it will use to render the templatized config files in three ways:

1. `default.toml` - Each plan includes a `default.toml` file that specifies the default values to use in the absence of any user provided inputs. These files are written in [TOML](https://github.com/toml-lang/toml), a simple config format.

1. At runtime - Users can alter config at runtime using `hab config apply`. The input for this command also uses the TOML format.

1. Environment variable - At start up, tunable config values can be passed to Habitat using environment variables; this most over-riding way of setting these but require you to restart the supervisor to change them.

Here's what we'd add to our project's `default.toml` file to provide a default value for the `recv_buffer` tunable:

```
recv_buffer = 128
```

All templates are written to a config directory, `/hab/svc/<pkg_name>/config`, for the running service. The templates are re-written whenever configuration values change. The path to this directory is available at build time in the plan as the variable `$pkg_svc_config_path` and available at runtime in templates and hooks as `{{pkg.svc_config_path}}`.

## Handlebars Helpers

Habitat not only allows you to use Handlebars-based tunables in your plan, but you can also use both built-in Handlebars helpers as well as Habitat-specific helpers to define your configuration logic.

### Built-in Helpers

### Habitat Helpers

## Runtime Binding

## Creating Composite Packages

## Plan Builds

## Troubleshooting Builds

## Export a Package
