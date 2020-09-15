![Eluvio Logo](src/static/images/Logo-Small.png "Eluvio Logo")
  
# Eluvio Sample Site 

This application is an end-to-end video streaming service and platform using the Fabric. Users can upload their video content to the fabric and then view the content using one of the sample site templates that has customizable components, which is then deployed as their own personal video streaming site. 


## Site Sample Setup:

```
git clone https://github.com/eluv-io/elv-site-sample.git
cd elv-site-sample
git checkout components
npm install
```

### To run it:

```
npm run serve
```
The site sample should now be accessible through http://localhost:8086

Use access code "eluvio" to access sample site, or use "premiere" to access movie premiere site.


## Code Layout:

- Inside src, App.js contains the routing logic. 

- The code for the components is in src/components and categorized in different folders. Inside src/components, Site.js controls all the logic in pulling data from the customization bit and displaying the components.

- The SCSS/CSS code for styling is inside src/static/stylesheets and broken down into different categories. All the styling code is then imported from main.scss in src/static/stylesheets. 

- The data/state management is done with MobX, located in src/stores. Within this directory, index.js contains logic for redeeming codes and initializing the client, and Site.js contains logic for loading site customization data, video playout, and screen routing. 


## Component Breakdown:

### Hero Components:

1. Hero View: showcases single title in full-screen hero view format. Located in src/components/hero/HeroView.js

2. Hero Grid: showcases multiple titles in hero view format. Located in src/components/hero/HeroGrid.js

### Feature Components:

1. Box Feature: showcases single title with horizontal poster. Located in src/components/hero/BoxFeature.js

2. Video Feature: showcases single title with trailer. Located in src/components/hero/VideoFeature.js

### Carousel/Grid Components:

1. Swiper Grid (Landscape - small): showcases multiple titles in swiper format. Located in src/components/grid/SwiperGrid.js with isPoster props set as variant = "landscape" 

2. Swiper Grid (Portrait - large): showcases multiple titles in swiper format with poster images. Located in src/components/grid/SwiperGrid.js with isPoster props set as variant = "portrait" 

3. Title Grid: showcases mutltiple titles spanning as much horizontal space needed. Located in src/components/grid/TitleGrid.js

### Premiere Components:

1. Active Title: showcases one title on full page. Located in src/components/premiere/ActiveTitle.js 

2. Active Title Tabs: tab navigation between Title Overview and Premiere Episodes (only for series). Located in src/components/premiere/PremiereTabs.js

3. Movie Premiere: showcases one title on full page with additional features such as countdown to premiere and one time payment. Located in src/components/premiere/MoviePremiere.js

## Customization Bit: 

To access the customiation page, go to https://core.v3.contentfabric.io/#/apps ==> Eluvio Fabric Browser ==> Eluvio Demo - Properties ==> Manage (Blue tab on top) ==> Site Customization Tab

You should be on this page: 
https://core.v3.contentfabric.io/#/apps/Eluvio%20Fabric%20Browser/#/content/ilib4ZWhZKkSAFJuDNBsdJaRocjPRPCL/iq__SufWAMfhP6P2tTUSrmdTjRdPfUM/edit
