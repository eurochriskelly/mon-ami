const showHelpMessge = () => {
  const msg = `

Typical usage: 
  - Create a registry file in a repository and check it in to git.
  - The registry.json file shoul have a structure like this:

    {
      "Command name": "http://repository.mydomain.org/path/to/do-something.xqy",
      "Other command": "http://repository.mydomain.org/path/to/do-something-else.js",
    }

  - From the extension, click on the gear icon to add or remove registries
`
}

showHelpMessge()
