#Required lib import
from sqlalchemy import select, delete

from typing import List

from .BasicAPI import BasicAPI

# For type annotations

from .db_schemas.BasicAuthDB import BasicAuthDB
from .db_schemas.UsersDB import UsersDB

class BasicAuthAPI(BasicAPI):
    def __init__(self, base_url):
        super().__init__(BasicAuthDB, base_url)

    async def add_auth_method(self, login: str, password: bytes, userId: int) -> None:
        statement = self.base(
            login=login,
            password=password,
            userId=userId
        )
        async with self.session() as session:
            session.add(statement)
            await session.commit()

    async def remove_auth_method(self, login: str) -> None:
        statement = delete(self.base).where(self.base.login == login)

        async with self.session() as session:
            session.add(statement)
            await session.commit()
    
    async def get_info_by_login(self, login: str) -> List[BasicAuthDB]:
        statement = select(self.base).where(self.base.login == login)

        async with self.session() as session:
            out = await session.execute(statement)
        return out.scalars().all()