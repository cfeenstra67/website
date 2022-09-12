
def handle(event, context):
    request = event["Records"][0]["cf"]["request"]
    url = request["uri"]

    if url.endswith("/"):
        request["uri"] += "index.html"
    elif "." not in url:
        request["uri"] += "/index.html"

    return request
