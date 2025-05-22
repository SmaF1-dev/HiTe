from sqlalchemy import String, Integer, Column, LargeBinary, UniqueConstraint, Text, Boolean, ForeignKey, Boolean
from sqlalchemy.orm import DeclarativeBase

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base

from typing import List

from .HighlightsDB import HighlightsDB

class CardsDB(declarative_base()):
    # Self-documentated code
    
    __tablename__ = "Cards"
    
    cardId: Mapped[int] = mapped_column(Integer(), nullable=False, unique=True, primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str] = mapped_column(Text(), nullable=False)
    isCorrect: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    test: Mapped[str] = mapped_column(Integer, ForeignKey("Tests.testId", ondelete="CASCADE"), nullable=False)

    def __repr__(self):
        '''
            Method, that returns human-readable data about rows
            Returns:
                str: Description of row
        '''
        return f"""<Cards(
                        cardId={self.cardId},
                        title={self.title},
                        description={self.description}
                    )>
                """