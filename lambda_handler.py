
def handle(event, context):
    request = event["Records"][0]["cf"]["request"]
    url = request["uri"]

    if url.endswith("/"):
        request["url"] += "index.html"
    elif "." not in url:
        request["url"] += "/index.html"

    return request
