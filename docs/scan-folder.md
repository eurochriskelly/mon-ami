The script `scan=folder.js` and is run as follows:

    node scan.js --folder ./foo/ --name xxx --repository "REGISTRY_URL"

The script should scan the contents of the folder ./foo/ and produce a json
file representing it's structure. 

So for example, if the folder ./foo/ contains the following:

    .
    ├── bar
    │   ├── boo.js
    │   └── foo
    │       └── fee.xqy
    ├── baz
    │   ├── abc.js
    │   ├── def.xqy
    │   ├── ghi.sjs
    │   └── jkl.xq
    └── qux

The program output looks as follows:

[
    {
       "label": "xxx/bar/boo",
       "type": "sjs",
       "absolutePath": "<absolutePath goes here>",
       "url": "REGISTRY_URL/foo/bar/boo.js"
    },
    {
       "label": "xxx/bar/boo",
       "type": "sjs",
       "absolutePath": "<absolutePath goes here>",
       "url": "REGISTRY_URL/foo/bar/boo.js"
    },
    etc. one entry per file found
]

