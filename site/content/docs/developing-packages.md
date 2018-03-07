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
* [Binary-only packages]({{< relref "/docs/best-practices.md#binary-wrapper" >}}): Learn how to create packages from software that comes only in binary form, like off-the-shelf or legacy programs.

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

You can use block expressions to add basic logic to your template such as checking if a value exists or iterating through a list of items.

Block expressions use a helper function to perform the logic. The syntax is the same for all block expressions and looks like this:

```
{{#helper blockname}}
  {{expression}}
{{/helper}}
```

Habitat supports the standard built-in helpers:

* if
* unless
* each
* with
* lookup
* > (partials)
* log

Per [Handlebars Paths](http://handlebarsjs.com/#paths), when using `each` in a block expression, you must reference the parent context of that block to use any user-defined configuration values referenced within the block, such as those that start with `cfg`. For example, if your block looked like the following, you must reference `cfg.port` from the parent context of the block:

```
{{#each svc.members ~}}
  server {{sys.ip}}:{{../cfg.port}}
{{/each}}
```

The most common block helpers that you will probably use are the if and with helpers.

The if helper evaluates conditional statements. The values false, 0, "", as well as undefined values all evaluate to false in if blocks.

Here's an example that will only write out configuration for the unixsocket tunable if a value was set by the user:run

```
{{#if cfg.unixsocket ~}}
unixsocket {{cfg.unixsocket}}
{{/if ~}}
```
 > The `~` indicates that whitespace should be omitted when rendering

TOML allows you to create sections (called [TOML tables](https://github.com/toml-lang/toml#table)) to better organize your configuration variables. For example, your default.toml or user defined TOML could have a `[repl]` section for variables controlling replication behavior. Here's what that looks like:

```
[repl]
backlog-size = 200
backlog-ttl = 100
disable-tcp-nodelay = no
```

When writing your template, you can use the `with` helper to reduce duplication:

```
{{#with cfg.repl ~}}
  repl-backlog-size {{backlog-size}}
  repl-backlog-ttl {{backlog-ttl}}
  repl-disable-tcp-nodelay {{disable-tcp-nodelay}}
{{/with ~}}
```

Helpers can also be nested and used together in block expressions. Here is another example from the redis.config file where the `if` and `with` helpers are used together to set up `core/redis` Habitat services in a leader-follower topology.

```
{{#if svc.me.follower ~}}
  slaveof {{svc.leader.sys.ip}} {{svc.leader.cfg.port}}
{/if ~}}
```

Here's an example using `each` to render multiple server entries:

```
{{#each cfg.servers as |server| ~}}
server {
  host {{server.host}}
  port {{server.port}}
}
{{/each ~}}
```

You can also use `each` with `@key` and `this`. Here is an example that takes the `[env]` section of your default.toml and makes an env file you can source from your run hook:

```
{{#each cfg.env ~}}
  export {{toUppercase @key}}={{this}}
{{/each ~}}
```

You would specify the corresponding values in a TOML file using an [array of tables](https://github.com/toml-lang/toml#array-of-tables) like this:

```
[[servers]]
host = "host-1"
port = 4545

[[servers]]
host = "host-2"
port = 3434
```

And for both `each` and `unless`, you can use `@first` and `@last` to specify which item in an array you want to perform business logic on. For example:

```
"mongo": {
  {{#each bind.database.members as |member| ~}}
    {{#if @first ~}}
      "host" : "{{member.sys.ip}}",
      "port" : "{{member.cfg.port}}"
    {{/if ~}}
  {{/each ~}}
}
```

> The `@first` and `@last` variables also work with the Habitat helper `eachAlive`, and in the example above, it would be preferrable to the built-in `each` helper because it checks whether the service is available before trying to retrieve any values.

For `unless`, using `@last` can also be helpful when you need to optionally include delimiters. In the example below, the IP addresses of the alive members returned by the `servers` binding is comma-separated. The logic check `{{#unless @last}}`, `{{/unless}}` at the end ensures that the comma is written after each element except the last element.

```
{{#eachAlive bind.servers.members as |member| ~}}
  "{{member.sys.ip}}"
  {{#unless @last ~}}, {{/unless ~}}
{{/eachAlive ~}}]
```

### Habitat Helpers

Habitat's templating flavour includes a number of custom helpers for writing configuration and hook files.

* [toLowercase](#tolowercase-helper)
* [toUppercase](#touppercase-helper)
* [strReplace](#strreplace-helper)
* [pkgPathFor](#pkgpathfor-helper)
* [eachAlive](#eachalive-helper)
* [toJson](#tojson-helper)
* [toToml](#totoml-helper)
* [toYaml](#toyaml-helper)
* [strJoin](/)
* [strConcat](/)

#### toLowercase Helper

Returns the lowercase equivalent of the given string literal.

```
my_value={{toLowercase "UPPER-CASE"}}
```

#### toUppercase Helper

Returns the uppercase equivalent of the given string literal.

```
my_value={{toUppercase "lower-case"}}
```

#### strReplace Helper

Replaces all matches of a pattern within the given string literal.

```
my_value={{strReplace "this is old" "old" "new"}}
```

This sets `my_value` to "this is new".

#### pkgPathFor Helper

Returns the absolute filepath to the package directory of the package best resolved from the given package identifier. The named package must exist in the `pkg_deps` of the plan from which the template resides. The helper will return a nil string if the named package is not listed in the `pkg_deps`. As result you will always get what you expect and the template won't leak to other packages on the system.

Example Plan Contents:

```
pkg_deps=("core/jre8")
```

Example Template:

```
export JAVA_HOME={{pkgPathFor "core/jre8"}}
```

Example pointing to specific file in `core/nginx` package on disk:

```
{{pkgPathFor "core/nginx"}}/config/fastcgi.conf
```

#### eachAlive Helper

Iterates over a collection of members and renders the template for members that are marked alive.

```
{{~#eachAlive bind.backend.members as |member|}}
server ip {{member.sys.ip}}:{{member.cfg.port}}
{{~/eachAlive}}
```

#### toJson Helper

To output configuration data as JSON, you can use the `toJson` helper.

Given a default.toml that looks like:

```
[web]

[[servers]]
host = "host-1"
port = 4545

[[servers]]
host = "host-2"
port = 3434
```

and a template:

```
{{toJson cfg.web}}
```

when rendered, it will look like:

```
{
  "servers": [
    {
      "host": "host-1",
      "port": 4545
    },
    {
      "host": "host-2",
      "port": 3434
    }
  ]
}
```

This can be useful if you have a configuration file that is in JSON format and has the same structure as your TOML configuration data.

#### toToml Helper

The `toToml` helper can be used to output TOML.

Given a default.toml that looks like:

```
[web]

port = 80
```

and a template:

```
{{toToml cfg.web}}
```

when rendered, it will look like:

```
port = 80
```

This can be useful if you have an app that uses TOML as its configuration file format, but may have not been designed for Habitat, and you only need certain parts of the configuration data in the rendered TOML file.

#### toYaml Helper

The `toYaml` helper can be used to output [YAML](http://yaml.org/).

Given a default.toml that looks like:

```
[web]

port = 80
```

and a template:

```
{{toYaml cfg}}
```

when rendered, it will look like:

```
---
web:
  port: 80
```

The helper outputs a YAML document (with a line beginning with `---`), so it must be used to create complete documents: you cannot insert a section of YAML into an existing YAML document with this helper.

#### strJoin Helper

The `join` helper can be used to create a string with the variables in a list with a separator specified by you. For example, where `list: ["foo", "bar", "baz"]`, `{{strJoin list ","}}` would return `"foo,bar,baz"`.

You cannot join an object (e.g. `{{strJoin web}}`), but you could join the variables in an object (e.g. `{{strJoin web.list "/"}}`).

### strConcat Helper

The `concat` helper can be used to connect multiple strings into one string without a separator. For example, `{{strConcat "foo" "bar" "baz"}}` would return `"foobarbaz"`.

You cannot concatenate an object (e.g. `{{strConcat web}}`), but you could concatenate the variables in an object (e.g. `{{strConcat web.list}}`).

## Runtime Binding

*Runtime binding* in Habitat refers to the ability for one service group to connect to another forming a producer/consumer relationship where the consumer can use the producer's publicly available configuration to configure its services at runtime.

For producing services, you must set `pkg_exports` in your plan.sh to the keys you are exporting and for consuming services, you must set `pkg_binds` or `pkg_binds_optional` in your plan.sh to the keys you wish to consume using a bind name for those values.

For example, you might have a web application `app-server` that depends on a port value of a database service group. Rather than hardcoding the name of the service group or package identifier in `app-server`'s plan, which would limit its portability, you can *bind* the name `database` to the `default` service group running PostgreSQL. This will allow you to dynamically use the port value in any configuration or application lifecycle hooks in your web application.

### Producer Contract

The producer defines their contract by "exporting" configuration publicly to consumers. This is done by setting keys in the `pkg_exports` associative array defined in your package's plan.sh. For example, a database server named `amnesia` might define the exports:

```
pkg_exports=(
  [port]=network.port
  [ssl-port]=network.ssl.port
)
```

This will export the value of `network.port` and `transport.ssl.port` defined in its default.toml publicly as `port` and `ssl-port` respectively. All `pkg_exports` must define a default value in default.toml but their values may change at runtime by an operator configuring the service group. If this happens, the consumer will be notified that their producer's configuration has changed. We'll see how to leverage this on the consumer in the sections below.

Note that Powershell plans use hashtables where Bash plans use associative arrays. A plan.ps1 would declare its exports as:

```
$pkg_exports=@{
  port="network.port"
  ssl-port="network.ssl.port"
}
```

### Consumer Contract

Consumers specify required and optional "binds". These are represented by key/value pairs in an associative array called `pkg_binds` and `pkg_binds_optional` where the values are the exported keys defined by the producer. For example, an application server named `session-server` that depends on a database might define the following binds:

```
pkg_binds=(
  [database]="port ssl-port"
)
```

This says that `session-server` needs to bind to a service aliased as `database` and that service must export a configuration key for both `port` and `ssl-port`. This would make this application service compatible with the producer we defined above for a database called `amnesia` since it does export a value for both of these keys.

A required bind (`pkg_binds`) means that your service fails if it does not find a producer with the exact `binds` values that your service wants available to it. A producer can also export a larger variety of keys than an individual service needs in a required bind.

An optional bind (`pkg_binds_optional`) allows you to have more flexibility for services that require it. You can use an optional bind in several ways (list not conclusive):

* Service group A can optionally bind to "X". It will start without X being present (which could cause the service to fail to start). You may also expose optional configuration in your `default.toml` which you can write into your `config/hooks` in place of where the "X" would normally be satisfying. Real world example: An application service group that binds to a PostgreSQL cluster or RDS, depending on where you are deploying it.

* Service group A can optionally bind to “X”. “X” may provide additional features if it is provided. A runs successfully whether or not "X" is present. Real world example: An application service group that binds to a caching layer in certain situations.

* Service group A can optionally bind to “X” or “Y”. If “X” is present, we operate this way, if “Y” is present, we operate this way. The service will start and may fail because “X” and/or “Y” my not be present at start, but it will eventually start. Real world example: An application service group that could use a Redis backend or a PostgreSQL backend, depending on how you are deploying it in different scenarios.

### Consumer's Configuration Example

Once you've defined both ends of the contract you can leverage the bind in any of your package's hooks or configuration files. Given the two example services above, a section of a configuration file for session-server might look like this:

```
{{~#eachAlive bind.database.members as |member|}}
  database = "{{member.sys.ip}}:{{member.cfg.port}}"
  database-secure = "{{member.sys.ip}}:{{member.cfg.ssl-port}}"
{{~/eachAlive}}
```

### Starting a Consumer

If your application server defined database as a required bind, you would need to provide the Supervisor with the name of a service group running a package which fulfills the contract using the --bind parameter. For example, running the following:

$ hab start my-origin/app-server --bind database:amnesia.default

would create a bind aliasing database to the amnesia service in the default service group.

The service group passed to `--bind database:{service}.{group}` doesn't need to be the service `amnesia`. This bind can be any service as long as they export a configuration key for `port` and `ssl-port`. For example, if you have multiple service groups for PostgreSQL &mdash; perhaps you have a production and development environment &mdash; you could bind `database` to `postgresql.production` or `postgresql.development`.

You can declare bindings to multiple service groups in your templates by using the `--bind` option multiple times on the command line. This means if your web application named `app-server` supports multiple different database backends, you could even bind `database` to another, such as `redis.default` or `mysql.default`. Your service will not start if your package has declared a required bind and a value for it was not specified by `--bind`.

## Creating Composite Packages

> Composite packages are not yet implemented for Powershell plans.

Composites are another type of Habitat package, but one that is all metadata. They allow you to group together services that should be run together on the same Supervisor, enabling you to take better advantage of modern deployment patterns with your Habitat services.

Because these services use the same Supervisor, this also means they are running on the same machine. They are related services, but they are distinct enough to remain separate; they run separate processes, have separate development lifecycles, and so on. Examples of this pattern include: database and archiver (such as [WAL-E](https://github.com/wal-e/wal-e) for Postgres), service and a service mesh proxy (such as [Envoy](https://github.com/envoyproxy/envoy)), and service and log aggregation agent.

Composites should be considered a preview feature with functionality that is still being updated and refined. The goal for composites is for related member services to be seen as a single service by other Supervisors in a ring. That is, you would query, apply config updates, and perform other operations by addressing the composite as a singular service. Current limitations with this feature are described [here](https://www.habitat.sh/docs/developing-packages/#limitations).

> Because composite functionality is a preview feature, it is not recommended to use it as part of production workflows at this time.

Like other packages, composite packages are built from a plan.sh file.

```
pkg_origin="yourorigin"
pkg_name="composite-example"
pkg_type="composite"
pkg_version="0.1.0"

pkg_services=(
    origin/package1
    origin/package2
)

pkg_bind_map=(
    [origin/package2]="http:origin/package1"
)
```

The `pkg_origin`, `pkg_name`, and `pkg_version` settings serve the same role they do in other Habitat packages, but `pkg_type`, `pkg_services`, and `pkg_bind_map` are only specific to composite packages.

Plans for composite packages must have the `pkg_type` setting set to the string `"composite"`. Without `pkg_type` defined, the package is assumed to be a "standalone" package type, which is the default type for non-composite packages.

The `pkg_services` array is where you enumerate all the services that are in your composite package. Services are defined as having a binary that gets executed via a `run` hook. By default, these should be either packages you have built and/or installed on your local workstation, or packages that are in the `stable` channel in Builder. If you wish to use packages that are in the `unstable` channel, specify `HAB_BLDR_CHANNEL=unstable` in your environment when you build your composite package.

> You must specify at least two services in the `pkg_services` array.

The last composite-specific setting, `pkg_bind_map`, lets you declare all the binding relationships between all the services in your composite package. In the example above, `origin/package2` has a bind named `http` that is satisfied by the `origin/package1` service. Additional binds can be added by separating them with spaces, for example `"http:origin/package1 otherbind:origin/package3"`.

### Using Composite Packages

To use a composite package:

* Build it in a local Studio environment as you would any other package
* Upload and promote it if needed
* Run `hab svc load`
* Run `hab svc start`

> As with standalone packages, you can also reference a local composite package file directly when running the `hab svc load` subcommand.

Loading a composite and running it as a service will download and install all referenced services, if needed. Specific versions of the services used during the composite package build will be used when the composite package is loaded, started, or installed.

```
$ hab svc load cm/composite-example --channel unstable
» Installing cm/composite-example from channel 'unstable'
→ Using cm/composite-example/0.1.0/20171005220452
★ Install of cm/composite-example/0.1.0/20171005220452 complete with 0 new packages installed.
hab-sup(MN): The cm/composite-example-api-proxy service was successfully loaded
hab-sup(MN): The cm/sample-node-app service was successfully loaded
hab-sup(MN): The cm/composite-example composite was successfully lo
```

The update strategy, Builder URL, update channel, application environment, service group, and topology are all currently shared by members of the composite.

After you have loaded your composite, you can start it up with `hab svc run`. If you look at the Supervisor's output, you will see the services in your composite start up.

```
hab-sup(MR): Supervisor Member-ID d6df5da3056146c281d5ccfa27c47efa
hab-sup(MR): Starting gossip-listener on 0.0.0.0:9638
hab-sup(MR): Starting http-gateway on 0.0.0.0:9631
hab-sup(MR): Starting cm/sample-node-app
hab-sup(MR): Starting cm/composite-example-api-proxy
sample-node-app.default(HK): init, compiled to /hab/svc/sample-node-app/hooks/init
sample-node-app.default(HK): Hooks compiled
sample-node-app.default(SR): Hooks recompiled
default(CF): Updated app_env.sh ba78899e39891feeadd2ce7bb1ec6a990f58b8dc22433f1b705ce8a610eaa97f
default(CF): Updated config.json 3f22842e8d737bbb107d9ac19afba42642eccf68a06ddfbdba70507b23b8498a
sample-node-app.default(SR): Configuration recompiled
sample-node-app.default(SR): Initializing
sample-node-app.default(SV): Starting service as user=hab, group=hab
composite-example-api-proxy.default(HK): run, compiled to /hab/svc/composite-example-api-proxy/hooks/run
composite-example-api-proxy.default(HK): Hooks compiled
composite-example-api-proxy.default(SR): Hooks recompiled
default(CF): Updated nginx.conf f4c9490bac250b99083f3c34c3863c2fb63368aa9d1ff0d67120857e3674a89a
composite-example-api-proxy.default(SR): Configuration recompiled
composite-example-api-proxy.default(SR): Initializing
composite-example-api-proxy.default(SV): Starting service as user=root, group=hab
```

Running `hab svc stop` on a composite package stops all services in the composite.

You can also retrieve the current runtime status of a composite by running `hab svc status` just as you would for any standalone service. The output of that command displays the name of the composite service. Any standalone services are denoted by the string "standalone."

#### Force-loading Composite Services

When using the `--force` option with `hab svc load`, the normal behavior of loading or reloading an already loaded service takes on some additional complexity when using composite services.

If you do not change the identifier you refer to the composite service as (e.g. `origin/composite-example`), the behavior is similar to a standalone service in that already-loaded composites services are reloaded. If any flags are supplied during `hab svc load`, those values get set for all the composite's services.

If you **do** change the identifier, (e.g. from `origin/composite-example` to `origin/composite-example/2.0`), then potentially different versions of a composite could have very different member services. For example, the latest version of `origin/composite` could reference different services compared to `origin/composite/2.0`. Some will be in common, some will be removed, and some will be added. In the case where services are removed, they will be unloaded when loading a different version of the composite. And any old configurations of services present in both the old and new composites are discarded completely in favor of the new values.

If you do not always use the latest version of the composite by specifying `origin/package` as the identifier, you might not have a consistent set of services loaded, since Habitat runs the latest version of a service that will satisfy the identifier.

> This is not an issue in composites that contain services described by fully-qualified identifiers, since those exact versions would always be run.

#### Additional Binding Support

In addition to binding between services in a composite package, you can also bind to services outside of the composite package through the `--bind` option as you would between two standalone services. When loading composites, you specify a three-part binding with the following format:

```
$ hab svc load yourorigin/composite-example --bind <composite-service>:<bind_name>:<service_group>
```

This is effectively a "normal" binding, prefixed by the service in the composite it applies to. For this type of binding, composites can be thought of as one unified service (instead of as the container for multiple services that it is), so you can think of these 3-part binds as the binds of that one service.

### Limitations

While you can install, start, stop, load, and unload composite packages, they have the following limitations:

* The individual services are still available and addressable just as though you'd started them manually.
* Composite packages are not directly addressable as though they were services themselves.
* They cannot do anything like export selected values from their constituent services as "composite-level exports", or map "composite-level binds" onto constituent service binds.
* A composite package as a whole does not update itself like an individual service can; however, the constituent services of a composite can continue to update independently of each other.
* At this time, composite package support is only available for Linux services.
* Composites will not function properly on any Supervisor running with an organization set (e.g. specifying `--org` when running `hab start`).


## Plan Builds

Packages need to be signed with a secret origin key at buildtime. Generate an origin key pair manually by running the following command on your host machine:

```
$ hab origin key generate <originname>
```

The `hab-origin` subcommand will place originname-timestamp.sig.key and originname-timestamp.pub files (the origin key pair) in the `$HOME/.hab/cache/keys directory`. If you're creating origin keys in the Studio container or you are running as root on a Linux machine, your keys will be stored in `/hab/cache/keys`.

Because the secret key is used to sign your package, it should not be shared freely; however, if anyone wants to download and use your package, then they must have your public key (.pub) installed in their local `$HOME/.hab/cache/keys` or `/hab/cache/keys` directory. Public keys will be downloaded from Habitat Builder by the Supervisor, if needed.

### Passing origin keys into the Studio

When you enter the Studio environment, your origin keys are not automatically shared into it. This is to keep the Studio environment as clean as possible. However, because you need to reference a secret origin key to sign your package, you can do this in three ways:

* Set `HAB_ORIGIN` to the name of the secret origin key you intend to use before entering the Studio, like export `HAB_ORIGIN=originname`.
* Set `HAB_ORIGIN_KEYS` to one or more key names, separated by commas, like export `HAB_ORIGIN_KEYS=originname-internal,originname-test,originname`.
* Use the `-k` flag (short for "keys") which accepts one or more key names separated by commas with `hab studio -k originname-internal,originname-test enter`.

The first way overrides the `HAB_ORIGIN` environment variable to import public and secret keys into the Studio environment and override any `pkg_origin` values in the packages that you build. This is useful if you want to not only build your package, but also you can use this to build your own versions of other packages, such as `originname/node` or `originname/glibc`.

The second and third way import multiple secret keys that must match the origin names for the plans you intend to build.

After you create or receive your secret origin key, you can start up the Studio and build your package.

### Interactive Build

An interactive build is one in which you enter a Habitat Studio to perform the build. Doing this allows you to examine the build environment before, during, and after the build.

The directory where your plan is located is known as the plan context.

1. Change to the parent directory of the plan context.

1. Create and enter a new Habitat Studio. If you have defined an origin and origin key during `hab setup` or by explicitly setting the `HAB_ORIGIN` and `HAB_ORIGIN_KEYS` environment variables, then type the following:

    ```
    $ hab studio enter
    ```

    The directory you were in is now mounted as `/src` inside the Studio. By default, a Supervisor runs in the background for iterative testing. You can see the streaming output by running `sup-log`. Type `Ctrl-C` to exit the streaming output and `sup-term` to terminate the background Supervisor. If you terminate the background Supervisor, then running `sup-run` will restart it and running `hab start origin/package` will restart every package that was previously loaded. You have to explicitly run `hab svc unload origin/package` to remove a package from the "loaded" list.

1. Enter the following command to create the package.

    ```
    $ build /src/planname
    ```

1. If the package builds successfully, it is placed into a `results` directory at the same level as your plan.

#### Managing the type of Studio to enter (Docker/Linux/Windows)

Depending on the platform of your host and your Docker configuration, the behavior of `hab studio enter` may vary. Here is the default behavior listed by host platform:

* Linux - A local chrooted Linux Studio. You can force a Docker based studio by using the `-D` flag.
* Mac - A Docker container based Linux Studio
* Windows - A Docker container based Studio where the platform depends on the mode your Docker service is running, which can be toggled between Linux Containers and Windows Containers. Make sure your Docker service is running in the correct mode for the kind of studio you wish to enter. You may also use the `-w` flag to enter a local, non-containerized Windows studio.

> For more details related to Windows containers see [Running Habitat Windows Containers]({{< relref "/docs/best-practices.md#running-habitat-windows-containers" >}}).

### Non-Interactive Build

A non-interactive build is one in which Habitat creates a Studio for you, builds the package inside it, and then destroys the Studio, leaving the resulting `.hart` on your computer. Use a non-interactive build when you are sure the build will succeed, or in conjunction with a continuous integration system.

1. Change to the parent directory of the plan context.

1. Build the package in an unattended fashion, passing the name of the origin key to the command.

    ```
    $ hab pkg build yourpackage -k yourname
    ```

    > Similar to the `hab studio enter` command above, the type of studio where the build runs is determined by your host platform and `hab pkg build` takes the same `-w` and `-D` flags to adjust the studio environment if desired.

1. The resulting package is inside a directory called `results`, along with any build logs and a build report (`last_build.env`) that includes machine-parseable metadata about the build.

By default, the Studio is reset to a clean state after the package is built. However, if you are using the Linux version of `hab`, you can reuse a previous Studio when building your package by specifying the `-R` option when calling the `hab pkg build` subcommand.

For more information on how to set up and install Habitat and how to run a sample Ruby-on-Rails app in Habitat, see the [tutorials page](/tutorials/).

For information on the contents of an installed package, see [Package contents]({{< relref "/docs/reference.md#package-contents" >}}).




## Troubleshooting Builds

While working on plans, you may wish to stop the build and inspect the environment at any point during a build phase (e.g. download, build, unpack, etc.). In Bash based plans, Habitat provides an `attach` function for use in your plan.sh that functions like a debugging breakpoint and provides an easy REPL at that point.

To use `attach`, insert it into your plan at the point where you would like to use it, e.g.

> `attach` is only available in `plan.sh` files and not in Powershell based plans.

```
do_build() {
   attach
   ...
 }
```

Now, perform a build -- we recommend using an interactive studio so you do not need to set up the environment from scratch for every build.

```
$ hab studio enter
```

```
$ build yourapp
```

The build system will proceed until the point where the `attach` function is invoked, and then drop you into a limited shell:


```
### Attaching to debugging session

From: /src/yourapp/plan.sh @ line 15 :
    5: pkg_maintainer="The Habitat Maintainers <humans@habitat.sh>"
    6: pkg_source=http://download.yourapp.io/releases/${pkg_name}-${pkg_version}.tar.gz
    7: pkg_shasum=c2a791c4ea3bb7268795c45c6321fa5abcc24457178373e6a6e3be6372737f23
    8: pkg_bin_dirs=(bin)
    9: pkg_build_deps=(core/make core/gcc)
    10: pkg_deps=(core/glibc)
    11: pkg_exports=(
    12:   [port]=srv.port
    13: )
    14:
    15: do_build() {
 => 16:   attach
    17:   make
    18: }
[1] yourapp(do_build)>
```

You can use basic Linux commands like `ls` in this environment. You can also use the `help` command the Habitat build system provides in this context to see what other functions can help you debug the plan.

```
[1] yourapp(do_build)> help
Help
  help          Show a list of command or information about a specific command.

Context
  whereami      Show the code surrounding the current context
                (add a number to increase the lines of context).

Environment
  vars          Prints all the environment variables that are currently in scope.

Navigating
  exit          Pop to the previous context.
  exit-program  End the /hab/pkgs/core/hab-plan-build/0.6.0/20160604180818/bin/hab-plan-build program.

Aliases
  @             Alias for whereami.
  quit          Alias for exit.
  quit-program  Alias for exit-program.
```

Type `quit` when you are done with the debugger, and the remainder of the build will continue. If you wish to abort the build entirely, type `quit-program`.

### Using Set-PSBreakpoint in Powershell plans

While there is no `attach` function exposed in a plan.ps1 file, one can use the native Powershell cmdlet `Set-PSBreakpoint` to access virtually the same functionality. Instead of adding `attach` to your `Invoke-Build` function, enter the following from inside your studio shell:

```
[HAB-STUDIO] Habitat:\src> Set-PSBreakpoint -Command Invoke-Build
```

Now upon running `build` you should enter an interactive prompt inside the context of the Invoke-Build function:

```
habitat-aspnet-sample: Building
Entering debug mode. Use h or ? for help.

Hit Command breakpoint on 'Invoke-Build'

At C:\src\habitat\plan.ps1:26 char:23
+ function Invoke-Build {
+                       ~
[HAB-STUDIO] C:\hab\cache\src\habitat-aspnet-sample-0.2.0>>
```

You can now call Powershell commands to inspect variables (like `Get-ChildItem variable:\`) or files to debug your build.

## Export a Package

Packages can be exported into multiple external, immutable runtime formats. This topic will be updated as more formats are supported in the future. Currently there are exports for: docker, ACI, mesos, tar, and cloudfoundry.

The command to export a package is `hab pkg export <FORMAT> <PKG_IDENT>`. See the [Habitat CLI Reference]({{< relref "/docs/habitat-cli.md#hab-pkg-export" >}}) Guide for more CLI information.

> If you specify an origin/package identifier, such as core/postgresql, the Habitat CLI will check Builder for the latest stable version of the package and export that.

Read on for more detailed instructions.

### Exporting to Docker

You can create a Docker container image for any package by performing the following steps:

1. Ensure you have a Docker daemon running on your host system. On Linux, the exporter shares the Docker socket (`unix:///var/run/docker.sock`) into the studio.

1. Create an interactive studio with the `hab studio enter` command.

1. Build the Habitat package from which you want to create a Docker container image and then run the Docker exporter on the package.

    ```
    $ build
    $ hab pkg export docker ./results/<hart-filename>.hart
    ```

    > The command above is for local testing only. If you have uploaded your package to Builder, you can export it by calling `hab pkg export docker origin/package`. The default is to use the latest stable release; however, you can override that by specifying a different channel in an optional flag.

    > In a Windows container studio, the `export` command will not be able to access the host docker engine. To export a Windows package or hart file built inside of a Windows container studio, first exit the studio and then export the `.hart` file in your local `results` directory.

1. You can now exit the studio. The new Docker container image exists on your computer and can be examined with `docker images` or run with `docker run`.

For an example of using Docker Compose to run multiple Habitat containers together, see the Run the Sample App step in the Build a Sample App tutorial.

### Exporting to a Tarball

1. Enter the habitat studio by using `hab studio enter`.

1. Install or build the Habitat package from which you want to create a tarball, for example:

    ```
    $ hab pkg install yourorigin/yourpackage
    ```

1. Run the tar exporter on the package.

    ```
    $ hab pkg export tar yourorigin/yourpackage
    ```

1. Your package in a tar file exists locally on your computer in the format `origin-package-version-timestamp.tar.gz` and can be deployed and run on a target machine.

1. If you wish to run this tar file on a remote machine (i.e. a virtual machine in a cloud environment), `scp` (or whatever transfer protocol you prefer) the file to the machine on which you wish to run it.

1. Connect to that machine (e.g., over `ssh`).

1. Create the required user and group &mdash; for example, on an Ubuntu server:

    ```
    $ sudo groupadd hab
    $ sudo useradd -g hab hab
    ```

1. Unpack your tar file:

    ```
    $ sudo tar xf your-origin-package-version-timestamp.tar.gz
    ```

1. Start your package using the `hab` binary, which is included in the tar archive:

    ```
    $ sudo /hab/bin/hab start yourorigin/yourpackage
    ```

### Exporting to an Application Container Image (ACI)

You can create an Application Container Image (ACI) for any package by performing the following steps:

1. Create an interactive studio in any directory with the `hab studio enter` command.

1. Install or build the Habitat package from which you want to create an ACI, for example:

    ```
    $ hab pkg install yourorigin/yourpackage
    ```

1. Run the ACI exporter on the package.

    ```
    $ hab pkg export aci yourorigin/yourpackage
    ```

1. Note that this will create unsigned ACI images. If you wish to sign your ACI with default options, pass `SIGN=true`:

    ```
    $ SIGN=true hab pkg export aci yourorigin/yourpackage
    ```

1. The `.aci` can now be moved to any runtime capable of running ACIs (e.g. [rkt](https://coreos.com/rkt/) on CoreOS) for execution.


### Exporting to Kubernetes

The Kubernetes exporter is an additional command line subcommand to the standard Habitat CLI interface. It leverages the existing Docker image export functionality and, additionally, generates a Kubernetes manifest that can be deployed to a Kubernetes cluster running the Habitat operator.

1. Create an interactive studio in any directory with the `hab studio enter` command.

1. Install or build the Habitat package from which you want to create an application, for example:

    ```
    $ hab pkg install yourorigin/yourpackage
    ```

1. Run the Kubernetes exporter on the package.

    ```
    $ hab pkg export kubernetes yourorigin/yourpackage
    ```

    You can run `hab pkg export kubernetes --help` to see the full list of available options and general help.

More information and a demo video is available in [the announcement blog post](https://kinvolk.io/blog/2017/12/introducing-the-habitat-kubernetes-exporter/).

### Exporting to a Helm chart

The Helm exporter is an additional command line subcommand to the standard Habitat CLI interface. It is very similar to the Kubernetes exporter but it takes you even further. It also leverages the existing Docker image export functionality but unlike the Kubernetes exporter, instead of generating a Kubernetes manifest, it creates a distributable Helm chart directory. This chart directory can not only be deployed in your local Kubernetes cluster, but also easily packaged and distributed.

Additionally, the Kubernetes Habitat operator is automatically added to the Helm chart as a dependency and hence installed automatically as part of the Habitat Helm chart.

1. Create an interactive studio in any directory with the `hab studio enter` command.

1. Install or build the Habitat package from which you want to create an application, for example:

    ```
    $ hab pkg install yourorigin/yourpackage
    ```

1. Run the Helm exporter on the package.

    ```
    $ hab pkg export helm yourorigin/yourpackage
    ```

    You can run `hab pkg export helm --help` to see the full list of available options and general help.

More information on how to set up Helm and use of the Helm exporter can be found in [the announcement blog post](https://www.habitat.sh/blog/2018/02/Habitat-Helm/).

### Exporting to Apache Mesos and DC/OS

1. Create an interactive studio in any directory with the `hab studio enter` command.

1. Install or build the Habitat package from which you want to create a Marathon application, for example:

    ```
    $ hab pkg install yourorigin/yourpackage
    ```

1. Run the Mesos exporter on the package.

    ```
    $ hab pkg export mesos yourorigin/yourpackage
    ```

    This will create a Mesos container-format tarball in the results directory, and also print the JSON needed to load the application into Marathon. Note that the tarball needs to be uploaded to a download location and the "uris" in the JSON need to be updated manually. This is an example of the output:

    ```
    { "id": "yourorigin/yourpackage", "cmd": "/bin/id -u hab &>/dev/null || /sbin/useradd hab; /bin/chown -R hab:hab *;
    mount -t proc proc proc/; mount -t sysfs sys sys/;mount -o bind /dev dev/; /usr/sbin/chroot . ./init.sh start
    yourorigin/yourpackage", "cpus": 0.5, "disk": 0, "mem": 256, "instances": 1, "uris":
    ["https://storage.googleapis.com/mesos-habitat/yourorigin/yourpackage-0.0.1-20160611121519.tgz" ] }
    ```

    Note that the default resource allocation for the application is very small: 0.5 units of CPU, no disk, one instance, and 256MB of memory. To change these resource allocations, pass different values to the Mesos exporter as command line options (defaults are documented with `--help`).

See the article [Apache Mesos and DC/OS]({{> relref "/docs/best-practices.m/#mesos-dcos" }}) for more information on getting your application running on Mesos.

### Exporting to Cloud Foundry

Packages can be exported to run in a [Cloud Foundry platform](https://www.cloudfoundry.org/certified-platforms/) through the use of a Docker image that contains additional layers meant to handle mapping from the Cloud Foundry environment to a Habitat default.toml file.

#### Setting up Docker support in Cloud Foundry

If you have not done so already, you must enable Docker support for Cloud Foundry before you can upload your Cloud Foundry-specific Docker image.

To do so, make sure you have done the following:

1. Log in as an Admin user.

1. Enable Docker support on your Cloud Foundry deployment by enabling the `diego_docker` feature flag.

    ```
     cf enable-feature-flag diego_docker
    ```

#### Creating a Mapping file

The mapping file is a TOML file that can add Bash-interpolated variables and scripts. The Bash code will have access to:

* all environment variables
* the jq binary
* the helper methods listed below

Here's an example of a mapping TOML file named `cf-mapping.toml`:

```
secret_key_base = "$SECRET_KEY_BASE"
rails_env = "$RAILS_ENV"
port = ${PORT}

[db]
user = "$(service "elephantsql" '.credentials.username')"
password = "$(service "elephantsql" '.credentials.password')"
host = "$(service "elephantsql" '.credentials.host')"
name = "$(service "elephantsql" '.credentials.database')"
```

##### Helpers

The helper methods are designed to extract information from the standard Cloud Foundry environment variables [VCAP_SERVICES](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES) and [VCAP_APPLICATION](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-APPLICATION).

* `service <service-name> <jq-expression>` will extract the JSON associated with the given service-name from the `VCAP_SERVICES` environment variable and apply the jq-expression to it.
* `application <jq-expression>` will apply the jq-expression to the `VCAP_APPLICATION` environment variable

#### Exporting and Pushing to a Cloud Foundry Endpoint

1. Create a mapping.toml file using the format specified above and place that file in your local project repo.

1. Enter the Studio through `hab studio enter`.

1. Install or build the package that you want to export.

    ```
    $ hab pkg install <ORIGIN>/<PACKAGE>
    ```

1. Run the Cloud Foundry exporter on the package.

    ```
    $ hab pkg export cf yourorigin/yourpackage /path/to/mapping.toml
    ```

    > To generate this image, a base Docker image is also created. The Cloud Foundry version of the docker image will have cf- as a prefix in the image tag.

1. (Optional) If you are creating a web app that binds to another Cloud Foundry service, such as ElephantSQL, you must have this service enabled in your deployment before running your app.

1. [Upload your Docker image to a supported registry](https://docs.cloudfoundry.org/devguide/deploy-apps/push-docker.html). Your Docker repository should be match the `origin/package` identifier of your package.

    ```
    $ docker push <ORIGIN>/<PACKAGE>:cf-version-release
    ```

1. After your Cloud Foundry Docker image is built, you can deploy it to a Cloud Foundry platform.

    ```
    $cf push cf push APP-NAME --docker-image docker_org/repository
    ```

Your application will start after it has been successfully uploaded and deployed.
