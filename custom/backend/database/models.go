package database

import (
	"time"

	"gorm.io/gorm"
)

// Author represents a blog author
type Author struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Name      string         `gorm:"not null" json:"name"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"default:''" json:"-"` // Password is not included in JSON responses
	Bio       string         `json:"bio"`
	Role      string         `gorm:"default:'admin'" json:"role"` // Role: admin or user
	Posts     []Post         `gorm:"foreignKey:AuthorID" json:"posts"`
}

// Category represents a blog post category
type Category struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Name      string         `gorm:"uniqueIndex;not null" json:"name"`
	Slug      string         `gorm:"uniqueIndex;not null" json:"slug"`
	Posts     []Post         `gorm:"many2many:post_categories;" json:"posts"`
}

// Post represents a blog post
type Post struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	Title       string         `gorm:"not null" json:"title"`
	Slug        string         `gorm:"uniqueIndex;not null" json:"slug"`
	Description string         `json:"description"`
	Content     string         `gorm:"type:text;not null" json:"content"`
	Published   bool           `gorm:"default:false" json:"published"`
	AuthorID    uint           `gorm:"not null" json:"author_id"`
	Author      Author         `gorm:"foreignKey:AuthorID" json:"author"`
	Categories  []Category     `gorm:"many2many:post_categories;" json:"categories"`
}

// PostCategory represents the many-to-many relationship between posts and categories
type PostCategory struct {
	PostID     uint `gorm:"primaryKey"`
	CategoryID uint `gorm:"primaryKey"`
}

// Session represents a user session for authentication
type Session struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Token     string         `gorm:"uniqueIndex;not null" json:"token"`
	AuthorID  uint           `gorm:"not null" json:"author_id"`
	Author    Author         `gorm:"foreignKey:AuthorID" json:"author"`
	ExpiresAt time.Time      `gorm:"not null" json:"expires_at"`
}