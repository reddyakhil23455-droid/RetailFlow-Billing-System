package com.supermarket.billing.repository;

import com.supermarket.billing.model.Product;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // GET ALL PRODUCTS
    public List<Product> findAll() {

        String sql = """
                SELECT id, name, category, price, stock, gst
                FROM products
                ORDER BY id DESC
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new Product(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("category"),
                        rs.getDouble("price"),
                        rs.getInt("stock"),
                        rs.getDouble("gst")
                )
        );
    }

    // GET PRODUCT BY ID
    public Product findById(int id) {

        String sql = """
                SELECT id, name, category, price, stock, gst
                FROM products
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> new Product(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("category"),
                        rs.getDouble("price"),
                        rs.getInt("stock"),
                        rs.getDouble("gst")
                ),
                id
        );
    }

    // INSERT PRODUCT
    public int save(Product product) {

        String sql = """
                INSERT INTO products
                (name, category, price, stock, gst)
                VALUES (?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getStock(),
                product.getGst()
        );
    }

    // UPDATE PRODUCT
    public int update(Product product) {

        String sql = """
                UPDATE products
                SET name = ?,
                    category = ?,
                    price = ?,
                    stock = ?,
                    gst = ?
                WHERE id = ?
                """;

        return jdbcTemplate.update(
                sql,
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getStock(),
                product.getGst(),
                product.getId()
        );
    }

    // DELETE PRODUCT
    public int delete(int id) {

        String sql =
                "DELETE FROM products WHERE id = ?";

        return jdbcTemplate.update(sql, id);
    }
}