#Required lib import
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

from sqlalchemy.orm import DeclarativeBase

from typing import Self, Generic, TypeVar, Annotated, Type, List, Any

import asyncio
import traceback

class BasicAPI():
    def __init__(self, base_fields, base_url: str, related: List[Any] = None) -> None:
        '''
            Method that starts connection to database
            Args:
                base_fields(`DeclarativeBase`):
                    Schema of databse. Can be found in backend.fields
                base_url(str):
                    Link to database. Starts with (for example): `postgresql+asyncpg://`
            Returns:
                self:
            Raises:
                NoDatabaseConnection: If engine for some reason can't connect to database
        '''

        #if related is not None:
        #    for db in related:
        #        asyncio.create_task(
        #            BasicAPI._createAdditionalDB(
        #                base_fields=db,
        #                base_url=base_url
        #            )
        #        )

        self.base = base_fields
        self.base_url = base_url
        self.engine = create_async_engine(base_url)

        try:
            loop_ = asyncio.get_event_loop()
        except:
            loop_ = asyncio.new_event_loop()
        loop_.create_task(
                BasicAPI._createAll(self.engine, self.base)
        )
        
        self.session = sessionmaker(
            bind=self.engine, # type: ignore
            expire_on_commit=False,
            class_=AsyncSession
        ) # type: ignore
    
    @staticmethod
    async def _createAdditionalDB(base_fields, base_url: str):
        await BasicAPI._createAll(
            create_async_engine(base_url),
            base_fields
        )
        

    @staticmethod
    async def _createAll(engine, base):
        async with engine.begin() as conn:
            #await conn.run_sync(base.metadata.drop_all)
            await conn.run_sync(base.metadata.reflect)
            await conn.run_sync(base.metadata.create_all)