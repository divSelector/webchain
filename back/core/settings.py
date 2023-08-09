from pathlib import Path
import environ


BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(
    ENVIRONMENT=(str, "staging")
)
environ.Env.read_env(BASE_DIR.parent / '.env')

if env('ENVIRONMENT') == 'development':
    print("development")
    from .config.development import *

if env('ENVIRONMENT') == 'staging':
    print("staging")
    from .config.staging import *
