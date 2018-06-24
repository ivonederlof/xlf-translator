# Xlf-translator

This package may be used to automate i18n translations with google translate.
It is primarily used for bootstrapping language files before they are edited with csv files in numbers/excel.
This project is still under construction.

## Getting Started

### Installing

Simply use npm to install the package

```
# Global so it can be call from anywhere
$ npm install -g json2csv
# or as a dependency of a project
$ npm install xlf-translator --save
```

### Usage

Add a ```translator.config.json``` file in the root directory of you angular project, make sure your i18n is setup. Then run it once. This will generate
a ```message.(language-code).xlf``` and a ```message.(language-code).csv``` in the src/locale directory. We can then use the csv to edit our translations.

```
{
  "project": "my-awesome-project",
  "localDir": "./src/locale",
  "fromLanguage": "en",
  "toLanguage": [
    "nl"
  ]
}
```

## Built With

* [google-translate-api](https://github.com/matheuss/google-translate-api) - Used translate the files
* [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) - Used for editing xml
* [csvtojson](https://www.npmjs.com/package/csvtojson) - Convert csv to json
* [json2csv](https://www.npmjs.com/package/json2csv) - Convert json to csv

## Contributing

Submit pull requests to us.

## Author

* **Ivo Nederlof** - *Initial work* - [xlf-translator](https://github.com/ivonederlof/xlf-translator)

## Other

Use these codes in the config file """toLanguage""" """fromLanguage"""
```
'auto': 'Automatic'
'af': 'Afrikaans'
'sq': 'Albanian'
'am': 'Amharic'
'ar': 'Arabic'
'hy': 'Armenian'
'az': 'Azerbaijani'
'eu': 'Basque'
'be': 'Belarusian'
'bn': 'Bengali'
'bs': 'Bosnian'
'bg': 'Bulgarian'
'ca': 'Catalan'
'ceb': 'Cebuano'
'ny': 'Chichewa'
'zh-cn': 'Chinese Simplified'
'zh-tw': 'Chinese Traditional'
'co': 'Corsican'
'hr': 'Croatian'
'cs': 'Czech'
'da': 'Danish'
'nl': 'Dutch'
'en': 'English'
'eo': 'Esperanto'
'et': 'Estonian'
'tl': 'Filipino'
'fi': 'Finnish'
'fr': 'French'
'fy': 'Frisian'
'gl': 'Galician'
'ka': 'Georgian'
'de': 'German'
'el': 'Greek'
'gu': 'Gujarati'
'ht': 'Haitian Creole'
'ha': 'Hausa'
'haw': 'Hawaiian'
'iw': 'Hebrew'
'hi': 'Hindi'
'hmn': 'Hmong'
'hu': 'Hungarian'
'is': 'Icelandic'
'ig': 'Igbo'
'id': 'Indonesian'
'ga': 'Irish'
'it': 'Italian'
'ja': 'Japanese'
'jw': 'Javanese'
'kn': 'Kannada'
'kk': 'Kazakh'
'km': 'Khmer'
'ko': 'Korean'
'ku': 'Kurdish (Kurmanji)'
'ky': 'Kyrgyz'
'lo': 'Lao'
'la': 'Latin'
'lv': 'Latvian'
'lt': 'Lithuanian'
'lb': 'Luxembourgish'
'mk': 'Macedonian'
'mg': 'Malagasy'
'ms': 'Malay'
'ml': 'Malayalam'
'mt': 'Maltese'
'mi': 'Maori'
'mr': 'Marathi'
'mn': 'Mongolian'
'my': 'Myanmar (Burmese)'
'ne': 'Nepali'
'no': 'Norwegian'
'ps': 'Pashto'
'fa': 'Persian'
'pl': 'Polish'
'pt': 'Portuguese'
'ma': 'Punjabi'
'ro': 'Romanian'
'ru': 'Russian'
'sm': 'Samoan'
'gd': 'Scots Gaelic'
'sr': 'Serbian'
'st': 'Sesotho'
'sn': 'Shona'
'sd': 'Sindhi'
'si': 'Sinhala'
'sk': 'Slovak',
'sl': 'Slovenian'
'so': 'Somali'
'es': 'Spanish'
'su': 'Sundanese'
'sw': 'Swahili'
'sv': 'Swedish'
'tg': 'Tajik'
'ta': 'Tamil'
'te': 'Telugu'
'th': 'Thai'
'tr': 'Turkish'
'uk': 'Ukrainian'
'ur': 'Urdu'
'uz': 'Uzbek'
'vi': 'Vietnamese'
'cy': 'Welsh'
'xh': 'Xhosa'
'yi': 'Yiddish'
'yo': 'Yoruba'
'zu': 'Zulu'
```
