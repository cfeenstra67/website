import base64
import hashlib
import os

from typing import Sequence


def get_all_subpaths(root: str) -> Sequence[str]:
    """
    List all relative paths under the given root
    """
    root = os.path.abspath(root)

    for dirname, subdirs, files in os.walk(root):
        for filename in files:
            full_path = os.path.abspath(os.path.join(dirname, filename))
            rel_path = os.path.relpath(full_path, root)
            yield rel_path


def sha256sum(filename):
    """
    Helper function that calculates the hash of a file
    using the SHA256 algorithm
    Inspiration:
    https://stackoverflow.com/a/44873382
    NB: we're deliberately using `digest` instead of `hexdigest` in order to
    mimic Terraform.
    """
    h = hashlib.sha256()
    b = bytearray(128 * 1024)
    mv = memoryview(b)
    with open(filename, "rb", buffering=0) as f:
        for n in iter(lambda: f.readinto(mv), 0):
            h.update(mv[:n])
    return h.digest()


def filebase64sha256(filename):
    """
    Computes the Base64-encoded SHA256 hash of a file
    This function mimics its Terraform counterpart, therefore being compatible
    with Pulumi's provisioning engine.
    """
    h = sha256sum(filename)
    b = base64.b64encode(h)
    return b.decode()
