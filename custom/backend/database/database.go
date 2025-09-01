package database

import (
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDatabase initializes the SQLite database connection and runs migrations
func InitDatabase() {
	// Create database directory if it doesn't exist
	if err := os.MkdirAll("./data", 0755); err != nil {
		log.Fatal("Failed to create data directory:", err)
	}

	// Open SQLite database connection
	var err error
	DB, err = gorm.Open(sqlite.Open("./data/blog.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the schema
	err = DB.AutoMigrate(&Author{}, &Category{}, &Post{}, &PostCategory{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed initial data
	seedData()

	log.Println("Database initialized successfully")
}

// seedData creates initial sample data for the blog
func seedData() {
	// Check if data already exists
	var authorCount int64
	DB.Model(&Author{}).Count(&authorCount)
	if authorCount > 0 {
		return // Data already seeded
	}

	// Create sample authors
	authors := []Author{
		{
			Name:  "John Doe",
			Email: "john@example.com",
			Bio:   "Tech enthusiast and blogger",
		},
		{
			Name:  "Jane Smith",
			Email: "jane@example.com",
			Bio:   "Frontend developer and UI/UX designer",
		},
	}

	for _, author := range authors {
		DB.Create(&author)
	}

	// Create sample categories
	categories := []Category{
		{Name: "Technology", Slug: "technology"},
		{Name: "Programming", Slug: "programming"},
		{Name: "Web Development", Slug: "web-development"},
		{Name: "GraphQL", Slug: "graphql"},
	}

	for _, category := range categories {
		DB.Create(&category)
	}

	// Create sample posts
	posts := []Post{
		{
			Title:       "Getting Started with GraphQL",
			Slug:        "getting-started-with-graphql",
			Description: "Learn the basics of GraphQL and how to implement it in your applications",
			Content:     "GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.",
			Published:   true,
			AuthorID:    1,
		},
		{
			Title:       "Building Modern Web Applications",
			Slug:        "building-modern-web-applications",
			Description: "Explore modern web development techniques and best practices",
			Content:     "Modern web applications require a solid understanding of various technologies and frameworks. In this post, we'll explore the key concepts and tools that every web developer should know, including React, TypeScript, and modern build tools like Vite.",
			Published:   true,
			AuthorID:    2,
		},
		{
			Title:       "The Future of Frontend Development",
			Slug:        "future-of-frontend-development",
			Description: "A look into emerging trends and technologies in frontend development",
			Content:     "Frontend development is constantly evolving. From new frameworks to improved tooling, developers have more options than ever before. This post explores the current trends and what we can expect in the coming years.",
			Published:   false,
			AuthorID:    1,
		},
	}

	for _, post := range posts {
		DB.Create(&post)
	}

	// Associate posts with categories
	var post1, post2 Post
	DB.Where("slug = ?", "getting-started-with-graphql").First(&post1)
	DB.Where("slug = ?", "building-modern-web-applications").First(&post2)

	var techCategory, programmingCategory, webDevCategory, graphqlCategory Category
	DB.Where("slug = ?", "technology").First(&techCategory)
	DB.Where("slug = ?", "programming").First(&programmingCategory)
	DB.Where("slug = ?", "web-development").First(&webDevCategory)
	DB.Where("slug = ?", "graphql").First(&graphqlCategory)

	// Associate categories with posts
	DB.Model(&post1).Association("Categories").Append(&techCategory, &programmingCategory, &graphqlCategory)
	DB.Model(&post2).Association("Categories").Append(&techCategory, &webDevCategory, &programmingCategory)

	log.Println("Sample data seeded successfully")
}