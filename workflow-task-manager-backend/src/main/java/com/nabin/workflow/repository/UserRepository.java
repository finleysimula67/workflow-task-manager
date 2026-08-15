package com.nabin.workflow.repository;

import com.nabin.workflow.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
//Provides necessary CRUD operations to the UserServices class
//Which helps to reduce the effort to write the manual SQL queries
//User is the entity class and Long is the datatype for the primary key
public interface UserRepository extends JpaRepository<User, Long>
{
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}