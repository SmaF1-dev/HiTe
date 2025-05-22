#Required lib import
from sqlalchemy import select, delete

from typing import List, Any

from .BasicAPI import BasicAPI

# For type annotations

from .db_schemas.TestsDB import TestsDB

from validation.tests.components.testCard import TestCard
from .db_schemas.CardsDB import CardsDB
from .db_schemas.HighlightsDB import HighlightsDB

class TestsAPI(BasicAPI):
    def __init__(self, base_url):
        self = super().__init__(TestsDB, base_url)

    async def add_test(self, title: str, authorId: int, description: str) -> TestsDB:
        statement = self.base(
            title=title,
            authorId=authorId,
            description=description
        )
        async with self.session() as session:
            session.add(statement)
            await session.commit()
        return statement
    
    async def get_test(self, testId: int) -> List[TestsDB]:
        statement = select(self.base).where(self.base.testId == testId)

        async with self.session() as session:
            out = await session.execute(statement)
        return out.scalars().all()