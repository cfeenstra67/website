import re


has_extension = re.compile(r"(.+)\.[a-zA-Z0-9]{2,5}$")


def handle(event, context):
    request = event["Records"][0]["cf"]["request"]
    url = request["uri"]

    if url != "/" and not has_extension.search(url):
        request["uri"] = f"{url}.html"
 
    return request   
