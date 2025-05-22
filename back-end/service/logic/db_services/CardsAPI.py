#Required lib import
from sqlalchemy import select, delete

from typing import List

from .BasicAPI import BasicAPI

# For type annotations

from .db_schemas.CardsDB import CardsDB

class CardsAPI(BasicAPI):
    def __init__(self, base_url):
        super().__init__(CardsDB, base_url)

    async def add_card(self, title: str, description: str, isCorrect: bool, testId: int) -> CardsDB:
        statement = self.base(
            test=testId,
            title=title,
            description=description,
            isCorrect=isCorrect
        )
        async with self.session() as session:
            session.add(statement)
            await session.commit()
        return statement
    
    async def get_cards(self, testId: int) -> List[CardsDB]:
        statement = select(self.base).where(self.base.test == testId)
        async with self.session() as session:
            out = await session.execute(statement)
        return out.scalars().all()