#!/usr/bin/env python
"""
Generate or update CSV language file
"""
import os
import csv
import re

CLIENT_FOLDER = './src/client/'
SERVER_FOLDER = './src/server/'

IGNORE_CLIENT_FOLDER = ''

FIRST = True
LANGS = ''
EXISTING_KEY_DICT = {}
KEY_TO_ADD_LIST = []
with open('lang.csv', 'rb') as csvfile:
    LINES = csv.reader(csvfile, delimiter='\t', quotechar='"')
    for line in LINES:
        if not FIRST:
            EXISTING_KEY_DICT[line[0]] = line
            KEY_TO_ADD_LIST.append(line[0])
        else:
            FIRST = False
            LANGS = line


for root, subFolders, files in os.walk(CLIENT_FOLDER):
    if root.startswith(IGNORE_CLIENT_FOLDER):
        break

    if 'libs' in subFolders:
        subFolders.remove('libs')

    for source in files:
        fileParts = source.split('.')
        if len(fileParts) > 1:
            if fileParts[len(fileParts)-1] in ['html', 'js']:
                fpath = os.path.join(root, source)
                with open(fpath) as f:
                    s = f.read()
                    found = re.findall(r"Translation\.translate\('([^']+)'\)", s)
                    KEY_TO_ADD_LIST = KEY_TO_ADD_LIST + found


for root, subFolders, files in os.walk(SERVER_FOLDER):
    if 'libs' in subFolders:
        subFolders.remove('libs')
    if 'api' in subFolders:
        subFolders.remove('api')

    for source in files:
        fileParts = source.split('.')
        if len(fileParts) > 1:
            if fileParts[len(fileParts)-1] in ['py']:
                fpath = os.path.join(root, source)
                with open(fpath) as f:
                    s = f.read()
                    found = re.findall(r"Translation\('([^']+)'\)", s)
                    KEY_TO_ADD_LIST = KEY_TO_ADD_LIST + found

KEY_TO_ADD_LIST = list(set(KEY_TO_ADD_LIST))
with open('lang.csv', 'w+') as output:
    output.write("\t".join(LANGS))
    for key in sorted(KEY_TO_ADD_LIST):
        output.write("\n" + ("\t".join(EXISTING_KEY_DICT[key]) if key in EXISTING_KEY_DICT.keys() else key))
