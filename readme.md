# Pugger

Pugger is a static website generator using Pug templates and all data provided as JSON objects.

## Installing

To install Pugger globally do the following.
```bash
npm install pugger --global
```
Once you've installed Pugger globally, you can generate sites as shown below.
```bash
# initialize a site named foo-bar
pugger --init foo-bar

# change into foo-bar
cd foo-bar
npm run build # builds the site
npm run serve # serves the site using PHP
```

## Customizing
Pugger creates a `src/pugger.config.js` file, which contains all the paths used to generate the website.

All content of the website is stored in `src/site.js`. You can edit this file to make changes to the website.

All assets should be placed in `src/assets`.