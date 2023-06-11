# Not all requests appear in HTTP Requests

By default, Spring limits the amount of requests that return in the `http.server.requests` metric to 100. To change this, modify `management.metrics.web.server.max-uri-tags` to your desired value.
