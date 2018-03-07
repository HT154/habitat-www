---
title: Using Habitat
draft: false
---

# Using Habitat

Habitat centers application configuration, management, and behavior around the application itself, not the infrastructure or operating system it runs on. This allows Habitat to be deployed and run on a wide array of clouds, datacenters, schedulers, and platforms.

> Linux-based packages can run on Linux distributions running kernel 2.6.32 or later. Windows-based packages can run on Windows Server 2008 R2 or later and Windows 7 or later.

This section of the Habitat documentation is dedicated to the operational aspects of the framework and how to use the various tools Habitat brings to the table. If you don't yet have an understanding of the way habitat handles automation of your application we would highly recommend visiting [our tutorials](/learn/) to get some quick hands on experience with the framework before diving into the docs.

## Using Habitat Packages

Habitat packages used to start services are run under the Habitat Supervisor. At runtime, you can join Supervisors together in a service group running the same topology, send configuration updates to that group, and more. You can also export the Supervisor together with the package to an external immutable format, such as a Docker container or a virtual machine.

> Linux-based packages can run on Linux distributions running kernel 2.6.32 or later. Windows-based packages can run on Windows Server 2008 R2 or later and Windows 7 or later.

Information about [installing Habitat]({{< relref "/docs/install-habitat.md" >}}) and configuring your workstation can be found in the previous section.

### Running Single Packages for Testing

Packages can be tested in the interactive studio environment or natively on a host machine running Linux or Windows.

When entering an interactive studio, a Supervisor is started for you in the background. To run packages inside of this Supervisor:

1. Build your package inside an interactive studio. Do not exit the studio after it is built.

1. To start your service in the running Supervisor, type `hab sup start <ORIGIN>/<NAME>`, substituting the name and origin of the package you built in step 1. Your service should now be running.

Because the Supervisor is running in the background, you will not see the Supervisor output as you start your service. However you can use the `sup-log` (or `Get-SupervisorLog` on Windows) command that will stream the tail of the Supervisor output.

If your host machine is running Linux, do the following to run your packages:

* Add the hab user and group.

    ```
    $ sudo adduser --group hab
    $ sudo useradd -g hab hab
    ```

* Run the hab CLI as root.

    ```
    $ sudo hab start yourorigin/yourname
    ```

You may use the same `hab start` command on Windows but omit the `sudo` command. However, you should be inside of an elevated shell. Also, note that the `hab` user is not necessary on Windows. If it is absent, services will run under the identity of the current user. If a `hab` user is present, you will need to provide its password via the `--password` argument:

    ```
    PS C:\> $cred = Get-Credential hab
    PS C:\> hab start yourorigin/yourname --password $cred.GetNetworkCredential().Password
    ```

### Running Packages in Any Environment

The `hab` program can also be installed on servers. It will retrieve the necessary components (like the current release of the Supervisor) in order to run packages. Thus, you can start the Supervisor on any compatible system.

To start the Supervisor, you can write an init script or a systemd unit file. For example, for systemd:

```
[Unit]
Description=The Habitat Supervisor

[Service]
ExecStart=/bin/hab sup run

[Install]
WantedBy=default.target
```

On Windows, you can run the Supervisor as a Windows Service. You can use the windows-service Habitat package to host the Supervisor inside the Windows Service Control Manager. See the windows-service readme for more details regarding its installation and use.

Next use `hab svc load` to load one or more services into the Supervisor for permanent supervision. Using the example from above:

```
$ sudo hab svc load <ORIGIN>/<NAME>
```

### Running a Package on a Virtual Machine (VM)

After you have built the hart package, do the following:

1. Spin up a Virtual Machine.

1. Securely copy the .hart package from your local workstation onto the virtual machine. SCP is a widely-used tool to do this; however, you can also use FTP or whatever tool you use to copy things from your local workstation to a remote server.

1. SSH into the virtual machine.

1. In the virtual machine - run these commands:

    1. Install Habitat

        ```
        $ curl https://raw.githubusercontent.com/habitat-sh/habitat/master/components/hab/install.sh | sudo bash
        ```

    1. Install the package (which should be on the virtual machine):

        ```
        $ sudo hab install your_package.hart
        ```

    1. Create the Habitat group

        ```
        $ sudo groupadd hab
        $ sudo useradd -g hab hab
        ```

    1. Start the package

        ```
        $ sudo hab start your_origin/your_package
        ```

On Windows this looks very similar with the additional step of installing the Chocolatey package manager:

```
PS C:\> Set-ExecutionPolicy Bypass -Scope Process -Force
PS C:\> iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
PS C:\> choco install habitat
PS C:\> hab install your_package.hart
PS C:\> hab start your_origin/your_package
```

### Starting Only the Supervisor

Starting the Supervisor is as simple as running:

```
$ hab sup run
```

This command also lets you override the default gossip and http gateway binding ports, just like when using `hab start`.

### Running the Supervisor with a Host's init System

Only one system service needs to be added. Your choice of Linux distribution may dictate which init system is in use (i.e. SysVinit, Systemd, runit, etc), but all options boil down to simply running `hab sup run` as the runnable program. The following example assumes that the Habitat program `hab` is installed, binlinked as `/bin/hab`, and a `hab` user and group are present.

For example, a suitable Systemd unit would simply be:

```
[Unit]
Description=The Habitat Supervisor

[Service]
ExecStart=/bin/hab sup run

[Install]
WantedBy=default.target
```

It is important to start the Supervisor via the `hab` program as upgrades to the `core/hab` Habitat package will also upgrade the version of the Supervisor on next start.

On Windows, you can run the Supervisor as a Windows Service. You can use the `windows-service` Habitat package to host the Supervisor inside the Windows Service Control Manager:

```
PS C:\> hab pkg install core/windows-service
PS C:\> hab pkg exec core/windows-service install
```

### Loading a Service for Supervision

To add a service to a Supervisor, you use the `hab svc load` subcommand. It has many of the same service-related flags and options as `hab start`, so there's nothing extra to learn here (for more details, read through the Run Packages sections). For example, to load <ORIGIN>/<NAME> in a Leader topology, a Rolling update strategy and a Group of "acme", run the following:

```
$ hab svc load yourorigin/yourname --topology leader --strategy rolling --group acme
```

Running the `hab svc load` subcommand multiple times with different package identifiers will result in multiple services running on the same Supervisor. Let's add `core/redis` to the Supervisor for some fun:

```
$ hab svc load core/redis
```

To unload and remove a service from supervision, you use the `hab svc unload` subcommand. If the service is was running, then it will be stopped first, then removed last. This means that the next time the Supervisor is started (or restarted), it will not run this unloaded service. For example, to remove the `<ORIGIN>/<NAME>` service:

```
$ hab svc unload <ORIGIN>/<NAME>
```

### Stopping a Loaded Running Service

Sometimes you need to stop a running service for a period of time, for example during a maintenance outage. Rather than completely removing a service from supervision, you can use the `hab svc stop` subcommand which will shut down the running service and leave it in this state until you start it again with the `hab svc start` subcommand, explained next. This means that all service-related options such as service topology, update strategy, etc. are preserved until the service is started again. For example, to stop the running `core/redis` service:

```
$ hab svc stop core/redis
```

### Starting a Loaded Stopped Service

To resume running a service which has been loaded but stopped (via the `hab svc stop` subcommand explained above), you use the `hab svc start` subcommand. Let's resume our `core/redis` service with:

```
$ hab svc start core/redis
```

### Querying the Supervisor for Service Status

You can query all services currently loaded or running under the local Supervisor using the `hab sup status` command. This command will list all persistent services loaded by the Supervisor along with their current state. It will also list transient services that are currently running or in a `starting` or `restarting` state. The `status` command includes the version and release of the service and for services that are running, it will include the PID of the running service.

To retrieve status for an individual service, you can pass the service identifier:

```
$ hab sup status core/mysql
```

The following exit codes are emitted by the `status` command:

* `0` - The status command successfully reports status on loaded services
* `1` - A generic error has occured calling the hab cli
* `2` - A service identifier was passed to hab sup status and that service is not loaded by the Supervisor
* `3` - There is no local running Supervisor

## Monitor services through the HTTP API

When a service starts, the Supervisor exposes the status of its services' health and other information through an HTTP API endpoint. This information can be useful in monitoring service health, results of leader elections, and so on.

The HTTP API provides information on the following endpoints:

* `/censu` - Returns the current Census of Services on the Ring (roughly what you see as a service in config.toml).
* `/service` - Returns an array of all the services running under this Supervisor.
* `/services/<NAME>/<GROUP>/confi` - Returns this service groups current configuration.
* `/services/<NAME>/<GROUP>/<ORGANIZATION>/config`- Same as above, but includes the organization.
* `/services/<NAME>/<GROUP>/health` - Returns the current health check for this service.
* `/services/<NAME>/<GROUP>/<ORGANIZATION>/health` - Same as above, but includes the organization.
* `/butterfly` - Debug information about the rumors stored via Butterfly.

### Usage

Connect to the Supervisor of the running service using the following syntax. This example uses curl to do the GET request.

```
$ curl http://172.17.0.2:9631/services
```

> The default listening port on the Supervisor is 9631; however, that can be changed by using the --listen-http option when starting a service.

Depending on the endpoint you hit, the data may be formatted in JSON, TOML, or plain text.

## Setting Up a Ring

### Bastion Ring / Permanent Peers

A “Bastion Ring” is a pattern for preventing rumor loss and a split brain in a network of Habitat Supervisors - it is highly recommended for any real environment use case. Create a minimum of 3 Supervisors and join them together. They should not run any services and they should be marked as permanent peers - their only job is to spread rumors to each other. Then, when you provision additional Supervisors pass the network address of each Supervisor running in the Bastion Ring to use as a list of “initial peers”. It’s recommended to create a Bastion Ring in any network zones which may become partitioned due to a hardware failure. For example, if you have a Habitat ring spanning multiple datacenters and clouds, each should have a bastion ring of a minimum of 3 Supervisors in addition to the Supervisors running your services.

### Initial Peer(s)

The initial peer(s) is a requirement of any distributed system. In Habitat, a new Supervisor that is starting up looks for an initial peer(s) to join to begin sharing information about the health and status of peers and other services, to increase the health of the overall Ring.

## Run Packages in a Service Group

A service group is a logical grouping of services with the same package and topology type connected together in a ring. They are created to share configuration and file updates among the services within those groups and can be segmented based on workflow or deployment needs (QA, Production, and so on). Updates can also be encrypted so that only members of a specific service group can decrypt the contents.

By default, every service joins the `<SERVICENAME>.default` service group unless otherwise specified at runtime.

In addition, multiple service groups can reside in the same ring. This allows data exposed by supervisors to be shared with other members of the ring regardless of which group they are in.

Joining a Service Group

To join a service group, run your service either natively with the `hab start` command, or through an external runtime format such as a Docker container. A best practice is to name the group after an environment to support continuous deployment workflows.

> When applying configuration updates, you must reference the fully-qualified service group name, servicename.groupname.

Here's how to start up the `myapp` service with the `prod` group name using the Supervisor (`hab-sup`) directly:

```
$ hab start myorigin/myapp --group prod
```

Here's how to run the same command from a Docker container:

```
$ docker run -it myorigin/myapp --group prod
```

You will see a similar output below when your service starts. The census entry shows which service group your service belongs to, which in this case is `myapp.prod`. Keep this service instance running.

```
hab-sup(MN): Starting myorigin/myapp
hab-sup(GS): Supervisor 172.17.0.2: 38a2ac4f-5348-48df-86f0-b293284740ce
hab-sup(GS): Census myapp.prod: c60bfa12-c913-4f89-b4f3-d082d1310c3d
...
```

Services only join together to form a ring when a peer IP address is specified by other similar services at runtime. In a new window or external runtime format, run the same command you ran above, but this time, reference the peer IP address of the previous service specified in the Supervisor output above.

```
$ hab start myorigin/myapp --group prod --peer 172.17.0.2
```

> The default port for listening to gossip rumors is 9638 unless specified at runtime by the initial service (through --listen-gossip option at start up) and by any peers connecting to it through the --peer option. See hab start --help for more information and examples.

The output for this new service shows that it has either formed a new ring with the service above, or joined an existing ring where the other service was a member.

```
hab-sup(MN): Starting myorigin/myapp
hab-sup(GS): Supervisor 172.17.0.3: 426f2b49-fb04-41fa-b656-f43260ab122e
hab-sup(GS): Census myapp.prod: 1f9412eb-c1df-4df8-a07a-65540333826a
hab-sup(GS): Starting inbound gossip listener
hab-sup(GS): Joining gossip peer at 172.17.0.2:9638
...
```

> It is important that you specified the group value above. If not, then your new service would have joined the `myapp.default` service group, but remained a gossip peer of the previous service.

## Topologies

A topology describes the intended relationship between peers within a service group. Two topologies ship with Habitat by default: standalone, and leader-follower. The leader-follower topology employs [leader election]({{< relref "/docs/internals.md#leader-election" >}}) to define a leader.

### Standalone

The standalone topology is what a Supervisor starts with by default if no topology is specified, or if the topology is explicitly specified with `--topology standalone` when starting the Supervisor. The standalone topology means that the service group members do not have any defined relationship with one another, other than sharing the same configuration.

### Leader-Follower Topology

In a leader-follower topology, one of the members of the service group is elected the leader, and the other members of that service group become the followers of that leader. This topology is common for database systems like MySQL or PostgreSQL, where applications send writes to one member, and those writes are replicated to one or more read replicas.

As with any topology using leader election, you must start at least three peers using the `--topology leader` flag to the Supervisor.

```
$ hab start yourname/yourdb --topology leader --group production
```

The first Supervisor will block until it has quorum. You would start additional members by pointing them at the ring, using the `--peer` argument:

```
$ hab start yourname/yourdb --topology leader --group production --peer 192.168.5.4
```

> The `--peer` service does not need to be a peer that is in the same service group; it merely needs to be in the same ring that the other member(s) are in.

Once you have quorum, one member is elected a leader, the Supervisors in the service group update the service's configuration in concordance with the policy defined at package build time, and the service group starts up.

#### Robustness, Network Boundaries and Recovering from Partitions

Within a leader-follower topology it is possible to get into a partitioned state where nodes are unable to achieve quorum. To solve this a permanent peer can be used to heal the netsplit. To set this pass the `--permanent-peer` option, or its short form `-I`, to the Supervisor.

```
$ hab start yourname/yourdb --topology leader --group production --permanent-peer
```

When this is used we will attempt to ping the permanent peer and achieve quorum, even if they are confirmed dead.

The notion of a permanent peer is an extension to the original [SWIM](https://www.cs.cornell.edu/~asdas/research/dsn02-swim.pdf) gossip protocol. It can add robustness provided everyone has a permanent member on both sides of the split.

#### Defining Leader and Follower Behavior in Plans

Habitat allows you to use the same immutable package in different deployment scenarios. Here is an example of a configuration template with conditional logic that will cause the running application to behave differently based on whether it is a leader or a follower:

```
{{#if svc.me.follower}}
   {{#with svc.leader as |leader|}}
     slaveof {{leader.sys.ip}} {{leader.cfg.port}}
   {{/with}}
{{/if}}
```

This logic says that if this peer is a follower, it will become a read replica of the IP and port of service leader (`svc.leader`), which is has found by service discovery through the ring. However, if this peer is the leader, the entire list of statements here evaluate to empty text -- meaning that the peer starts up as the leader.

## Configuration updates

One of the key features of Habitat is the ability to define an immutable package with a default configuration which can then be updated dynamically at runtime. You can update service configuration on two levels: individual services (for testing purposes), or a service group.

### Apply Configuration Updates to an Individual Service

When starting a single service, you can provide alternate configuration values to those specified in default.toml through the use of an environment variable with the following format: `HAB_PACKAGENAME='{"keyname1":"newvalue1", "tablename1":{"keyname2":"newvalue2"}}'`.

```
$ HAB_MYTUTORIALAPP='{"message":"Habitat rocks!"}' hab start <ORIGIN>/<PACKAGENAME>
```

> The preferred syntax used for applying configuration through environment variables is JSON but must be valid JSON input. The package name in the environment variable must be uppercase, any dashes must be replaced with underscores.

For multiline environment variables, such as those in a TOML table or nested key value pairs, it can be easier to place your changes in a .toml file and pass it in using `HAB_PACKAGENAME="$(cat foo.toml)"`.

```
$ HAB_MYTUTORIALAPP="$(cat my-env-stuff.toml)" hab start <ORIGIN>/<PACKAGENAME>
```

The main advantage of applying configuration updates to an individual service through an environment variable is that you can quickly test configuration settings to see how your service behaves at runtime. The disadvantages of this method are that configuration changes have to be applied to one service at a time, and you have to manually interrupt (Ctrl+C) a running service before changing its configuration settings again.

For an example of how to use an environment variable to update default configuration values, see the [Getting Started demo](#).

### Apply Configuration Updates to a Service Group

Similar to specifying updates to individual settings at runtime, you can apply multiple configuration changes to an entire service group at runtime using stdin from your shell or through a TOML file. These configuration updates can be sent in the clear or encrypted in gossip messages through [wire encryption](#supervisor-and-encryption). Configuration updates to a service group will trigger a restart of the services as new changes are applied throughout the group.

#### Usage

When submitting a configuration update to a service group, you must specify a peer in the ring to connect to, the version number of the configuration update, and the new configuration itself. Configuration updates can be either TOML passed into stdin, or passed in a TOML file that is referenced in `hab config apply`.

Configuration updates for service groups must be versioned. The version number must be an integer that starts at one and must be incremented with every subsequent update to the same service group. *If the version number is less than or equal to the current version number, the change(s) will not be applied*.

Here are some examples of how to apply configuration changes through both the shell and through a TOML file.

##### STDIN

```
$ echo 'buffersize = 16384' | hab config apply --peer 172.17.0.3 myapp.prod 1
```

##### TOML file

```
$ hab config apply --peer 172.17.0.3 myapp.prod 1 /tmp/newconfig.toml
```

> The filename of the configuration file is not important.

> `1` is the version number. Increment this for additional configuration updates.

Your output would look something like this:

```
» Applying configuration for myapp.prod incarnation 1
Ω Creating service configuration
✓ Verified this configuration is valid TOML
↑ Applying to peer 172.17.0.3:9638
★ Applied configuration
```

The services in the myapp.prod service group will restart.

```
myapp.prod(SR): Service configuration updated from butterfly: acd2c21580748d38f64a014f964f19a0c1547955e4c86e63bf641a4e142b2200
hab-sup(SC): Updated myapp.conf a85c2ed271620f895abd3f8065f265e41f198973317cc548a016f3eb60c7e13c
myapp.prod(SV): Stopping
...
myapp.prod(SV): Starting
```

##### Encryption

Configuration updates can be encrypted for the service group they are intended. To do so, pass the `--user` option with the name of your user key, and the `--org` option with the organization of the service group. If you have the public key for the service group, the data will be encrypted for that key, signed with your user key, and sent to the ring.

It will then be stored encrypted in memory, and decrypted on disk.

## Upload files to a service group

In addition to [configuration updates](#configuration-updates), you can upload files to a service group. Keep these small &mdash; we recommend 4k or less per file, and keep the count of files to a minimum.

### Usage

When submitting a file to a service group, you must specify a peer in the ring to connect to, the version number of the file, and the new path to the file itself.

File updates for service groups must be versioned. The version number must be an integer that starts at one and must be incremented with every subsequent update to the same service group. *If the version number is less than or equal to the current version number, the change(s) will not be applied*.

Here are some examples of how to upload a file to the ring:

```
$ hab file upload myapp.prod 1 /tmp/yourfile.txt --peer 172.0.0.3
```

> `1` is the version number. Increment this for additional configuration updates.

Your output would look something like this:

```
» Uploading file /tmp/yourfile.txt to myapp.prod incarnation 1
Ω Creating service file
↑ Applying to peer 127.0.0.1:9638
★ Uploaded file
```

The services in the myapp.prod service group will restart.

```
myapp.prod(SR): Service file updated from butterfly /hab/svc/myapp/files/yourfile.txt: 7a3d9e87e6b917e0ec53665038adfda0a6b43ab9c3f72640dcf7e43a280af719
myapp.prod(SR): File update hook succeeded.
myapp.prod(SV): Stopping
...
myapp.prod(SV): Starting
```

> The file will be put in your services svc directory.

##### Encryption

Files can be encrypted for the service group they are intended. To do so, pass the --user option with the name of your user key, and the --org option with the organization of the service group. If you have the public key for the service group, the data will be encrypted for that key, signed with your user key, and sent to the ring.

It will then be stored encrypted in memory, and decrypted on disk.

## Supervisor and Encryption

By default, a Supervisor will run with no security. It will communicate with other Supervisors in cleartext, and it will allow any user to apply new configuration without authentication. While this is beneficial for quickly illustrating the concepts of Habitat, users will want to run production deployments of Habitat Supervisor networks with more security.

There are several types of security measures that can be undertaken by the operator:

* Wire encryption of inter-Supervisor traffic
* Trust relationships between supervisors and users

### Wire Encryption

Supervisors running in a ring can be configured to encrypt all traffic between them. This is accomplished by generating a ring key, which is a symmetric shared secret placed into the Supervisor environment prior to starting it.

#### Generating a Ring Key

1. Generate a ring key using the `hab` command-line tool. This can be done on your workstation. The generated key has the `.sym.key` extension, indicating that it is a symmetric pre-shared key, and is stored in the `$HOME/.hab/cache/keys` directory.

    ```
    $ hab ring key generate yourringname
    ```

1. Copy the key file to the environment where the Supervisor will run, into the `/hab/cache/keys` directory. Ensure that it has the appropriate permissions so only the Supervisor can read it.

1. Start the Supervisor with the `-r` or `--ring` parameter, specifying the name of the ring key to use.

    ```
    $ hab start --ring yourringname yourorigin/yourapp
    ```

    or, if using a standalone Supervisor package:

    ```
    $ hab-sup start --ring yourringname yourorigin/yourapp
    ```

1. The Supervisor becomes part of the named ring `yourringname` and uses the key for network encryption. Other supervisors that now attempt to connect to it without presenting the correct ring key will be rejected.

1. It is also possible to set the environment variable HAB_RING_KEY to the contents of the ring key; for example:

    ```
    $ env HAB_RING_KEY=$(cat /hab/cache/keys/ring-key-file) hab-sup start yourorigin/yourapp
    ```

#### Using a Ring Key When Applying Configuration Changes

Those using `hab config apply` or `hab file upload` will also need to supply the name of the ring key with the `-r` or `--ring` parameter, or supervisors will reject this communication.

### Service Group Encryption

Supervisors in a service group can be configured to require key-based authorization prior to allowing configuration changes. In this scenario, the Supervisor in a named service group starts up with a key for that group bound to an organization. This allows for multiple service groups with the same name in different organizations.

As explained in the [security overview](relref "/docs/internals.md#cryptography"), this process also requires the generation of a user key for every user making configuration updates to the Supervisor network.

#### Generating Service Group Keys

1. Generate a service group key using the `hab` command-line tool. This can be done on your workstation. Because asymmetric encryption is being used, two files will be generated: a file with a `.box.key` extension, which is the service group's private key, and a file with a `.pub` extension, which is the service group's public key.

    ```
    $ hab svc key generate servicegroupname.example yourorg
    ```

1. This generated a service group key for the service group `servicegroupname.example` in the organization `yourorg`. Copy the `.box.key` private key to the environment where the Supervisor will run into the `/hab/cache/keys` directory. Ensure that it has the appropriate permissions so that only the Supervisor can read it.

1. Start the Supervisor, specifying both the service group and organization that it belongs to:

    ```
    $ hab start --org yourorg --group servicegroupname.example yourorigin/yourapp
    ```

1. Only users whose public keys that the Supervisor already has in its cache will be allowed to reconfigure this service group. If you need to generate a user key pair, see the next section.

#### Generating User Keys

The user key is used to encrypt configuration data targeted for a particular service group.

1. Generate a user key using the `hab` command-line tool. This can be done on your workstation. Because asymmetric encryption is being used, two files will be generated: a file with a `.box.key` extension, which is the user's private key, and a file with a `.pub` extension, which is the user's public key.

1. Distribute the user's public key to any Supervisor that needs it, into the `/hab/cache/keys` directory. The user will be able to reconfigure that Supervisor, provided they encrypted the configuration update using the service group's public key.

#### Applying Configuration Changes

The `hab config apply` and `hab file upload` commands will work as usual when user/service group trust relationships are set up in this way.

If a running Supervisor cannot decrypt a secret due to a missing key, it will retry with exponential backoff starting with a one-second interval. This allows an administrator to provide the Supervisor with the key to resume normal operations, without taking down the Supervisor.

### Identifying Key Types

To aid the user in the visual identification of the many varieties of keys in use by Habitat, a key itself is in plain text and contains a header on the first line indicating what kind of key it is. The file extension and, in some situations, the format of the file name, provide additional guidance to the user in identifying the type of key.

`YYYYMMDDRRRRRR` denotes the creation time and release identifier of that key.

| Key Type                    | Header    | Filename Format                             |
|-----------------------------|-----------|---------------------------------------------|
| Private origin signing key 	| SIG-SEC-1	| originname-YYYYMMDDRRRRRR.sig.key           |
| Public origin signing key	  | SIG-PUB-1	| originname-YYYYMMDDRRRRRR.pub.key           |
| Ring wire encryption key	  | SYM-SEC-1	| ringname-YYYYMMDDRRRRRR.sym.key             |
| Private service group key	  | BOX-SEC-1	| servicegroup.env@org-YYYYMMDDRRRRRR.box.key |
| Public service group key	  | BOX-PUB-1	| servicegroup.env@org-YYYYMMDDRRRRRR.pub     |
| Private user key	          | BOX-SEC-1	| username-YYYYMMDDRRRRRR.box.key             |
| Public user key	            | BOX-PUB-1	| username-YYYYMMDDRRRRRR.pub                 |

Keys that contain `SEC` in their header should be guarded carefully. Keys that contain `PUB` in their header can be distributed freely with no risk of information compromise.

## Update Strategy

The Habitat Supervisor can be configured to leverage an optional update strategy, which describes how the Supervisor and its peers within a service group should respond when a new version of a package is available.

To use an update strategy, the Supervisor is configured to subscribe to Habitat Builder, and more specifically, a channel for new versions.

### Configuring an Update Strategy

Habitat supports three update strategies: `none`, `rolling`, and `at-once`.

To start a Supervisor with the auto-update strategy, pass the `--strategy` argument to a Supervisor start command, and optionally specify the depot URL:

```
$ hab start yourorigin/yourapp --strategy rolling --url https://bldr.habitat.sh
```

#### None Strategy

This strategy means your package will not automatically be updated when a newer version is available. By default, Supervisors start with their update strategy set to `none` unless explicitly set to one of the other two update strategies.

#### Rolling Strategy

This strategy requires Supervisors to update to a newer version of their package one at a time in their service group. An update leader is elected which all Supervisors within a service group will update around. All update followers will first ensure they are running the same version of a service that their leader is running, and then, the leader will poll Builder for a newer version of the service's package.

Once the update leader finds a new version it will update and wait until all other alive members in the service group have also been updated before once again attempting to find a newer version of software to update to. Updates will happen more or less one at a time until completion with the exception of a new node being introduced into the service group during the middle of an update.

If your service group is also running with the `--topology leader` flag, the leader of that election will never become the update leader, so all followers within a leader topology will update first.

It's important to note that because we must perform a leader election to determine an update leader, you must have at least 3 Supervisors running a service group to take advantage of the rolling update strategy.

#### At-Once Strategy

This strategy does no peer coordination with other Supervisors in the service group; it merely updates the underlying Habitat package whenever it detects that a new version has either been published to a depot or installed to the local Habitat package cache. No coordination between Supervisors is done, each Supervisor will poll Builder on their own.

## Continuous Deployment Using Channels

Continuous deployment is a well-known software development practice of building and testing code changes in preparation for a release to a production environment.

Habitat supports continuous deployment workflows through the use of channels. A channel is a tag for a package that the Supervisors in a service group can subscribe to. Channels are useful in CI/CD scenarios where you want to gate a package before making it the default version of the package that users should consume. You can think of this split as the difference between test and production, or nightly releases versus stable releases of products.

By default, every new package is placed in the `unstable` channel by Builder. Packages in the unstable channel cannot be started or installed unless you specify the `--channel` flag in the hab CLI, or set the `HAB_BLDR_CHANNEL` environment variable to a non-stable channel. This is because the default channel used by the hab CLI when starting, installing, or loading packages is the `stable` channel. The `stable` channel indicates a level of stability and functionality suitable for use in multi-service applications or as a dependency for your service.

To promote your package to a channel, you must either use Builder to build your package or upload it to Builder yourself, and then use the `hab pkg promote` subcommand to promote the package to the intended channel. To combine operations, the hab CLI allows you to do both in one command by using the `--channel` option when uploading your package. The following shows how to upload and promote a package to a custom channel named test.

```
$ hab pkg upload -z <TOKEN> results/<HART_FILE> --channel test
```

In the example above, if you look up your package in the Builder UI, or using the `hab pkg channels` subcommand, you can see that your package is tagged for both the `test` and `unstable` channels.

> Custom channels like `test` are scoped to each package. Builder does not create channels scoped to an origin, so if you want to use custom channels for future releases of a package, you must promote to those channels for each release.

If you have already uploaded your package to a channel and wish to promote it to a different channel, use the `hab pkg promote` subcommand as shown below.

```
$ hab pkg promote -z <TOKEN> <ORIGIN>/<PACKAGE>/<VERSION>/<RELEASE> stable
```

### Combining an Update Strategy with Channels

By using both channels and either the `at-once` or `rolling` update strategies, you can automatically update packages in a given channel as shown below:

![Promoting Packages through Channels](/images/screenshots/habitat-promote-packages-through-channels.png)

Using the infographic as a guide, a typical continuous deployment scenario would be as follows:

1. You build a new version of your package either through Builder or through a local Studio environment and then upload it to Builder.

1. When you are ready to roll out a new version of the package, you promote that package to the channel corresponding to the intended environment (e.g. `dev`). You can have multiple service groups in the same environment pointing to different channels, or the same channel.

1. An existing set of running Supervisors in that service group see that the channel they are subscribed to has an update, so they update their underlying Habitat package, coordinating with one another per their update strategy, and restart their service.

1. When you are ready, you then promote that version of your package to a new channel (e.g. `acceptance`). The running Supervisors in that group see the update and perform the same service update as in step 3. You repeat steps 3 and 4 until your package makes its way through your continuous deployment pipeline.

Configuring a Supervisor's update strategy to point to a channel ensures that new versions of the application do not get deployed until the channel is updated, thereby preventing unstable versions from reaching environments for which they are not intended.

To start a Supervisor with an update strategy and pointing to a channel, specify them as options when starting a service.

```
$ hab start <origin>/<package> --strategy rolling --channel test
```

While that service is running, update your package, rebuild it, and then promote it to the same channel that the previous release of that serviceis currently running in (e.g. `test`). Those running instances should now update according to their update strategy.

### Demoting a Package from a Channel

If you need to unassociate a channel from a specific package release, you can do so using the hab pkg demote subcommand. Packages can be demoted from all channels except unstable.

```
$ hab pkg demote -z <TOKEN> <ORIGIN>/<PACKAGE>/<VERSION>/<RELEASE> test
```

The Builder UI for that package release and `hab pkg channels` will both reflect the removal of that channel.

> If you demote a package from the stable channel, then any other packages that depend on the stable version of that package will either fail to load or build depending on how that demoted packaged was used.

> Also, downgrading to another release for a specific channel is not available at this time. This means if you run the latest release of a package from a specific channel, and demote the channel for that release, the package will not downgrade to the next most recent release from that channel.
