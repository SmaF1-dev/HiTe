from models_sql import Base, User, Test, TestResult
from sqlalchemy import create_engine
from config import settings

def recreate_tables():
    engine = create_engine(
        f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
    )
    
    # Указываем порядок удаления таблиц (сначала зависимые)
    Base.metadata.drop_all(engine, tables=[
        TestResult.__table__,
        Test.__table__,
        User.__table__
    ])
    
    # Создаем таблицы в правильном порядке
    Base.metadata.create_all(engine, tables=[
        User.__table__,
        Test.__table__,
        TestResult.__table__
    ])
    
    print("Таблицы успешно пересозданы")

if __name__ == "__main__":
    recreate_tables()