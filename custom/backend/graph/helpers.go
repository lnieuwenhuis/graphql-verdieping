package graph

import (
	"strconv"

	"github.com/lnieuwenhuis/graphql-verdieping/custom/database"
	"github.com/lnieuwenhuis/graphql-verdieping/custom/graph/model"
)

// Helper functions to convert database models to GraphQL models

func dbPostToGraphQL(dbPost *database.Post) *model.Post {
	post := &model.Post{
		ID:          strconv.FormatUint(uint64(dbPost.ID), 10),
		Title:       dbPost.Title,
		Slug:        dbPost.Slug,
		Description: &dbPost.Description,
		Content:     dbPost.Content,
		Published:   dbPost.Published,
		CreatedAt:   dbPost.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:   dbPost.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	// Handle empty description
	if dbPost.Description == "" {
		post.Description = nil
	}

	// Convert author if loaded
	if dbPost.Author.ID != 0 {
		post.Author = dbAuthorToGraphQL(&dbPost.Author)
	}

	// Convert categories if loaded
	for _, dbCategory := range dbPost.Categories {
		post.Categories = append(post.Categories, dbCategoryToGraphQL(&dbCategory))
	}

	return post
}

func dbAuthorToGraphQL(dbAuthor *database.Author) *model.Author {
	author := &model.Author{
		ID:        strconv.FormatUint(uint64(dbAuthor.ID), 10),
		Name:      dbAuthor.Name,
		Email:     dbAuthor.Email,
		Bio:       &dbAuthor.Bio,
		Role:      dbAuthor.Role,
		CreatedAt: dbAuthor.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: dbAuthor.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	// Handle empty bio
	if dbAuthor.Bio == "" {
		author.Bio = nil
	}

	// Convert posts if loaded
	for _, dbPost := range dbAuthor.Posts {
		post := &model.Post{
			ID:          strconv.FormatUint(uint64(dbPost.ID), 10),
			Title:       dbPost.Title,
			Slug:        dbPost.Slug,
			Description: &dbPost.Description,
			Content:     dbPost.Content,
			Published:   dbPost.Published,
			CreatedAt:   dbPost.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			UpdatedAt:   dbPost.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}
		if dbPost.Description == "" {
			post.Description = nil
		}
		author.Posts = append(author.Posts, post)
	}

	return author
}

func dbCategoryToGraphQL(dbCategory *database.Category) *model.Category {
	category := &model.Category{
		ID:        strconv.FormatUint(uint64(dbCategory.ID), 10),
		Name:      dbCategory.Name,
		Slug:      dbCategory.Slug,
		CreatedAt: dbCategory.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: dbCategory.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	// Convert posts if loaded
	for _, dbPost := range dbCategory.Posts {
		post := &model.Post{
			ID:          strconv.FormatUint(uint64(dbPost.ID), 10),
			Title:       dbPost.Title,
			Slug:        dbPost.Slug,
			Description: &dbPost.Description,
			Content:     dbPost.Content,
			Published:   dbPost.Published,
			CreatedAt:   dbPost.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			UpdatedAt:   dbPost.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}
		if dbPost.Description == "" {
			post.Description = nil
		}
		category.Posts = append(category.Posts, post)
	}

	return category
}