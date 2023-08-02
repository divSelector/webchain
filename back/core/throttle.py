from rest_framework.throttling import UserRateThrottle, AnonRateThrottle, BaseThrottle

class UserBurstRateThrottle(UserRateThrottle):
    scope = 'user_burst'

class UserSustainedRateThrottle(UserRateThrottle):
    scope = 'user_sustained'

class AnonBurstRateThrottle(AnonRateThrottle):
    scope = 'anon_burst'

class AnonSustainedRateThrottle(AnonRateThrottle):
    scope = 'anon_sustained'

class NoThrottle(BaseThrottle):
    def allow_request(self, request, view):
        return True