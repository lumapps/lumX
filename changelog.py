#! /usr/bin/env python
from subprocess import Popen, PIPE
import re
import sys


def checkLastChangelogTag():
    last = None
    with open('CHANGELOG.md', 'r+') as f:
        lines = f.readlines()

        for line in lines:
            m = re.search(r'^##\s+(\S+):', line)
            if m:
                last = m.group(1)
                break

    return last


def buildNewLogs(fromTag, version):
    stdout = ''
    if fromTag:
        (stdout, _) = Popen(('git rev-list %s..origin/master' % fromTag).split(), stdout=PIPE).communicate()
    else:
        (stdout, _) = Popen(('git rev-list origin/master').split(), stdout=PIPE).communicate()

    commits = stdout.splitlines()
    feats = []
    fixs = []
    brokens = []

    for commit in commits:
        (title, _) = Popen(('git show -s --format=%%s %s' % commit).split(), stdout=PIPE).communicate()
        (body, _) = Popen(('git show -s --format=%%b %s' % commit).split(), stdout=PIPE).communicate()
        if not title:
            continue

        data = title.split(' ', 1)

        if data[0] == 'feat':
            feats.append(data[1].rstrip())
        elif data[0] == 'fix':
            fixs.append(data[1].rstrip())

        if 'BROKEN:' in body:
            brokens += body.split('BROKEN:')[1].splitlines()

    logs = "## %s:\n" % version

    if not len(feats) and not len(fixs) and not len(brokens):
        logs += "*No major changes.*\n\n\n"
    else:
        if len(feats):
            logs += "\n#### New features:\n"
            for feat in feats:
                logs += " - %s\n" % feat
        if len(fixs):
            logs += "\n#### Bug fixes:\n"
            for fix in fixs:
                logs += " - %s\n" % fix
        if len(brokens):
            logs += "\n#### Breaking changes:\n"
            for broken in brokens:
                if broken.rstrip() != '':
                    logs += " - %s\n" % broken
        logs += "\n\n"

    return logs

def main(version):
    print "Generating changelog for %s..." % version

    lastChangelogTag = checkLastChangelogTag()
    changelog = ''

    with open('CHANGELOG.md', 'r+') as f:
        changelog = f.read().replace('# Changelog\n\n', '').rstrip() + '\n'

    newLogs = buildNewLogs(lastChangelogTag, version)
    changelog = newLogs + changelog

    changelog = '# Changelog\n\n' + changelog

    with open('CHANGELOG.md', 'w') as f:
        f.write(changelog)

if __name__ == "__main__":
    if len(sys.argv) == 1:
        print "Error: The version name is required"
        exit(-1)
    main(sys.argv[1])
