#! /usr/bin/env python

import re
import subprocess
import sys


def checkExistingTag(version):
    if (subprocess.call(('git show-ref --verify --quiet refs/heads/%s' % version).split()) == 0 or
        subprocess.call(('git show-ref --verify --quiet refs/tags/%s' % version).split()) == 0):
        print "Error: The tag '%s' already exists" % version
        raise Exception()


# def checkout(node):
#     if subprocess.call(('git checkout %s' % node).split(), stderr=subprocess.STDOUT, stdout=subprocess.PIPE) != 0:
#         print "Error: The git node '%s' doesn't exist" % node
#         exit(-1)


def updateHomepage(version):
    file_str = None
    with open('build/includes/home/home.html') as f:
        file_str = f.read()

    file_str = re.sub(r'href="[^"]*"',
                      'href="https://github.com/lumapps/lumX/archive/%s.zip"' % version,
                      file_str)

    file_str = re.sub(r'<span class="home-banner__version">[^"]*<\/span>',
                      '<span class="home-banner__version">%s</span>' % version,
                      file_str)

    with open('demo/includes/home/home.html', "w") as f:
        f.write(file_str)


def updateGitignore():
    file_str = None
    with open('.gitignore') as f:
        file_str = f.read()

    file_str = re.sub(r'/dist', '', file_str)

    with open('.gitignore', "w") as f:
        f.write(file_str)


def commit(version):
    untrackedFiles = subprocess.Popen('git ls-files -o --exclude-standard'.split(), stdout=subprocess.PIPE)
    subprocess.call(('git add %s' % untrackedFiles.stdout.read().replace('\n', ' ')).split())
    subprocess.call(['git', 'commit', '-am', 'chore release: new release %s' % version], stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    subprocess.call(('git tag %s' % version).split())
    # print "Publishing new commit to master"
    # subprocess.call('git push origin master'.split(), stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    print "Publishing new tag"
    subprocess.call(('git push origin %s' % version).split(), stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    print "Release %s created!" % version


if __name__ == "__main__":
    try:
        if len(sys.argv) == 1:
            print "Error: The version name is required"
            raise Exception()

        version = sys.argv[1]

        checkExistingTag(version)

        # if len(sys.argv) > 2:
        #     checkout(sys.argv[2])

        updateHomepage(version)
        updateGitignore()
        commit(version)
    except Exception as e:
        exit(-1)
