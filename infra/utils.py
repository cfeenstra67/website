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
