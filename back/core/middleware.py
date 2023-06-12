# from django import http
# from django.conf import settings


# class CorsMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         response = self.get_response(request)

#         for host in settings.CORS_ALLOWED_ORIGIN:

#             # print(f"THIS IS A THE HOST: {host}")
#             # print(f"THIS IS A THE HTTP_ORIGIN: {request.META['HTTP_ORIGIN']}")

#             if request.META['HTTP_ORIGIN'].startswith(host):
#                 if (request.method == "OPTIONS"  and "HTTP_ACCESS_CONTROL_REQUEST_METHOD" in request.META):
#                     response = http.HttpResponse()
#                     response["Content-Length"] = "0"
#                     response["Access-Control-Max-Age"] = 86400
#                 response["Access-Control-Allow-Origin"] = "*"
#                 response["Access-Control-Allow-Methods"] = "DELETE, GET, OPTIONS, PATCH, POST, PUT"
#                 response["Access-Control-Allow-Headers"] = "accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with"

#         return response