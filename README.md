# Where Should I Eat?

A lightweight web app for the [10k Apart Contest](https://a-k-apart.com/).

> The Challenge? Build a compelling web experience that can be delivered in 10kB and works without JavaScript.
>
> _a-k-apart.com_


## Measurements

| Name                | Type      | Size (kB) | Notes
|---------------------|-----------|----------:|------
| /                   | document  | 1.7       |
| style.min.css       | stylesheet| 2.8       |
| /eat                | document  | 1.9       |
| main.js             | script    | 1.1       | optional - site functions w/out js
| css?family=Raleway  | stylesheet| 0.7       | optional and lazyloaded
| [google font]       | font      | 13.1      | optional and lazyloaded


| Totals                 | Size (kB) |
|------------------------|----------:|
| Baseline (no JS)       | 6.4       |
| Baseline + JS          | 7.5       |
| Base + JS + lazy-loads | 21.3      |
