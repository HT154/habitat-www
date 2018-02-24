---
title: "Habitat and Workload Placement"
draft: false
---

The previous articles in this series discuss why intelligent application automation is important. In this article we'll talk about how Habitat packages work with various strategies for workload placement, with a focus on how Habitat applications can run in container-based infrastructure.

The Habitat build process includes an optional post-processing step that can create an image for any runtime environment from the Habitat package. For example, Habitat can create Docker container images, Application Container Images (ACIs), or Marathon-native images for Apache Mesos. Eventually this approach could be extended to create Amazon Machine Images (AMIs), CloudFoundry buildpacks, or any other image format. Habitat is completely agnostic about the image format, if any, you use.

Let's look at the case of Habitat creating container images. After a Habitat package has been used to create a new container image during the Habitat build process, the resulting container can be deployed using whatever mechanism is desired, including container scheduling systems (such as Kubernetes and Mesosphere) or cloud-based container management systems like Amazon EC2 Container Service (ECS). Container images created by Habitat are smarter than other containers—they expose all of the automation intelligence of the Habitat app.  For example, Habitat components can self-organize with peers into leader/follower relationships, and dynamic configuration changes can propagate to all running components of the application using robust, decentralized, peer-based protocols.

Of course, as we said earlier, with Habitat containers are just one execution option. Habitat supports workload placement strategies that are not based on containers. Applications packaged with Habitat can be deployed on virtual machines (VMs) and non-container PaaS environments. For example, the post-processing step could just as easily create an Amazon machine image (AMI). The resulting image could be launched using any orchestration system that works with Amazon Web Services (AWS). Integration with any cloud or virtualization system would work similarly.

With Habitat, there's an underlying principle at work, which is that the concerns of data center management are separate from application management. This insight is powerful. For one thing, it means you don't have to worry about a particular runtime until you're ready to deploy. Secondly, once you've decided on that runtime, you can then take advantage of whatever resource management capabilities and tools that make sense in your situation.

In other words, use the operational management system, which is part of the runtime environment, to do what it does best—allocating hardware resources in an optimal way for the desired load level. Use Habitat to manage and monitor the application.

As is often the case with software systems, a carefully chosen separation of concerns pays off in a big way. To understand this, let's go back to the case of containers and look at the main capabilities of container management systems.
