from config import db, ma


class Product(db.Model):
    """Database model for farm products"""

    # Table configuration
    __tablename__ = "PRODUCT"
    
    # Database columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float)
    description = db.Column(db.String)
    quantity = db.Column(db.Integer)
    available = db.Column(db.Boolean)
    link = db.Column(db.String)

    def __repr__(self):
        return f"<Product (name={self.name!r}, price=${self.price:.2f})>"
    
    def is_in_stock(self):
        """Check if product is available and has stock"""
        return self.available and self.quantity > 0
    
    def get_total_price(self, quantity):
        """Calculate total price for a given quantity"""
        return self.price * quantity


class ProductSchema(ma.SQLAlchemySchema):
    """Schema for serializing product data"""

    class Meta:
        model = Product
        load_instance = True

    # Field definitions
    id = ma.auto_field()
    name = ma.auto_field()
    price = ma.auto_field()
    description = ma.auto_field()
    quantity = ma.auto_field()
    available = ma.auto_field()
    link = ma.auto_field() 