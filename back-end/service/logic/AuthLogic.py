from .schemas.AuthLogic import UserDTO

from .db_services.BasicAuthAPI import BasicAuthAPI
from .db_services.UsersAPI import UsersAPI

from exceptions.db_exceptions import ObjectNotFound
from settings.Settings import DBSettings
import bcrypt

Users = UsersAPI(DBSettings.DATABASE_URL)
BasicAuth = BasicAuthAPI(DBSettings.DATABASE_URL)

class AuthLogic():
    def __init__(self) -> None: pass
    
    async def sign_in_by_login(
            self,
            login: str,
            password: str
        ) -> UserDTO:
        info = (await BasicAuth.get_info_by_login(
            login=login
        ))[0]
        status = bcrypt.checkpw(
            password.encode(),
            info.password
        )
        if not status: raise ObjectNotFound
        result = (await Users.get_by_id(
            userId=info.userId
        ))[0]
        print(result)
        return UserDTO(
            userId=result.userId,
            login=login,
            isAdmin=result.isAdmin
        )
    
    async def register_by_login(
            self,
            login: str,
            password: str,
            isAdmin: bool,
        ) -> UserDTO:
        
        new_user = await Users.add_user(
            isAdmin=isAdmin
        )
        await BasicAuth.add_auth_method(
            login=login,
            password=bcrypt.hashpw(password.encode(), bcrypt.gensalt()),
            userId=new_user.userId    
        )
        new_user_data = (await Users.get_by_id(
            userId=new_user.userId   
        ))[0]
        return UserDTO(
            userId=new_user_data.userId,
            login=login,
            isAdmin=new_user_data.isAdmin
        )