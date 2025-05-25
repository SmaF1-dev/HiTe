#Required lib import
from sqlalchemy import select, delete

from typing import List

from .BasicAPI import BasicAPI

# For type annotations

from .db_schemas.HighlightsDB import HighlightsDB

class HighlightsAPI(BasicAPI):
    def __init__(self, base_url):
        super().__init__(HighlightsDB, base_url)

    async def add_highlight(self, cardId: int, start: int, finish: int, color: str) -> HighlightsDB:
        statement = self.base(
            cardId=cardId,
            start=start,
            finish=finish,
            color=color
        )
        async with self.session() as session:
            session.add(statement)
            await session.commit()
        return statement
    
    async def get_highlights(self, cardId: int) -> List[HighlightsDB]:
        statement = select(self.base).where(
            self.base.cardId == cardId
        )
        async with self.session() as session:
            out = await session.execute(statement)
        return out.scalars().all()