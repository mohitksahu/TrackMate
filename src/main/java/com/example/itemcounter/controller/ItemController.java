package com.example.itemcounter.controller;

import com.example.itemcounter.entity.Item;
import com.example.itemcounter.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // Allow requests from the frontend
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // Endpoint to get all items
    @GetMapping
    public ResponseEntity<?> getAllItems() {
        try {
            List<Item> items = itemRepository.findAll();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            // Handle the error and return a message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving items: " + e.getMessage());
        }
    }

    // Endpoint to add or update an item
    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody Item item) {
        try {
            // Check if the item already exists by name
            Item existingItem = itemRepository.findByName(item.getName());
            if (existingItem != null) {
                // If item exists, update the count
                existingItem.setCount(existingItem.getCount() + item.getCount());
                Item updatedItem = itemRepository.save(existingItem);
                return ResponseEntity.ok(updatedItem); // Return the updated item
            } else {
                // If item does not exist, save it as a new item
                Item savedItem = itemRepository.save(item);
                return ResponseEntity.ok(savedItem); // Return the saved item
            }
        } catch (Exception e) {
            // Handle the error and return a message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving item: " + e.getMessage());
        }
    }
}
