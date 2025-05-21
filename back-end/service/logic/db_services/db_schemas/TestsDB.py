from sqlalchemy import String, Integer, Column, LargeBinary, UniqueConstraint, Text, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base

from .CardsDB import CardsDB

from typing import List

class TestsDB(declarative_base()):
    # Self-documentated code
    
    __tablename__ = "Tests"
    
    testId: Mapped[int] = mapped_column(Integer(), nullable=False, unique=True, primary_key=True)
    authorId: Mapped[int] = mapped_column(Integer, ForeignKey("Users.userId", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str] = mapped_column(Text(), nullable=False)

    def __repr__(self):
        '''
            Method, that returns human-readable data about rows
            Returns:
                str: Description of row
        '''
        return f"""<Tests(
                        testId={self.testId},
                        authorId={self.authorId},
                        keyCard={self.keyCard},
                        title={self.title}
                    )>
                """