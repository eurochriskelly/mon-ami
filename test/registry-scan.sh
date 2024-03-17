#!/bin/bash

outfile="test/registry-test.json"
test -f $outfile && rm $outfile

node scripts/build/scan-folder.js \
  --folder test/simple \
  --name aaa \
  --repository "http://repo.foo.bar/main" \
  --absolutePath \
  --outfile "$outfile"

if [ ! -f $outfile ]; then
  echo "File $outfile not created"
  exit 1
else
  clear
  echo "File $outfile created with the following contents:"
  cat $outfile
  rm $outfile
fi


