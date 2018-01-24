pkg_name=habitat-www
pkg_origin=core
pkg_version="0.1.0"
pkg_description="The Habitat website!"
pkg_maintainer="The Habitat Maintainers <humans@habitat.sh"
pkg_license=("Apache-2.0")
pkg_svc_user="root"

pkg_deps=(
  core/nginx
  core/coreutils
)

pkg_build_deps=(
  cnunciato/hugo
  cnunciato/node-sass
  core/node
)

do_build() {
  rm -rf site/public
  node-sass --include-path site/scss --output site/static/css site/scss/main.scss
  hugo --baseURL ${BASE_URL:="https://habitat.sh"} --source site

  cd components
  npm install

  for b in node_modules/.bin/*; do
    echo "$b"
    fix_interpreter "$(readlink -f -n "$b")" core/coreutils bin/env
  done

  npm run build
}

do_install() {
  mkdir -pv $pkg_prefix/public
  cp -Rv site/public/* $pkg_prefix/public
  cp -Rv components/www/build/app* $pkg_prefix/public/js/
}
