package middleware

import (
	"net/http"
	"strings"

	"github.com/lnieuwenhuis/graphql-verdieping/custom/auth"
	"github.com/lnieuwenhuis/graphql-verdieping/custom/database"
	"gorm.io/gorm"
)

// AuthMiddleware handles authentication for GraphQL requests
func AuthMiddleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get the Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				// No auth header, continue without session
				next.ServeHTTP(w, r)
				return
			}

			// Extract token from "Bearer <token>" format
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				// Invalid format, continue without session
				next.ServeHTTP(w, r)
				return
			}

			token := parts[1]

			// Validate the session
			var session database.Session
			if err := db.Where("token = ? AND expires_at > datetime('now')", token).First(&session).Error; err != nil {
				// Invalid or expired session, continue without session
				next.ServeHTTP(w, r)
				return
			}

			// Add session to context
			ctx := auth.SetSessionInContext(r.Context(), &session)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}