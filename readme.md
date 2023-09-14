# WD Master Theme Template

This is the Accrisoft Web Deployment Master Theme.
It's meant to be used as a flexible group of modules and components that with only a couple typography and color changes is suitable across all our vertical markets.

This  project is based on the official ZURB Template for use with [Foundation for Sites](http://foundation.zurb.com/sites).  It has a Gulp-powered build system with these features:

- Handlebars HTML templates with Panini
  - https://github.com/foundation/panini
  - https://handlebarsjs.com/
- Sass compilation and prefixing
  - https://sass-lang.com/documentation
- ~~JavaScript module bundling with webpack~~ - not currently used
- Built-in BrowserSync server
- For production builds:
  - CSS compression
  - ~~JavaScript module bundling with webpack~~ Not currently needed for Accrisoft
  - ~~Image compression~~ Not currently enabled or needed for Accrisoft

## Local Development
### Installation

To use this template, your computer needs:

- [NodeJS](https://nodejs.org/en/) (Version 6 or greater recommended, tested with 6.11.4 and 8.12.0)
- [Git](https://git-scm.com/)


####  Setup

To  set up the master theme, first download it with Git:

```bash
git clone ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/wd_master_theme
```

Then open the folder in your command line, and install the needed dependencies:

```bash
cd wd_master_theme
npm install
```

Finally, run `npm run start` to run Gulp. Your finished site will be created in a folder called `dist`, viewable at this URL:

```
http://localhost:8000
```

To create compressed, production-ready assets, run `npm run build`.

## Remote Development

Open the folder in your command line, and install the needed dependencies:

```bash
cd /home/node/app
npm install
```

Finally, run `npm run start` to run Gulp. Your finished site will be created in a folder called `dist`, viewable at the URL DevOps provided you, e.g.:

```
http://http://wdmt000001.accrisoft.com:10006/
```

To create compressed, production-ready assets, run `npm run build`.

##  Core Development

For now make a branch  and commit all changes for review. In the future we may allow simple edits like a new variable to be commited and pushed directly

Branch format for core/feature should be
```
feature/feature_name
```


##  Client Theme Development

Make a branch and commit all changes to it. Client name identifier should be concise but clear

Branch format should be
```
client/client_name_identifier
```

### Key Variables to change / review
`src/data/general.json`
- logo - better if its remote path so no files to commit, but can be local
- button_palette, theme-palette
  - Change after you set up the variables.
  - This is for preview / debug purposes only
- font_url - font stylesheet typciallly created at one of the following site
  - https://fonts.google.com/
  - https://fonts.adobe.com/ - needs adobe cc login.
    - Ask to have file generated for you if you don't have access


`src/assets/scss/_settings.scss`
- $foundation-palette
  - change primary, secondary, dark
  - add other colors you want to be button
- $theme-dark -
  - by default this propagates to many things, but those can be overridden seperately in needed
  - if unsure leave it, or ask

- $serif-font-family
  - The eyebrow and h5. the base theme was serif, but it doesn't actually have to be a serif font,
- $body-font-family
- $header-font-family
- $header-font-weight - in some cases you might want this not bold
- $button-font-family - only if different than $body-font-family
- $button-color -  swap default colors if you want default button to have white text
- $dropdownmenu-arrow-color, $dropdown-menu-item-color-active

`src/assets/scss/_freedom_settings.scss`

Use Developer discretion in this file. have the browser server running so you can review and tweak as needed

Examples of things that typically need to change
- $theme-colors - review, add or remove
- $footer-main-link-color
- $social-color
- $pageheader-background
- $quicklink-palette - uses nth child to loop through the colors
- $quicklink-style - solid, bordered or both

`src/assets/scss/stylesheet.scss`
- Comment out / Uncomment any components, or modules needed  or not used

`src/assets/scss/*`

Edit further files as needed. Make note of anything that could be turned into a variable for future build.

`src/pages/*`

You are welcome to modify the index.html or anything other file for preview purposes
Make notes of places you change in the html files as those changes may result in changes to layouts during build out.


**Configure Header Type / Style**

_Header styles are all in a single stylesheet now_

1. Change  `src/layouts/default.html` to use the correct params
2. Change the _header-_  variables in `src/assets/scss/_freedom_settings.scss` as needed  
   - if using the  jcc mega menu style set the include-mega-menu setting to true
   - search for _modify per site_ in _header.scss for other places that may need tweaks 

_NOTE: all sticky header implementation and hide / show on sticky is custom per implementation_

**General sticky implementation example / notes**

1. Wrap items to be stuck with `header-sticky-wrapper` class
2. Add `sticky` class and `data-sticky` to stuck element as well as data options as necessary
```html 
<!-- sticky the whole header add css to hide elements when .is-stuck  -->
<div class="header-sticky-wrapper" data-sticky-container>
    <header class="header sticky" data-sticky data-margin-top="0" data-header>
    ...
    </header>
</div>

<!-- sticky just the full nav bar and only at the main page content only -->
<div class="header-sticky-wrapper" data-sticky-container>
  <div class="header-fullnav-bar sticky" data-sticky data-margin-top="0" data-top-anchor="contentControl:top">
  ...
  </div>
</div>
```


##  Personal Playground on Remote

You can make as many local branches as you want. If you want to create a remote branch for experimentation

Branch format should be
```
playground/full_name
```

##  Deploying Theme to Live Site - New Server

1. Turn off dev server and run production build
```
npm run build
```
2. Back a fresh backup of https://asoft100117.accrisoft.com/themelibrary01/mt/
and restore on client server
3. Upload stylesheet.css and foundation_custom.css to the stylesheet module
4. Modify  _Green > Layouts > Pages > Framework_
  - Change the font url
  - Make the needed changes to header include
  - Change baseURL variable in the myAccount JS file to the main domain
  - If this is a more custom deployment make other changes if necessary
5. Update the website title in Strings module
6. Update menus and home sample components only if PM / Story says to
7. If you made any changes to the pages files locally that would result in layout changes make them
 
See [AccriProcess](https://www.accriprocess.com/) > WD > Buildouts for more information

## JCC Themes 

When deploying a JCC Theme be sure to check the following areas:

1. `_settings.scss` => Uncomment the JCC Color Palette and remove all that aren't used. Select a Primary & Secondary Color from the available JCC Color Palettes
2. `global/_themes.scss` Uncomment the JCC Color Palette you are going to use and remove all that aren't being used.
3. If using the Slideshow with Nav Blocks use the `slideshow_nav_blocks` Stylesheet in the `stylesheet.scss` file.
4. Swap out (if necessary) the Testimonials with the Cards Design
5. Copy the JavaScript from the `jcc_sitescripts.js` to the `sitescripts.js` file in the `default.html` layout - remove the non-used `<script>` calls.
# wd-uber-theme-upgrade-test
# wd-theme-test
# wd-theme-test
# wd-theme-test
