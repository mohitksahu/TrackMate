package com.example.itemcounter.repository;

import com.example.itemcounter.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    // Custom query methods (if needed)
    Item findByName(String name);
}
