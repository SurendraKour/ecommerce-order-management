import mysql.connector
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# =========================
# Connect to MySQL
# =========================

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Mankirat@088",
    database="ecommerce_db"
)

print("MySQL connection successful!")


# =========================
# Get Order + Product Data
# =========================

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

df = pd.read_sql(query, connection)


# =========================
# Remove Cancelled Orders
# =========================

sales_df = df[
    df["status"] != "CANCELLED"
].copy()


# =========================
# Basic Analytics
# =========================

total_sales = sales_df["item_total"].sum()

total_quantity = sales_df["quantity"].sum()

total_orders = sales_df["order_id"].nunique()

average_order_value = (
    total_sales / total_orders
    if total_orders > 0
    else 0
)


# =========================
# Product Analytics
# =========================

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


# =========================
# Top-Selling Product
# =========================

top_product = (
    product_summary.iloc[0]["product"]
    if not product_summary.empty
    else "N/A"
)


# =========================
# NumPy Statistics
# =========================

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


# =========================
# Display Report
# =========================

print("\n================================")
print("       E-COMMERCE ANALYTICS")
print("================================")

print(f"Total Sales: ₹{total_sales:,.2f}")

print(f"Total Orders: {total_orders}")

print(f"Total Quantity Sold: {total_quantity}")

print(
    f"Average Order Value: "
    f"₹{average_order_value:,.2f}"
)

print(f"Top-Selling Product: {top_product}")

print(
    f"Maximum Sale: "
    f"₹{maximum_sale:,.2f}"
)

print(
    f"Minimum Sale: "
    f"₹{minimum_sale:,.2f}"
)

print(
    f"Median Sale: "
    f"₹{median_sale:,.2f}"
)


print("\n===== PRODUCT PERFORMANCE =====")

print(product_summary)

# =========================
# Top 5 Products
# =========================

top_5_products = product_summary.head(5)

print("\n===== TOP 5 PRODUCTS BY SALES =====")

for index, row in top_5_products.iterrows():
    print(
        f"{index + 1}. {row['product']} - "
        f"₹{row['total_sales']:,.2f}"
    )
    # =========================
# Top 5 Products Chart
# =========================

plt.figure(figsize=(10, 6))

plt.bar(
    top_5_products["product"],
    top_5_products["total_sales"]
)

plt.title("Top 5 Products by Sales")
plt.xlabel("Product")
plt.ylabel("Sales (₹)")

plt.xticks(rotation=30)

plt.tight_layout()

plt.savefig("top_5_products.png")

plt.show()

print("Top 5 products chart created: top_5_products.png")
# =========================
# Export CSV
# =========================

product_summary.to_csv(
    "analytics_report.csv",
    index=False
)
# =========================
# Product Sales Chart
# =========================

plt.figure(figsize=(10, 6))

plt.bar(
    product_summary["product"],
    product_summary["total_sales"]
)

plt.title("Sales by Product")
plt.xlabel("Product")
plt.ylabel("Sales (₹)")

plt.xticks(rotation=30)

plt.tight_layout()

plt.savefig("sales_by_product.png")

plt.show()

print("Sales chart created: sales_by_product.png")
print(
    "\nAnalytics report created: "
    "analytics_report.csv"
)

# =========================
# Excel Analytics Report
# =========================

summary_df = pd.DataFrame({
    "Metric": [
        "Total Sales",
        "Total Orders",
        "Total Quantity Sold",
        "Average Order Value",
        "Top-Selling Product",
        "Maximum Sale",
        "Minimum Sale",
        "Median Sale"
    ],
    "Value": [
        total_sales,
        total_orders,
        total_quantity,
        average_order_value,
        top_product,
        maximum_sale,
        minimum_sale,
        median_sale
    ]
})

status_df = (
    df["status"]
    .value_counts()
    .reset_index()
)

status_df.columns = ["status", "order_count"]


with pd.ExcelWriter(
    "analytics_report.xlsx",
    engine="openpyxl"
) as writer:

    summary_df.to_excel(
        writer,
        sheet_name="Summary",
        index=False
    )

    product_summary.to_excel(
        writer,
        sheet_name="Product Performance",
        index=False
    )

    top_5_products.to_excel(
        writer,
        sheet_name="Top 5 Products",
        index=False
    )

    status_df.to_excel(
        writer,
        sheet_name="Order Status",
        index=False
    )


print("\nExcel report created: analytics_report.xlsx")
# =========================
# Close Connection
# =========================

connection.close()

print("MySQL connection closed.")