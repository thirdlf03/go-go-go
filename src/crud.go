package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"mygrpc/gen/model"
	"mygrpc/gen/query"
)

func main() {
	// Initialize the database connection
	dsn := "root:password@tcp(127.0.0.1:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Set the default database for the generated query
	query.SetDefault(db)

	// Create a new user
	name := "John ssDoe"
	email := "johjjn@example.com"
	newUser := &model.User{Name: &name, Email: &email}
	if err := query.User.Create(newUser); err != nil {
		log.Fatal(err)
	}
	fmt.Println("User created:", newUser)

	name = "Johnkk"
	email = "johnnnn@example.com"
	newUser = &model.User{Name: &name, Email: &email}
	if err := query.User.Create(newUser); err != nil {
		log.Fatal(err)
	}
	fmt.Println("User created:", newUser)

	// Read the first user
	user, err := query.User.First()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("First user:", user)

	// Update the user
	newName := "John Smith"
	user.Name = &newName
	if err := query.User.Save(user); err != nil {
		log.Fatal(err)
	}
	fmt.Println("User updated:", user)

	// Delete the user
	if _, err := query.User.Delete(user); err != nil {
		log.Fatal(err)
	}
	fmt.Println("User deleted")
}
