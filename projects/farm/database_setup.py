import csv
import os
import sqlalchemy as sa
from sqlalchemy.orm import scoped_session, sessionmaker
from product_model import Product

SQL_FILE_PATH = os.path.join(os.path.dirname(__file__), "farm.sqlite3")
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), "farm.csv")


def build_db():
    """Initialize the database"""

    if os.path.exists(SQL_FILE_PATH):
        os.remove(SQL_FILE_PATH)

    engine = sa.create_engine(f"sqlite:////{SQL_FILE_PATH}")
    session = scoped_session(sessionmaker(bind=engine))

    Product.metadata.create_all(engine)

    with open(f"{CSV_FILE_PATH}", "r", encoding="utf8") as f:
        content = csv.DictReader(f)
        for item in content:
            product = Product(
               id=item["id"],
               name=item["name"],
               price=item["price"],
               description=item["description"],
               quantity=item["quantity"],
               available=eval(item["available"]),
               link=item["link"])
            session.add(product)
        session.commit()


def main():
    build_db()


if __name__ == "__main__":
    main() 