from config import app, db
from flask import render_template, request, redirect, url_for, session
from product_model import Product


def handle_cart(id, quantity):
    """Helper function to manage cart operations"""
    if str(id) in session:
        session[str(id)] = session[str(id)] + quantity
    else:
        session[str(id)] = quantity
    session.modified = True


def check_product_data(name, description, price, quantity, link):
    """Helper function to validate product data"""
    if not all([name, description, price, link, quantity]):
        return False
    try:
        if float(price) < 0 or int(quantity) < 0:
            return False
        return True
    except ValueError:
        return False


@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == "POST":
        id = int(request.form.get("id", None))
        quantity = int(request.form.get("quantity", None))
        if id is None or quantity is None or quantity < 0:
            pass  # show error message
        else:
            handle_cart(id, quantity)

    products = Product.query.all()
    return render_template("index.html", products=products)


@app.route('/admin')
def admin():
    error = request.args.get("error", False)
    products = Product.query.all()
    return render_template("admin.html", products=products, error=error)


@app.route('/admin/delete', methods=["POST"])
def delete():
    id = request.form.get("id")
    if id is not None:
        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()
    return redirect('/admin')


@app.route('/admin/edit/<int:id>', methods=["POST"])
def edit(id):
    product = Product.query.get_or_404(id)
    return render_template("edit_product.html", product=product)


@app.route('/admin/add', methods=["POST"])
def add():
    return render_template("edit_product.html", product=None)


@app.route('/admin/add_product', methods=["POST"])
def add_product():
    name = request.form['name']
    description = request.form['description']
    price = request.form['price']
    quantity = request.form['quantity']
    availability = request.form['availability']
    link = request.form['link']

    if not check_product_data(name, description, price, quantity, link):
        return redirect(url_for('admin', error=True))

    product = Product(
        name=name,
        price=float(price),
        description=description,
        quantity=int(quantity),
        available=bool(availability),
        link=link
    )
    db.session.add(product)
    db.session.commit()
    return redirect(url_for("admin"))


@app.route('/admin/modify/<int:id>', methods=["POST"])
def modify(id):
    product = Product.query.get_or_404(id)
    
    name = request.form['name']
    description = request.form['description']
    price = request.form['price']
    quantity = request.form['quantity']
    availability = request.form['availability']
    link = request.form['link']

    if not check_product_data(name, description, price, quantity, link):
        return redirect(url_for('admin', error=True))

    product.name = name
    product.description = description
    product.link = link
    product.available = eval(availability.capitalize())
    product.price = float(price)
    product.quantity = int(quantity)
    db.session.commit()
    return redirect(url_for("admin"))


@app.route('/checkout', methods=["GET", "POST"])
def checkout():
    if request.method == 'POST':
        id = request.form.get("id")
        quantity = request.form.get("quantity")
        session[str(id)] = int(quantity)

    id_products_dict = {}
    for key in session:
        id_products_dict[f"{key}"] = Product.query.get_or_404(int(key))
    return render_template('checkout.html', items=session,
                         id_products_dict=id_products_dict)


@app.route('/remove/<int:id>', methods=["POST"])
def remove_from_checkout(id):
    del session[str(id)]
    return redirect(url_for('checkout'))