package com.supermarket.billing.service;

import com.supermarket.billing.model.Product;
import com.supermarket.billing.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAllProducts() {

        return repository.findAll();
    }

    public Product getProductById(int id) {

        return repository.findById(id);
    }

    public void addProduct(Product product) {

        if (product.getName() == null ||
            product.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Product name is required"
            );
        }

        if (product.getPrice() <= 0) {

            throw new IllegalArgumentException(
                    "Price must be greater than zero"
            );
        }

        if (product.getStock() < 0) {

            throw new IllegalArgumentException(
                    "Stock cannot be negative"
            );
        }

        if (product.getGst() < 0) {

            throw new IllegalArgumentException(
                    "GST cannot be negative"
            );
        }

        repository.save(product);
    }

    public void updateProduct(Product product) {

        repository.update(product);
    }

    public void deleteProduct(int id) {

        repository.delete(id);
    }
}