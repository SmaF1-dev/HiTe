from sqlalchemy import String, Integer, Column, LargeBinary, UniqueConstraint, Text, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base

class HighlightsDB(declarative_base()):
    # Self-documentated code
    
    __tablename__ = "Highlights"
    
    start: Mapped[int] = mapped_column(Integer(), primary_key=True)
    finish: Mapped[int] = mapped_column(Integer(), primary_key=True)
    color: Mapped[str] = mapped_column(String(16), primary_key=True)
    cardId: Mapped[int] = mapped_column(
        Integer, ForeignKey("Cards.cardId", ondelete="CASCADE"),
        primary_key=True
    )
    

    def __repr__(self):
        '''
            Method, that returns human-readable data about rows
            Returns:
                str: Description of row
        '''
        return f"""<Highlight(
                        start={self.start},
                        finish={self.finish},
                        cardId={self.cardId}
                    )>
                """