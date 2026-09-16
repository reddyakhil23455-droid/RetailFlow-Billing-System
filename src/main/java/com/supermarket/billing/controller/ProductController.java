package com.supermarket.billing.controller;

import com.supermarket.billing.model.Product;
import com.supermarket.billing.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // GET ALL
    @GetMapping
    public List<Product> getAllProducts() {

        return service.getAllProducts();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable int id) {

        try {

            Product product =
                    service.getProductById(id);

            return ResponseEntity.ok(product);

        } catch (Exception e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // ADD
    @PostMapping
    public ResponseEntity<?> addProduct(
            @RequestBody Product product) {

        try {

            service.addProduct(product);

            return ResponseEntity.ok(
                    "Product added successfully"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int id,
            @RequestBody Product product) {

        try {

            product.setId(id);

            service.updateProduct(product);

            return ResponseEntity.ok(
                    "Product updated successfully"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable int id) {

        try {

            service.deleteProduct(id);

            return ResponseEntity.ok(
                    "Product deleted successfully"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}