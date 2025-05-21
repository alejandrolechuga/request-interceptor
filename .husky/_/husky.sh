#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug() {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky:debug $1"
  }
  readonly hook_name="$(basename "$0")"
  debug "$hook_name hook started"
  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi
  if [ -f ~/.huskyrc ]; then
    debug "using ~/.huskyrc"
    . ~/.huskyrc
  fi
  export husky_skip_init=1
  sh -e "$0" "$@"
  exitCode="$?"
  debug "$hook_name hook finished: $exitCode"
  exit $exitCode
fi
