#Required lib import
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import select, update, delete, desc
from sqlalchemy.orm import sessionmaker
from sqlalchemy import and_

from typing import Self, Dict, List
from typing_extensions import Annotated

from .BasicAPI import BasicAPI

# For type annotations
from .db_schemas.UsersDB import UsersDB

class UsersAPI(BasicAPI):
    def __init__(self, base_url):
        self = super().__init__(UsersDB, base_url)

    async def add_user(self, isAdmin: bool) -> UsersDB:
        statement = self.base(
            isAdmin=isAdmin
        )
        async with self.session() as session:
            session.add(statement)
            await session.commit()
        
        return statement

    
    async def get_by_id(self, userId: int) -> List[UsersDB]:
        '''
            Method that returns all info about user with specified userId.
            Args:
                userId(str): user's userId
            Returns:
                list: all user's data
        '''
        statement = select(self.base).where(self.base.userId == userId)
        async with self.session() as session:
            out = await session.execute(statement)
        return out.scalars().all()