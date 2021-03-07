import os
import re
import shutil

import imgkit


THIS_DIR = os.path.dirname(__file__)

IMAGE_HTMLS_DIR = os.path.join(THIS_DIR, 'image-htmls')

OUT_DIR = os.path.join(THIS_DIR, 'public/images/generated')

FORMAT = '.png'


def _find_options_in_meta(content):
    """Reads 'content' and extracts options encoded in HTML meta tags
    :param content: str or file-like object - contains HTML to parse
    returns:
      dict: {config option: value}
    """
    meta_tag_prefix = 'imgkit-'

    found = {}

    for x in re.findall('<meta [^>]*>', content):
        if re.search('name=["\']%s' % meta_tag_prefix, x):
            name = re.findall('name=["\']%s([^"\']*)' %
                              meta_tag_prefix, x)[0]
            found[name] = re.findall('content=["\']([^"\']*)', x)[0]

    return found


def main():

    if os.path.isdir(OUT_DIR):
        shutil.rmtree(OUT_DIR)

    os.makedirs(OUT_DIR)

    for name in os.listdir(IMAGE_HTMLS_DIR):
        path = os.path.join(IMAGE_HTMLS_DIR, name)

        base_name, _ = name.split('.', 1)
        out_name = base_name + FORMAT
        out_path = os.path.join(OUT_DIR, out_name)

        with open(path) as f:
            options = _find_options_in_meta(f.read())

        imgkit.from_file(path, out_path, options=options)
        print(f"Rendered {name} to {out_path}")


if __name__ == '__main__':
    main()
