#!/bin/bash
#

cd registry/
httpster -p 9191 -d . --cors
