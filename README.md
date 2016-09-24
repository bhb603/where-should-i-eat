# Where Should I Eat?

A lightweight web app for the [10k Apart Contest](https://a-k-apart.com/).

> The Challenge? Build a compelling web experience that can be delivered in 10kB and works without JavaScript.
>
> _a-k-apart.com_


## About

**Where should I eat?** It's one of the most pressing questions we face every day. Whether paralyzed by too many choices in the city, or faced with the uncertainty of an unfamiliar town, the where-should-i-eat app can help you.

Simply enter your location into the search form and submit. Powered by the robust Foursquare API and an advanced selection algorithm, the where-should-i-eat app will search restaurants in your area and present you with a single, decisive answer to your gastronomical needs.

Core to the app's usefulness is the fact that it's lightweight. The entire experience is delivered via open web standards, is compatible across devices and modern browsers, and weighs in at under 5 kB. Don't trust javascript? It's fully functional without it.

This app uses data provided by the Foursquare API according to [Foursquare's policies](https://developer.foursquare.com/overview/community). Proper [attribution and linking](https://developer.foursquare.com/overview/attribution.html) has been practiced, such that all Foursquare data is accompanied by attribution text ('Powered by Foursquare') and a link to the Foursquare page.

## Measurements

| Name                | Type      | Size (kB) | Size Content-Encoding=gzip (kB) |
|---------------------|-----------|----------:|--------------------------------:|
| /                   | html      | 1.4       | 0.94                            |
| style.min.css       | stylesheet| 2.9       | 1.4                             |
| /eat                | html      | 1.7       | 1.1                             |
| main.js             | script    | 0.75      | 0.79                            |
|**TOTAL**            |           | **6.75**  | **4.23**                        |
