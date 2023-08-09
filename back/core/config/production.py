from core.config.base import *

REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'dj_rest_auth':   '5/hour',
    'payments':       '9999999/second',
    'user_burst':     '60/minute',
    'user_sustained': '300/hour',
    'anon_burst':     '30/minute',
    'anon_sustained': '120/hour',
}
REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = [
    'rest_framework.throttling.ScopedRateThrottle',
    'core.throttle.UserBurstRateThrottle',
    'core.throttle.UserSustainedRateThrottle',
    'core.throttle.AnonBurstRateThrottle',
    'core.throttle.AnonSustainedRateThrottle',
]

ADMIN_UNREGISTERED_MODELS += [
    'EmailAddress',
    'Account',
    'TokenProxy'
]