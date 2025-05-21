from sqlalchemy import String, Integer, Column, LargeBinary, UniqueConstraint, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base

from datetime import datetime

class ResultsDB(declarative_base()):
    # Self-documentated code
    
    __tablename__ = "Results"
    
    resultId: Mapped[int] = mapped_column(Integer(), primary_key=True)

    userId: Mapped[int] = mapped_column(Integer(), ForeignKey("Users.userId"), nullable=False)
    testId: Mapped[int] = mapped_column(Integer(), ForeignKey("Tests.testId"), nullable=False)
    
    start: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=datetime.now())

    finish: Mapped[datetime] = mapped_column(DateTime(), nullable=True)
    score: Mapped[int] = mapped_column(Integer(), nullable=True)

    def __repr__(self):
        '''
            Method, that returns human-readable data about rows
            Returns:
                str: Description of row
        '''
        return f"""<Results(
                        resultId={self.resultId},
                        userId={self.userId},
                        testId={self.testId},
                        start={self.start},
                        finish={self.finish},
                        score={self.score}
                    )>
                """