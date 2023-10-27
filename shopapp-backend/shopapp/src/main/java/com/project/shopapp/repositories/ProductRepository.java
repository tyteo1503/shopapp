package com.project.shopapp.repositories;

import com.project.shopapp.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    Page<Product> findAll(Pageable pageable);//phân trang

    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS null or :categoryId = 0 or p.category.id = :categoryId )" +
            "AND (:keyword is null or :keyword = '' or p.name like %:keyword% or p.description like %:keyword%)")
    Page<Product> searchProducts
            (@Param("categoryId") Long categoryId,
             @Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productImage WHERE p.id = :productId")
    Optional<Product> getDetailProduct(@Param("productId") Long productId);

    @Query("SELECT p FROM Product p WHERE p.id in :productIds")
    List<Product> findProductsByIds(@Param("productIds") List<Long> productIds);
}
