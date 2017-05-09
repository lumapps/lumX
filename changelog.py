#! /usr/bin/env python

from collections import defaultdict
import re
from subprocess import Popen, PIPE


def getTags():
    Popen('git fetch --tags'.split(), stdout=PIPE).communicate()
    (stdout, _) = Popen('git tag'.split(), stdout=PIPE).communicate()

    return sorted(stdout.split(), key=lambda s: [x for x in s.replace('v', '').split('.')])


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


def buildNewLogs(fromTag, toTag):
    stdout = ''
    if fromTag:
        (stdout, _) = Popen(('git rev-list %s..%s' % (fromTag, toTag)).split(), stdout=PIPE).communicate()
    else:
        (stdout, _) = Popen(('git rev-list %s' % toTag).split(), stdout=PIPE).communicate()

    commits = stdout.splitlines()

    kinds = defaultdict(list)
    kindTitles = {
        'feat': 'Features',
        'fix': 'Bug fixes',
        'docs': 'Documentation',
        'style': 'Style changes',
        'perf': 'Performance improvements',
        'test': 'Tests',
        'build': 'Build management improvements',
        'ci': 'Continuous Integration improvements',
        'misc': 'Miscellaneous'
    }

    for commit in commits:
        (title, _) = Popen(('git show -s --format=%%s %s' % commit).split(), stdout=PIPE).communicate()
        (body, _) = Popen(('git show -s --format=%%b %s' % commit).split(), stdout=PIPE).communicate()
        if not title:
            continue

        data = title.split(':', 1)
        kind = data[0].split('(', 1)
        scope = kind[1][:-1].rstrip()
        title = data[1].strip()

        if not kind[0] in kindTitles and scope != 'release':
            kind[0] = 'misc'

        kinds[kind[0]].append(scope + ': ' + title)

        if 'BROKEN:' in body:
            broken = body.split('BROKEN:')[1].splitlines().strip()
            kinds['broken'].append(broken)

    logs = "## %s:\n" % toTag

    if not len(kinds):
        logs += "*No major changes.*\n\n\n"
    else:
        for kind, kindTitle in kindTitles.iteritems():
            if len(kinds[kind]):
                logs += "\n#### " + kindTitle + ":\n"
                for thing in kinds[kind]:
                    logs += " - %s\n" % thing

        if len(kinds.get('brokens', [])):
            logs += "\n#### Breaking changes:\n"
            for broken in kinds['brokens']:
                logs += " - %s\n" % broken

        logs += "\n\n"

    return logs


if __name__ == "__main__":
    tags = getTags()
    lastChangelogTag = checkLastChangelogTag()

    changelog = ''
    tagsToBuild = tags
    previousTag = None
    if lastChangelogTag:
        previousTag = lastChangelogTag
        tagsToBuild = tags[tags.index(lastChangelogTag) + 1:]
    else:
        tagsToBuild = tags[1:]  # ignoring first release which contains only the first commit

    with open('CHANGELOG.md', 'r+') as f:
        changelog = f.read().replace('# Changelog\n\n', '').rstrip() + '\n'

    if not len(tagsToBuild):
        print "No new changelogs! Last tag (%s) is already in the CHANGELOG.md." % lastChangelogTag
        exit(0)

    for tag in tagsToBuild:
        newLogs = buildNewLogs(previousTag, tag)
        previousTag = tag
        changelog = newLogs + changelog

    changelog = '# Changelog\n\n' + changelog

    with open('CHANGELOG.md', 'w') as f:
        f.write(changelog)
