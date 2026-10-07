import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path


# =========================
# Create Reports Folder
# =========================

REPORTS_DIR = Path("reports")
REPORTS_DIR.mkdir(exist_ok=True)


def generate_csv_report(product_summary):
    file_path = REPORTS_DIR / "analytics_report.csv"

    product_summary.to_csv(
        file_path,
        index=False
    )

    print(f"CSV report created: {file_path}")


def generate_excel_report(metrics):
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
            metrics["total_sales"],
            metrics["total_orders"],
            metrics["total_quantity"],
            metrics["average_order_value"],
            metrics["top_product"],
            metrics["maximum_sale"],
            metrics["minimum_sale"],
            metrics["median_sale"]
        ]
    })

    file_path = REPORTS_DIR / "analytics_report.xlsx"

    with pd.ExcelWriter(
        file_path,
        engine="openpyxl"
    ) as writer:

        summary_df.to_excel(
            writer,
            sheet_name="Summary",
            index=False
        )

        metrics["product_summary"].to_excel(
            writer,
            sheet_name="Product Performance",
            index=False
        )

        metrics["top_5_products"].to_excel(
            writer,
            sheet_name="Top 5 Products",
            index=False
        )

        metrics["status_summary"].to_excel(
            writer,
            sheet_name="Order Status",
            index=False
        )

    print(f"Excel report created: {file_path}")


def generate_sales_chart(product_summary):
    if product_summary.empty:
        print("No product sales data available for chart.")
        return

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

    file_path = REPORTS_DIR / "sales_by_product.png"

    plt.savefig(file_path)

    plt.close()

    print(f"Sales chart created: {file_path}")


def generate_top_products_chart(top_5_products):
    if top_5_products.empty:
        print("No top product data available for chart.")
        return

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

    file_path = REPORTS_DIR / "top_5_products.png"

    plt.savefig(file_path)

    plt.close()

    print(f"Top 5 products chart created: {file_path}")