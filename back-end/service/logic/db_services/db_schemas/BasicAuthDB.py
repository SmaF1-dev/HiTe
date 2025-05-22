from sqlalchemy import String, Integer, Column, LargeBinary, UniqueConstraint, Text, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base

class BasicAuthDB(declarative_base()):
    # Self-documentated code
    
    __tablename__ = "BasicAuth"
    
    login: Mapped[str] = mapped_column(String(128), nullable=False, unique=True, primary_key=True)
    password: Mapped[bytes] = mapped_column(LargeBinary(), nullable=False)
    userId: Mapped[int] = mapped_column(ForeignKey("Users.userId", ondelete="CASCADE"), nullable=False, unique=True)

    def __repr__(self):
        '''
            Method, that returns human-readable data about rows
            Returns:
                str: Description of row
        '''
        return f"""<BasicAuth(
                        userId={self.userId},
                        login={self.login},
                        password={self.password}
                    )>
                """