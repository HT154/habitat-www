# habitat-www

A new static website for Habitat, based on [Hugo](https://gohugo.io), the Go-powered static site generator.

## Getting Started

1. First, [download and install Habitat](https://www.habitat.sh/tutorials/download/).

1. Once Habitat is installed, in the root of this repository, enter the Habitat studio:

    ```
    export HAB_DOCKER_OPTS="-p 1313:1313 -p 3333:3333 -p 80:80"
    hab studio enter
    ```

    Habitat will download and install all of the necessary dependencies for you, which may take
    a couple of minutes.

1. When that completes, you can start the development services:

    ```
    run
    ```

    With that running, you should be able to browse to http://localhost:1313 and see the website.
    Any changes you make to source files (in either `components/src` or `site`) should trigger a browser
    reload and be reflected automatically.

## Creating Blog Posts, Making Docs Changes, etc.

The site is built with [Hugo](https://gohugo.io/), a Go-based static site generator, and uses
[Stencil](https://stenciljs.com/) for web components and [Sass](http://sass-lang.com/) for CSS.
You'll probably want to familiarize yourself with the Hugo documentation, which covers templating,
layouts, functions, etc., but there are helpers to assist you with doing some common things, like
creating a new blog post:

```
cd site
hugo new posts/my-new-post-title.md
```

Your new post will be created as a draft with enough frontmatter to get you going. All content is authored
in [Markdown](https://en.wikipedia.org/wiki/Markdown).

## Working with Nginx

This package also bundles an Nginx web server with its own configuration. If you'd like to see
how the site will behave in production (for example, if you need to set up an automatic redirect or
make changes to caching rules), edit the Nginx configuration at `habitat/config/nginx.conf` and
then (re)start the service:

```
serve
```

You should be able to browse to the web server at http://localhost.
