---
title: Habitat CLI
draft: false
---

# Habitat Command-Line Interface (CLI) Reference

The commands for the Habitat CLI (`hab`) are listed below.

* Version: hab 0.53.0/20180205213018

* Platform: linux
* Generated: Fri Mar 09 2018 17:15:53 GMT+0000 (UTC)


## hab



**USAGE**

```
hab [SUBCOMMAND]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```


**SUBCOMMANDS**

```
bldr      Commands relating to Habitat Builder
cli       Commands relating to Habitat runtime config
config    Commands relating to Habitat runtime config
file      Commands relating to Habitat files
help      Prints this message or the help of the given subcommand(s)
origin    Commands relating to Habitat origin keys
pkg       Commands relating to Habitat packages
plan      Commands relating to plans and other app-specific configuration.
ring      Commands relating to Habitat rings
studio    Commands relating to Habitat Studios
sup       Commands relating to the Habitat Supervisor
svc       Commands relating to Habitat services
user      Commands relating to Habitat users
```




**ALIASES**

```
apply      Alias for: 'config apply'
install    Alias for: 'pkg install'
run        Alias for: 'sup run'
setup      Alias for: 'cli setup'
start      Alias for: 'svc start'
stop       Alias for: 'svc stop'
term       Alias for: 'sup term'
```


[&uarr; Top](#)

* [bldr](#hab-bldr): Commands relating to Habitat Builder
* [cli](#hab-cli): Commands relating to Habitat runtime config
* [config](#hab-config): Commands relating to Habitat runtime config
* [file](#hab-file): Commands relating to Habitat files
* [origin](#hab-origin): Commands relating to Habitat origin keys
* [pkg](#hab-pkg): Commands relating to Habitat packages
* [plan](#hab-plan): Commands relating to plans and other app-specific configuration.
* [ring](#hab-ring): Commands relating to Habitat rings
* [studio](#hab-studio): Commands relating to Habitat Studios
* [sup](#hab-sup): Commands relating to the Habitat Supervisor
* [svc](#hab-svc): Commands relating to Habitat services
* [user](#hab-user): Commands relating to Habitat users

## hab bldr

**DESCRIPTION**

```
Commands relating to Habitat Builder
```


**USAGE**

```
hab bldr [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
channel    Commands relating to Habitat Builder channels
encrypt    Reads a stdin stream containing plain text and outputs an encrypted representation
help       Prints this message or the help of the given subcommand(s)
job        Commands relating to Habitat Builder jobs
```






[&uarr; Top](#)

* [channel](#hab-bldr-channel): Commands relating to Habitat Builder channels
* [encrypt](#hab-bldr-encrypt): Reads a stdin stream containing plain text and outputs an encrypted representation
* [job](#hab-bldr-job): Commands relating to Habitat Builder jobs

### hab bldr channel

**DESCRIPTION**

```
Commands relating to Habitat Builder channels
```


**USAGE**

```
hab bldr channel [SUBCOMMAND]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```


**SUBCOMMANDS**

```
create     Creates a new channel
destroy    Destroys a channel
help       Prints this message or the help of the given subcommand(s)
list       Lists origin channels
```






[&uarr; Top](#)

* [create](#hab-bldr-channel-create): Creates a new channel
* [destroy](#hab-bldr-channel-destroy): Destroys a channel
* [list](#hab-bldr-channel-list): Lists origin channels

### hab bldr channel create

**DESCRIPTION**

```
Creates a new channel
```


**USAGE**

```
hab bldr channel create [OPTIONS] <CHANNEL>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<CHANNEL>    The channel name
```




[&uarr; Top](#)



### hab bldr channel destroy

**DESCRIPTION**

```
Destroys a channel
```


**USAGE**

```
hab bldr channel destroy [OPTIONS] <CHANNEL>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<CHANNEL>    The channel name
```




[&uarr; Top](#)



### hab bldr channel list

**DESCRIPTION**

```
Lists origin channels
```


**USAGE**

```
hab bldr channel list [OPTIONS] [ORIGIN]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<ORIGIN>    The origin for which channels will be listed. Default is from 'HAB_ORIGIN' or cli.toml
```




[&uarr; Top](#)



### hab bldr encrypt

**DESCRIPTION**

```
Reads a stdin stream containing plain text and outputs an encrypted representation
```


**USAGE**

```
hab bldr encrypt [OPTIONS]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```








[&uarr; Top](#)



### hab bldr job

**DESCRIPTION**

```
Commands relating to Habitat Builder jobs
```


**USAGE**

```
hab bldr job [SUBCOMMAND]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```


**SUBCOMMANDS**

```
cancel     Cancel a build job group and any in-progress builds
demote     Demote packages from a completed build job to a specified channel
help       Prints this message or the help of the given subcommand(s)
promote    Promote packages from a completed build job to a specified channel
start      Schedule a build job or group of jobs
status     Get the status of a job group
```






[&uarr; Top](#)

* [cancel](#hab-bldr-job-cancel): Cancel a build job group and any in-progress builds
* [demote](#hab-bldr-job-demote): Demote packages from a completed build job to a specified channel
* [promote](#hab-bldr-job-promote): Promote packages from a completed build job to a specified channel
* [start](#hab-bldr-job-start): Schedule a build job or group of jobs
* [status](#hab-bldr-job-status): Get the status of a job group

### hab bldr job cancel

**DESCRIPTION**

```
Cancel a build job group and any in-progress builds
```


**USAGE**

```
hab bldr job cancel [OPTIONS] <GROUP_ID>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<GROUP_ID>    The job group id that was returned from "hab bldr job start" (ex: 771100000000000000)
```




[&uarr; Top](#)



### hab bldr job demote

**DESCRIPTION**

```
Demote packages from a completed build job to a specified channel
```


**USAGE**

```
hab bldr job demote [FLAGS] [OPTIONS] <GROUP_ID> <CHANNEL>
```


**FLAGS**

```
-i, --interactive    Allow editing the list of demotable packages
-v, --verbose        Show full list of demotable packages
-h, --help           Prints help information
-V, --version        Prints version information
```




**ARGS**

```
<GROUP_ID>    The job id that was returned from "hab bldr start" (ex: 771100000000000000)
<CHANNEL>     The target channel name
```




[&uarr; Top](#)



### hab bldr job promote

**DESCRIPTION**

```
Promote packages from a completed build job to a specified channel
```


**USAGE**

```
hab bldr job promote [FLAGS] [OPTIONS] <GROUP_ID> <CHANNEL>
```


**FLAGS**

```
-i, --interactive    Allow editing the list of promotable packages
-v, --verbose        Show full list of promotable packages
-h, --help           Prints help information
-V, --version        Prints version information
```




**ARGS**

```
<GROUP_ID>    The job id that was returned from "hab bldr job start" (ex: 771100000000000000)
<CHANNEL>     The target channel name
```




[&uarr; Top](#)



### hab bldr job start

**DESCRIPTION**

```
Schedule a build job or group of jobs
```


**USAGE**

```
hab bldr job start [FLAGS] [OPTIONS] <PKG_IDENT>
```


**FLAGS**

```
-g, --group      Schedule jobs for this package and all of its reverse dependencies
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    The origin and name of the package to schedule a job for (eg: core/redis)
```




[&uarr; Top](#)



### hab bldr job status

**DESCRIPTION**

```
Get the status of a job group
```


**USAGE**

```
hab bldr job status [OPTIONS] <GROUP_ID|--origin <ORIGIN>>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<GROUP_ID>    The group id that was returned from "hab bldr job start" (ex: 771100000000000000)
```




[&uarr; Top](#)



## hab cli

**DESCRIPTION**

```
Commands relating to Habitat runtime config
```


**USAGE**

```
hab cli [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
completers    Creates command-line completers for your shell.
help          Prints this message or the help of the given subcommand(s)
setup         Sets up the CLI with reasonable defaults.
```






[&uarr; Top](#)

* [completers](#hab-cli-completers): Creates command-line completers for your shell.
* [setup](#hab-cli-setup): Sets up the CLI with reasonable defaults.

### hab cli completers

**DESCRIPTION**

```
Creates command-line completers for your shell.
```


**USAGE**

```
hab cli completers --shell <SHELL>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```








[&uarr; Top](#)



### hab cli setup

**DESCRIPTION**

```
Sets up the CLI with reasonable defaults.
```


**USAGE**

```
hab cli setup
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```








[&uarr; Top](#)



## hab config

**DESCRIPTION**

```
Commands relating to Habitat runtime config
```


**USAGE**

```
hab config [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
apply    Applies a configuration to a group of Habitat Supervisors
help     Prints this message or the help of the given subcommand(s)
```






[&uarr; Top](#)

* [apply](#hab-config-apply): Applies a configuration to a group of Habitat Supervisors

### hab config apply

**DESCRIPTION**

```
Applies a configuration to a group of Habitat Supervisors
```


**USAGE**

```
hab config apply [OPTIONS] <SERVICE_GROUP> <VERSION_NUMBER> [FILE]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<SERVICE_GROUP>     Target service group (ex: redis.default)
<VERSION_NUMBER>    A version number (positive integer) for this configuration (ex: 42)
<FILE>              Path to local file on disk (ex: /tmp/config.toml, default: <stdin>)
```




[&uarr; Top](#)



## hab file

**DESCRIPTION**

```
Commands relating to Habitat files
```


**USAGE**

```
hab file [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
help      Prints this message or the help of the given subcommand(s)
upload    Upload a file to the Supervisor ring.
```






[&uarr; Top](#)

* [upload](#hab-file-upload): Upload a file to the Supervisor ring.

### hab file upload

**DESCRIPTION**

```
Upload a file to the Supervisor ring.
```


**USAGE**

```
hab file upload [OPTIONS] <SERVICE_GROUP> <VERSION_NUMBER> <FILE>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<SERVICE_GROUP>     Target service group (ex: redis.default)
<VERSION_NUMBER>    A version number (positive integer) for this configuration (ex: 42)
<FILE>              Path to local file on disk
```




[&uarr; Top](#)



## hab origin

**DESCRIPTION**

```
Commands relating to Habitat origin keys
```


**USAGE**

```
hab origin [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
help    Prints this message or the help of the given subcommand(s)
key     Commands relating to Habitat origin key maintenance
```






[&uarr; Top](#)

* [key](#hab-origin-key): Commands relating to Habitat origin key maintenance

### hab origin key

**DESCRIPTION**

```
Commands relating to Habitat origin key maintenance
```


**USAGE**

```
hab origin key [SUBCOMMAND]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```


**SUBCOMMANDS**

```
download    Download origin key(s) to HAB_CACHE_KEY_PATH
export      Outputs the latest origin key contents to stdout
generate    Generates a Habitat origin key
help        Prints this message or the help of the given subcommand(s)
import      Reads a stdin stream containing a public or secret origin key contents and writes the key to disk
upload      Upload origin keys to Builder
```






[&uarr; Top](#)

* [download](#hab-origin-key-download): Download origin key(s) to HAB_CACHE_KEY_PATH
* [export](#hab-origin-key-export): Outputs the latest origin key contents to stdout
* [generate](#hab-origin-key-generate): Generates a Habitat origin key
* [import](#hab-origin-key-import): Reads a stdin stream containing a public or secret origin key contents and writes the key to disk
* [upload](#hab-origin-key-upload): Upload origin keys to Builder

### hab origin key download

**DESCRIPTION**

```
Download origin key(s) to HAB_CACHE_KEY_PATH
```


**USAGE**

```
hab origin key download [FLAGS] [OPTIONS] <ORIGIN> [REVISION]
```


**FLAGS**

```
-s, --secret     Download secret key instead of public key
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<ORIGIN>      The origin name
<REVISION>    The key revision
```




[&uarr; Top](#)



### hab origin key export

**DESCRIPTION**

```
Outputs the latest origin key contents to stdout
```


**USAGE**

```
hab origin key export [OPTIONS] <ORIGIN>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<ORIGIN>
```




[&uarr; Top](#)



### hab origin key generate

**DESCRIPTION**

```
Generates a Habitat origin key
```


**USAGE**

```
hab origin key generate [ORIGIN]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<ORIGIN>    The origin name
```




[&uarr; Top](#)



### hab origin key import

**DESCRIPTION**

```
Reads a stdin stream containing a public or secret origin key contents and writes the key to disk
```


**USAGE**

```
hab origin key import
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```








[&uarr; Top](#)



### hab origin key upload

**DESCRIPTION**

```
Upload origin keys to Builder
```


**USAGE**

```
hab origin key upload [FLAGS] [OPTIONS] <ORIGIN|--pubfile <PUBLIC_FILE>>
```


**FLAGS**

```
-s, --secret     Upload secret key in addition to the public key
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<ORIGIN>    The origin name
```




[&uarr; Top](#)



## hab pkg

**DESCRIPTION**

```
Commands relating to Habitat packages
```


**USAGE**

```
hab pkg [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
binds       Displays the binds for a service
binlink     Creates a binlink for a package binary in a common 'PATH' location
build       Builds a Plan using a Studio
channels    Find out what channels a package belongs to
config      Displays the default configuration options for a service
demote      Demote a package from a specified channel
env         Prints the runtime environment of a specific installed package
exec        Executes a command using the 'PATH' context of an installed package
export      Exports the package to the specified format
hash        Generates a blake2b hashsum from a target at any given filepath
help        Prints this message or the help of the given subcommand(s)
install     Installs a Habitat package from Builder or locally from a Habitat Artifact
path        Prints the path to a specific installed release of a package
promote     Promote a package to a specified channel
provides    Search installed Habitat packages for a given file
search      Search for a package in Builder
sign        Signs an archive with an origin key, generating a Habitat Artifact
upload      Uploads a local Habitat Artifact to Builder
verify      Verifies a Habitat Artifact with an origin key
```






[&uarr; Top](#)

* [binds](#hab-pkg-binds): Displays the binds for a service
* [binlink](#hab-pkg-binlink): Creates a binlink for a package binary in a common 'PATH' location
* [build](#hab-pkg-build): Builds a Plan using a Studio
* [channels](#hab-pkg-channels): Find out what channels a package belongs to
* [config](#hab-pkg-config): Displays the default configuration options for a service
* [demote](#hab-pkg-demote): Demote a package from a specified channel
* [env](#hab-pkg-env): Prints the runtime environment of a specific installed package
* [exec](#hab-pkg-exec): Executes a command using the 'PATH' context of an installed package
* [export](#hab-pkg-export): Exports the package to the specified format
* [hash](#hab-pkg-hash): Generates a blake2b hashsum from a target at any given filepath
* [install](#hab-pkg-install): Installs a Habitat package from Builder or locally from a Habitat Artifact
* [path](#hab-pkg-path): Prints the path to a specific installed release of a package
* [promote](#hab-pkg-promote): Promote a package to a specified channel
* [provides](#hab-pkg-provides): Search installed Habitat packages for a given file
* [search](#hab-pkg-search): Search for a package in Builder
* [sign](#hab-pkg-sign): Signs an archive with an origin key, generating a Habitat Artifact
* [upload](#hab-pkg-upload): Uploads a local Habitat Artifact to Builder
* [verify](#hab-pkg-verify): Verifies a Habitat Artifact with an origin key

### hab pkg binds

**DESCRIPTION**

```
Displays the binds for a service
```


**USAGE**

```
hab pkg binds <PKG_IDENT>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-statis/1.42.2)
```




[&uarr; Top](#)



### hab pkg binlink

**DESCRIPTION**

```
Creates a binlink for a package binary in a common 'PATH' location
```


**USAGE**

```
hab pkg binlink [FLAGS] [OPTIONS] <PKG_IDENT> [BINARY]
```


**FLAGS**

```
-f, --force      Overwrite existing binlinks
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-static/1.42.2)
<BINARY>       The command to binlink (ex: bash)
```




[&uarr; Top](#)



### hab pkg build

**DESCRIPTION**

```
Builds a Plan using a Studio
```


**USAGE**

```
hab pkg build [FLAGS] [OPTIONS] <PLAN_CONTEXT>
```


**FLAGS**

```
-D, --docker     Uses a Dockerized Studio for the build (default: Studio uses a chroot on linux)
-R, --reuse      Reuses a previous Studio for the build (default: clean up before building)
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PLAN_CONTEXT>    A directory containing a plan.sh file or a habitat/ directory which contains the plan.sh$2ile
```




[&uarr; Top](#)



### hab pkg channels

**DESCRIPTION**

```
Find out what channels a package belongs to
```


**USAGE**

```
hab pkg channels [OPTIONS] <PKG_IDENT>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A fully qualified package identifier (ex: core/busybox-static/1.42.2/20170513215502)
```




[&uarr; Top](#)



### hab pkg config

**DESCRIPTION**

```
Displays the default configuration options for a service
```


**USAGE**

```
hab pkg config <PKG_IDENT>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-static/1.42.2)
```




[&uarr; Top](#)



### hab pkg demote

**DESCRIPTION**

```
Demote a package from a specified channel
```


**USAGE**

```
hab pkg demote [OPTIONS] <PKG_IDENT> <CHANNEL>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A fully qualified package identifier (ex: core/busybox-static/1.42.2/20170513215502)
<CHANNEL>      Demote from the specified release channel
```




[&uarr; Top](#)



### hab pkg env

**DESCRIPTION**

```
Prints the runtime environment of a specific installed package
```


**USAGE**

```
hab pkg env <PKG_IDENT>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-static/1.42.2)
```




[&uarr; Top](#)



### hab pkg exec

**DESCRIPTION**

```
Executes a command using the 'PATH' context of an installed package
```


**USAGE**

```
hab pkg exec <PKG_IDENT> <CMD> [ARGS]...
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-static/1.42.2)
<CMD>          The command to execute (ex: ls)
<ARGS>...      Arguments to the command (ex: -l /tmp)
```




[&uarr; Top](#)



### hab pkg export

**DESCRIPTION**

```
Exports the package to the specified format
```


**USAGE**

```
hab pkg export [OPTIONS] <FORMAT> <PKG_IDENT>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<FORMAT>       The export format (ex: aci, cf, docker, kubernetes, mesos, or tar)
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-static/1.42.2) or filepath to a Habitat$2rtifact (ex: /home/acme-redis-3.0.7-21120102031201-x86_64-linux.hart)
```




[&uarr; Top](#)



### hab pkg hash

**DESCRIPTION**

```
Generates a blake2b hashsum from a target at any given filepath
```


**USAGE**

```
hab pkg hash [SOURCE]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<SOURCE>    A filepath of the target
```




[&uarr; Top](#)



### hab pkg install

**DESCRIPTION**

```
Installs a Habitat package from Builder or locally from a Habitat Artifact
```


**USAGE**

```
hab pkg install [FLAGS] [OPTIONS] <PKG_IDENT_OR_ARTIFACT>...
```


**FLAGS**

```
-b, --binlink    Binlink all binaries from installed package(s)
-f, --force      Overwrite existing binlinks
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT_OR_ARTIFACT>...    One or more Habitat package identifiers (ex: acme/redis) and/or filepaths to a$2abitat Artifact (ex: /home/acme-redis-3.0.7-21120102031201-x86_64-linux.hart)
```




[&uarr; Top](#)



### hab pkg path

**DESCRIPTION**

```
Prints the path to a specific installed release of a package
```


**USAGE**

```
hab pkg path <PKG_IDENT>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-static/1.42.2)
```




[&uarr; Top](#)



### hab pkg promote

**DESCRIPTION**

```
Promote a package to a specified channel
```


**USAGE**

```
hab pkg promote [OPTIONS] <PKG_IDENT> <CHANNEL>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<PKG_IDENT>    A fully qualifed package identifier (ex: core/busybox-static/1.42.2/20170513215502)
<CHANNEL>      Promote to the specified release channel
```




[&uarr; Top](#)



### hab pkg provides

**DESCRIPTION**

```
Search installed Habitat packages for a given file
```


**USAGE**

```
hab pkg provides [FLAGS] <FILE>
```


**FLAGS**

```
-p               Show full path to file
-r               Show fully qualified package names (ex: core/busybox-static/1.24.2/20160708162350)
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<FILE>    File name to find
```




[&uarr; Top](#)



### hab pkg search

**DESCRIPTION**

```
Search for a package in Builder
```


**USAGE**

```
hab pkg search [OPTIONS] <SEARCH_TERM>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<SEARCH_TERM>    Search term
```




[&uarr; Top](#)



### hab pkg sign

**DESCRIPTION**

```
Signs an archive with an origin key, generating a Habitat Artifact
```


**USAGE**

```
hab pkg sign [OPTIONS] <SOURCE> <DEST>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<SOURCE>    A path to a source archive file (ex: /home/acme-redis-3.0.7-21120102031201.tar.xz)
<DEST>      The destination path to the signed Habitat Artifact (ex: /home/acme-redis-3.0.7-21120102031201
-x86_64-linux.hart)
```




[&uarr; Top](#)



### hab pkg upload

**DESCRIPTION**

```
Uploads a local Habitat Artifact to Builder
```


**USAGE**

```
hab pkg upload [OPTIONS] <HART_FILE>...
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<HART_FILE>...    One or more filepaths to a Habitat Artifact (ex: /home/acme-redis-3.0.7-21120102031201-x86_64
-linux.hart)
```




[&uarr; Top](#)



### hab pkg verify

**DESCRIPTION**

```
Verifies a Habitat Artifact with an origin key
```


**USAGE**

```
hab pkg verify <SOURCE>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<SOURCE>    A path to a Habitat Artifact (ex: /home/acme-redis-3.0.7-21120102031201-x86_64-linux.hart)
```




[&uarr; Top](#)



## hab plan

**DESCRIPTION**

```
Commands relating to plans and other app-specific configuration.
```


**USAGE**

```
hab plan [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
help    Prints this message or the help of the given subcommand(s)
init    Generates common package specific configuration files. Executing without argument will create a$2abitat directory in your current folder for the plan. If PKG_NAME is specified it will create a$2older with that name. Environment variables (those starting with 'pkg_') that are set will be used in$2he generated plan
```






[&uarr; Top](#)

* [init](#hab-plan-init): Generates common package specific configuration files. Executing without argument will create a$2abitat directory in your current folder for the plan. If PKG_NAME is specified it will create a$2older with that name. Environment variables (those starting with 'pkg_') that are set will be used in$2he generated plan

### hab plan init

**DESCRIPTION**

```
Generates common package specific configuration files. Executing without argument will create a habitat directory in
```


**USAGE**

```
hab plan init [FLAGS] [OPTIONS] [PKG_NAME]
```


**FLAGS**

```
    --windows           Use a Windows Powershell plan template
    --with-all          Generate omnibus plan with all available plan options
    --with-callbacks    Include callback functions in template
    --with-docs         Include plan options documentation
-h, --help              Prints help information
-V, --version           Prints version information
```




**ARGS**

```
<PKG_NAME>    Name for the new app
```




[&uarr; Top](#)



## hab ring

**DESCRIPTION**

```
Commands relating to Habitat rings
```


**USAGE**

```
hab ring [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
help    Prints this message or the help of the given subcommand(s)
key     Commands relating to Habitat ring keys
```






[&uarr; Top](#)

* [key](#hab-ring-key): Commands relating to Habitat ring keys

### hab ring key

**DESCRIPTION**

```
Commands relating to Habitat ring keys
```


**USAGE**

```
hab ring key [SUBCOMMAND]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```


**SUBCOMMANDS**

```
export      Outputs the latest ring key contents to stdout
generate    Generates a Habitat ring key
help        Prints this message or the help of the given subcommand(s)
import      Reads a stdin stream containing ring key contents and writes the key to disk
```






[&uarr; Top](#)

* [export](#hab-ring-key-export): Outputs the latest ring key contents to stdout
* [generate](#hab-ring-key-generate): Generates a Habitat ring key
* [import](#hab-ring-key-import): Reads a stdin stream containing ring key contents and writes the key to disk

### hab ring key export

**DESCRIPTION**

```
Outputs the latest ring key contents to stdout
```


**USAGE**

```
hab ring key export <RING>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<RING>    Ring key name
```




[&uarr; Top](#)



### hab ring key generate

**DESCRIPTION**

```
Generates a Habitat ring key
```


**USAGE**

```
hab ring key generate <RING>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<RING>    Ring key name
```




[&uarr; Top](#)



### hab ring key import

**DESCRIPTION**

```
Reads a stdin stream containing ring key contents and writes the key to disk
```


**USAGE**

```
hab ring key import
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```








[&uarr; Top](#)



## hab studio



**USAGE**

```
hab studio [FLAGS] [OPTIONS] <SUBCOMMAND> [ARG ..]
```




**SUBCOMMANDS**

```
build     Build using a Studio
enter     Interactively enter a Studio
help      Prints this message
new       Creates a new Studio
rm        Destroys a Studio
run       Run a command in a Studio
version   Prints version information
```






[&uarr; Top](#)

* [build](#hab-studio-build): Build using a Studio
* [enter](#hab-studio-enter): Interactively enter a Studio
* [new](#hab-studio-new): Creates a new Studio
* [rm](#hab-studio-rm): Destroys a Studio
* [run](#hab-studio-run): Run a command in a Studio
* [version](#hab-studio-version): Prints version information

### hab studio build



**USAGE**

```
hab studio [COMMON_FLAGS] [COMMON_OPTIONS] build [FLAGS] [PLAN_DIR]
```


**FLAGS**

```
-R  Reuse a previous Studio state (default: clean up before building)
```








[&uarr; Top](#)



### hab studio enter



**USAGE**

```
hab studio [COMMON_FLAGS] [COMMON_OPTIONS] enter
```










[&uarr; Top](#)



### hab studio new



**USAGE**

```
hab studio [COMMON_FLAGS] [COMMON_OPTIONS] new
```










[&uarr; Top](#)



### hab studio rm



**USAGE**

```
hab studio [COMMON_FLAGS] [COMMON_OPTIONS] rm
```










[&uarr; Top](#)



### hab studio run



**USAGE**

```
hab studio [COMMON_FLAGS] [COMMON_OPTIONS] run [CMD] [ARG ..]
```










[&uarr; Top](#)



### hab studio version













[&uarr; Top](#)



## hab sup



**USAGE**

```
hab sup [FLAGS] <SUBCOMMAND>
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
-V, --version     Prints version information
```


**SUBCOMMANDS**

```
bash      Start an interactive Bash-like shell
config    Displays the default configuration options for a service
help      Prints this message or the help of the given subcommand(s)
load      Load a service to be started and supervised by Habitat from a package or artifact. Services started in$2his manner will persist through Supervisor restarts.
run       Run the Habitat Supervisor
sh        Start an interactive Bourne-like shell
start     Start a loaded, but stopped, Habitat service or a transient service from a package or artifact. If the$2abitat Supervisor is not already running this will additionally start one for you.
status    Query the status of Habitat services.
stop      Stop a running Habitat service.
term      Gracefully terminate the Habitat Supervisor and all of its running services
unload    Unload a persistent or transient service started by the Habitat Supervisor. If the Supervisor is$2unning when the service is unloaded the service will be stopped.
```






[&uarr; Top](#)

* [bash](#hab-sup-bash): Start an interactive Bash-like shell
* [config](#hab-sup-config): Displays the default configuration options for a service
* [load](#hab-sup-load): Load a service to be started and supervised by Habitat from a package or artifact. Services started in$2his manner will persist through Supervisor restarts.
* [run](#hab-sup-run): Run the Habitat Supervisor
* [sh](#hab-sup-sh): Start an interactive Bourne-like shell
* [start](#hab-sup-start): Start a loaded, but stopped, Habitat service or a transient service from a package or artifact. If the$2abitat Supervisor is not already running this will additionally start one for you.
* [status](#hab-sup-status): Query the status of Habitat services.
* [stop](#hab-sup-stop): Stop a running Habitat service.
* [term](#hab-sup-term): Gracefully terminate the Habitat Supervisor and all of its running services
* [unload](#hab-sup-unload): Unload a persistent or transient service started by the Habitat Supervisor. If the Supervisor is$2unning when the service is unloaded the service will be stopped.

### hab sup bash

**DESCRIPTION**

```
Start an interactive Bash-like shell
```


**USAGE**

```
hab sup bash [FLAGS]
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```








[&uarr; Top](#)



### hab sup config

**DESCRIPTION**

```
Displays the default configuration options for a service
```


**USAGE**

```
hab sup config [FLAGS] <PKG_IDENT>
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```




**ARGS**

```
<PKG_IDENT>    A package identifier (ex: core/redis, core/busybox-static/1.42.2)
```




[&uarr; Top](#)



### hab sup load

**DESCRIPTION**

```
Load a service to be started and supervised by Habitat from a package or artifact. Services started in this manner will
```


**USAGE**

```
hab sup load [FLAGS] [OPTIONS] <PKG_IDENT_OR_ARTIFACT>
```


**FLAGS**

```
-f, --force       Load or reload an already loaded service. If the service was previously loaded and running this$2peration will also restart the service
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```




**ARGS**

```
<PKG_IDENT_OR_ARTIFACT>    A Habitat package identifier (ex: core/redis) or filepath to a Habitat Artifact (ex:
/home/core-redis-3.0.7-21120102031201-x86_64-linux.hart)
```




[&uarr; Top](#)



### hab sup run

**DESCRIPTION**

```
Run the Habitat Supervisor
```


**USAGE**

```
hab sup run [FLAGS] [OPTIONS]
```


**FLAGS**

```
-A, --auto-update       Enable automatic updates for the Supervisor itself
    --no-color          Turn ANSI color off
-I, --permanent-peer    If this Supervisor is a permanent peer
-v                      Verbose output; shows line numbers
-h, --help              Prints help information
```








[&uarr; Top](#)



### hab sup sh

**DESCRIPTION**

```
Start an interactive Bourne-like shell
```


**USAGE**

```
hab sup sh [FLAGS]
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```








[&uarr; Top](#)



### hab sup start

**DESCRIPTION**

```
Start a loaded, but stopped, Habitat service or a transient service from a package or artifact. If the Habitat
```


**USAGE**

```
hab sup start [FLAGS] [OPTIONS] <PKG_IDENT_OR_ARTIFACT>
```


**FLAGS**

```
-A, --auto-update       Enable automatic updates for the Supervisor itself
    --no-color          Turn ANSI color off
-I, --permanent-peer    If this Supervisor is a permanent peer
-v                      Verbose output; shows line numbers
-h, --help              Prints help information
```




**ARGS**

```
<PKG_IDENT_OR_ARTIFACT>    A Habitat package identifier (ex: core/redis) or filepath to a Habitat Artifact (ex:
/home/core-redis-3.0.7-21120102031201-x86_64-linux.hart)
```




[&uarr; Top](#)



### hab sup status

**DESCRIPTION**

```
Query the status of Habitat services.
```


**USAGE**

```
hab sup status [FLAGS] [OPTIONS] [PKG_IDENT]
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```




**ARGS**

```
<PKG_IDENT>    A Habitat package identifier (ex: core/redis)
```




[&uarr; Top](#)



### hab sup stop

**DESCRIPTION**

```
Stop a running Habitat service.
```


**USAGE**

```
hab sup stop [FLAGS] [OPTIONS] <PKG_IDENT>
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```




**ARGS**

```
<PKG_IDENT>    A Habitat package identifier (ex: core/redis)
```




[&uarr; Top](#)



### hab sup term

**DESCRIPTION**

```
Gracefully terminate the Habitat Supervisor and all of its running services
```


**USAGE**

```
hab sup term [FLAGS] [OPTIONS]
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```








[&uarr; Top](#)



### hab sup unload

**DESCRIPTION**

```
Unload a persistent or transient service started by the Habitat Supervisor. If the Supervisor is running when the
```


**USAGE**

```
hab sup unload [FLAGS] [OPTIONS] <PKG_IDENT>
```


**FLAGS**

```
    --no-color    Turn ANSI color off
-v                Verbose output; shows line numbers
-h, --help        Prints help information
```




**ARGS**

```
<PKG_IDENT>    A Habitat package identifier (ex: core/redis)
```




[&uarr; Top](#)



## hab svc

**DESCRIPTION**

```
Commands relating to Habitat services
```


**USAGE**

```
hab svc [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
help    Prints this message or the help of the given subcommand(s)
key     Commands relating to Habitat service keys
```




**ALIASES**

```
load       Alias for: 'sup load'
unload     Alias for: 'sup unload'
start      Alias for: 'sup start'
stop       Alias for: 'sup stop'
status     Alias for: 'sup status'
```


[&uarr; Top](#)

* [key](#hab-svc-key): Commands relating to Habitat service keys

### hab svc key

**DESCRIPTION**

```
Commands relating to Habitat service keys
```


**USAGE**

```
hab svc key [SUBCOMMAND]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```


**SUBCOMMANDS**

```
generate    Generates a Habitat service key
help        Prints this message or the help of the given subcommand(s)
```






[&uarr; Top](#)

* [generate](#hab-svc-key-generate): Generates a Habitat service key

### hab svc key generate

**DESCRIPTION**

```
Generates a Habitat service key
```


**USAGE**

```
hab svc key generate <SERVICE_GROUP> [ORG]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<SERVICE_GROUP>    Target service group (ex: redis.default)
<ORG>              The service organization
```




[&uarr; Top](#)



## hab user

**DESCRIPTION**

```
Commands relating to Habitat users
```


**USAGE**

```
hab user [SUBCOMMAND]
```


**FLAGS**

```
-h, --help    Prints help information
```


**SUBCOMMANDS**

```
help    Prints this message or the help of the given subcommand(s)
key     Commands relating to Habitat user keys
```






[&uarr; Top](#)

* [key](#hab-user-key): Commands relating to Habitat user keys

### hab user key

**DESCRIPTION**

```
Commands relating to Habitat user keys
```


**USAGE**

```
hab user key [SUBCOMMAND]
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```


**SUBCOMMANDS**

```
generate    Generates a Habitat user key
help        Prints this message or the help of the given subcommand(s)
```






[&uarr; Top](#)

* [generate](#hab-user-key-generate): Generates a Habitat user key

### hab user key generate

**DESCRIPTION**

```
Generates a Habitat user key
```


**USAGE**

```
hab user key generate <USER>
```


**FLAGS**

```
-h, --help       Prints help information
-V, --version    Prints version information
```




**ARGS**

```
<USER>    Name of the user key
```




[&uarr; Top](#)



