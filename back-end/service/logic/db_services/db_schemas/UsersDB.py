from sqlalchemy import String, Integer, Column, LargeBinary, UniqueConstraint, Text, Boolean
from sqlalchemy.orm import DeclarativeBase

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base

class UsersDB(declarative_base()):
    # Self-documentated code
    
    __tablename__ = 'Users'
    
    userId: Mapped[int] = mapped_column(Integer, nullable=False, unique=True, primary_key=True)
    isAdmin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self):
        '''
            Method, that returns human-readable data about rows
            Returns:
                str: Description of row
        '''
        return f"""<Users(
                        userId={self.userId},
                        isAdmin={self.isAdmin}
                    )>
                """