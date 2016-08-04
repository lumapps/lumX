import sys

SEPERATE_FIELD = '\t'
CLIENT_LANG = './lang.js'

fileName = sys.argv[1]

lines = [line.strip() for line in open(fileName)]

firstLine = True
langDictionnary = []
for line in lines:
    content = line.split(SEPERATE_FIELD)
    if firstLine:
        # Create the dictionnary for each lang
        for index, lang in enumerate(content):
            if index > 0:
                code = lang[lang.index('(') + 1: lang.index(')')] if ('(' in lang) else ''
                lang = {
                    'name': lang,
                    'code': code,
                    'values': []
                }
                langDictionnary.append(lang)
        firstLine = False
    else:
        key = content[0]
        for index, value in enumerate(content):
            if index > 0 and key and value:
                lang = langDictionnary[index - 1]
                if len(lang.get('code', '')) > 0:
                    entry = {
                        'key': key.strip(),
                        'value': value.strip()
                    }
                    lang['values'].append(entry)

# Write lang.js
fileClient = open(CLIENT_LANG, 'w')

fileClient.write("angular.module(APPLICATION_NAME).config(['$translateProvider', function($translateProvider)\n")
fileClient.write("{\n")

for lang in langDictionnary:
    if (len(lang.get('code', '')) > 0):
        fileClient.write("    $translateProvider.translations('" + lang['code'] + "',\n")
        fileClient.write("        {\n")

        for index, entry in enumerate(lang['values']):
            key = entry['key'].replace("'", "\\'")
            value = entry['value'].replace("'", "\\'")
            fileClient.write("            '" + key + "': '" + value + "'")

            if index < len(lang['values']) - 1:
                fileClient.write(",\n")

        fileClient.write("\n        });\n\n")

fileClient.write("$translateProvider.registerAvailableLanguageKeys(['en', 'de'], { 'en_US': 'en', 'en_UK': 'en', "
                 "'de_DE': 'de', 'de_CH': 'de', 'fr_FR': 'fr', 'fr_CA': 'fr' });\n")
fileClient.write("$translateProvider.determinePreferredLanguage();\n")
fileClient.write("$translateProvider.fallbackLanguage('en');\n")
fileClient.write("}]);")

fileClient.close()
