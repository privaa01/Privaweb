#!/usr/bin/python3
"""macOS local adapter using the kernel's flock; never removes the lock inode."""
import fcntl
import os
import stat
import sys
import time


def identity(fd, path):
    actual, expected = os.fstat(fd), os.lstat(path)
    return (os.path.realpath(path) == path and stat.S_ISREG(expected.st_mode)
            and not expected.st_mode & 0o077 and expected.st_uid == os.getuid()
            and actual.st_dev == expected.st_dev and actual.st_ino == expected.st_ino)


def main():
    args = sys.argv[1:]
    if len(args) == 2 and args[0] == '--verify-exclusive':
        fd = int(os.environ.get('PRIVA_PRIVACY_LOCK_FD', '-1'))
        if fd < 3 or not identity(fd, args[1]):
            return 1
        # The same open file description remains in the Node parent. Acquiring or
        # retaining EX here proves a real kernel barrier, not an environment flag.
        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return 0
    if len(args) < 4 or args[0] not in ('--shared', '--exclusive'):
        return 2
    mode = fcntl.LOCK_SH if args.pop(0) == '--shared' else fcntl.LOCK_EX
    wait = 0.0
    if args[0] == '--timeout':
        args.pop(0)
        wait = float(args.pop(0))
    elif args[0] == '--nonblock':
        args.pop(0)
    else:
        return 2
    path = args.pop(0)
    fd = os.open(path, os.O_RDWR | os.O_CREAT | os.O_NOFOLLOW, 0o600)
    if not identity(fd, path):
        return 1
    deadline = time.monotonic() + wait
    while True:
        try:
            fcntl.flock(fd, mode | fcntl.LOCK_NB)
            break
        except BlockingIOError:
            if time.monotonic() >= deadline:
                return 1
            time.sleep(0.02)
    os.set_inheritable(fd, True)
    os.environ['PRIVA_PRIVACY_LOCK_FD'] = str(fd)
    os.execvpe(args[0], args, os.environ)
    return 1


try:
    sys.exit(main())
except (OSError, ValueError, IndexError):
    sys.exit(1)
