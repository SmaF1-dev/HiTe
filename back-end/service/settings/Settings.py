from dataclasses import dataclass

@dataclass
class Settings:
    '''
        Main settings of app
        Attributes:
            API_VERSION (int): version of API
    '''
    API_VERSION = 1

@dataclass
class SecuritySettings():
    # openssl rand -hex 64
    SECURITY_KEY = "2ab7ad779dce066fe08fea8d1bf7abd5fca0ed9d2c3f2ad906a786b1c31de64136be002270298783d103cfcc2b2e6bdde9d14446b3d5e7dbb721b979ee54f6bb" 
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
    ALGORYTM = "HS512"

@dataclass
class DBSettings():
    # uncomment this before building container!
    DATABASE_URL = "postgresql+asyncpg://release:horse_ate_green_guinea_pig@postgres/db"

    # uncomment for local database
    #DATABASE_URL = "postgresql+asyncpg://release:horse_ate_green_guinea_pig@localhost/db"
