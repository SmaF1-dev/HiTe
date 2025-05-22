#Required lib import
from sqlalchemy import select, delete, update

from typing import List, Any

from .BasicAPI import BasicAPI

from datetime import datetime

# For type annotations

from .db_schemas.ResultsDB import ResultsDB


class ResultsAPI(BasicAPI):
    def __init__(self, base_url):
        self = super().__init__(ResultsDB, base_url)

    async def add_result_template(self, userId: int, testId: int) -> ResultsDB:
        statement = self.base(
            userId=userId,
            testId=testId,
        )
        async with self.session() as session:
            session.add(statement)
            await session.commit()
        return statement
    
    async def update_result(self, resultId: int, score: int) -> None:
        statement = update(self.base).where(self.base.resultId == resultId).values(
            finish = datetime.now(),
            score = score
        )

        async with self.session() as session:
            await session.execute(statement)
            await session.commit()
    
    async def get_result_by_userId(self, userId: int, start: int, count: int) -> List[ResultsDB]:
        statement = select(self.base).where(self.base.userId == userId).order_by(
                    self.base.start.desc()
            ).offset(start).fetch(count)

        async with self.session() as session:
            out = await session.execute(statement)
        return out.scalars().all()