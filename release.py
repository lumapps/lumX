#! /usr/bin/env python

import re
import subprocess
import sys


# Check if the new tag we want to create exists already or not
def checkExistingTag(version):
    if (subprocess.call(('git show-ref --verify --quiet refs/heads/%s' % version).split()) == 0 or
            subprocess.call(('git show-ref --verify --quiet refs/tags/%s' % version).split()) == 0):
        print "Error: The tag '%s' already exists" % version
        raise Exception()


# Update content on the homepage
def updateHomepage(version):
    file_str = None
    with open('build/includes/home/home.html') as f:
        file_str = f.read()

    # Update download link to ZIP
    file_str = re.sub(r'href="[^"]*"',
                      'href="https://github.com/lumapps/lumX/archive/%s.zip"' % version,
                      file_str)

    # Update version number in banner
    file_str = re.sub(r'<span class="home-banner__version">[^"]*<\/span>',
                      '<span class="home-banner__version">%s</span>' % version,
                      file_str)

    with open('demo/includes/home/home.html', "w") as f:
        f.write(file_str)


# Remove /dist from the .gitignore for the releases
def updateGitignore():
    file_str = None
    with open('.gitignore') as f:
        file_str = f.read()

    file_str = re.sub(r'/dist', '', file_str)

    with open('.gitignore', "w") as f:
        f.write(file_str)


# Commit the changes (/dist, .gitignore, /demo) and push the new tag
def commit(version):
    subprocess.call(('git tag %s' % version).split())

    subprocess.call(('python changelog.py').split())
    subprocess.call(('git add .').split())
    subprocess.call(['git', 'commit', '-m', 'chore(release): new release %s' % version], stderr=subprocess.STDOUT,
                    stdout=subprocess.PIPE)

    print "Publishing new tag"
    subprocess.call(('git push --tags').split(), stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    subprocess.call(('git push').split(), stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    print "Release %s created!" % version


if __name__ == "__main__":
    try:
        if len(sys.argv) == 1:
            print "Error: The version name is required"
            raise Exception()

        version = sys.argv[1]

        checkExistingTag(version)
        updateHomepage(version)
        updateGitignore()
        commit(version)
    except Exception as e:
        exit(-1)
