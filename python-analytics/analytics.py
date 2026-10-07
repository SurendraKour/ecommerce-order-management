import pandas as pd
import numpy as np


def load_order_data(connection):
    query = """
    SELECT
        o.id AS order_id,
        o.order_status AS status,
        oi.quantity,
        oi.price AS item_total,
        p.name AS product,
        p.price AS unit_price
    FROM order_items oi
    JOIN orders o
        ON oi.order_id = o.id
    JOIN product p
        ON oi.product_id = p.id
    """

    return pd.read_sql(query, connection)


def calculate_sales_metrics(df):
    sales_df = df[
        df["status"] != "CANCELLED"
    ].copy()

    total_sales = sales_df["item_total"].sum()

    total_quantity = sales_df["quantity"].sum()

    total_orders = sales_df["order_id"].nunique()

    average_order_value = (
        total_sales / total_orders
        if total_orders > 0
        else 0
    )

    product_summary = (
        sales_df
        .groupby("product")
        .agg(
            quantity_sold=("quantity", "sum"),
            total_sales=("item_total", "sum"),
            average_unit_price=("unit_price", "mean")
        )
        .sort_values(
            by="total_sales",
            ascending=False
        )
        .reset_index()
    )

    top_product = (
        product_summary.iloc[0]["product"]
        if not product_summary.empty
        else "N/A"
    )

    sales_values = sales_df["item_total"].to_numpy()

    maximum_sale = (
        np.max(sales_values)
        if len(sales_values) > 0
        else 0
    )

    minimum_sale = (
        np.min(sales_values)
        if len(sales_values) > 0
        else 0
    )

    median_sale = (
        np.median(sales_values)
        if len(sales_values) > 0
        else 0
    )

    top_5_products = product_summary.head(5)

    status_summary = (
        df["status"]
        .value_counts()
        .reset_index()
    )

    status_summary.columns = [
        "status",
        "order_count"
    ]

    return {
        "sales_df": sales_df,
        "total_sales": total_sales,
        "total_quantity": total_quantity,
        "total_orders": total_orders,
        "average_order_value": average_order_value,
        "product_summary": product_summary,
        "top_product": top_product,
        "maximum_sale": maximum_sale,
        "minimum_sale": minimum_sale,
        "median_sale": median_sale,
        "top_5_products": top_5_products,
        "status_summary": status_summary
    }