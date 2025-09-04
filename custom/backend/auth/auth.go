package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/lnieuwenhuis/graphql-verdieping/custom/database"
)

// GenerateToken generates a random session token
func GenerateToken() (string, error) {
	bytes := make([]byte, 32)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashed), err
}

// CheckPassword compares a password with its hash
func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// CreateSession creates a new session for an author
func CreateSession(db *gorm.DB, authorID uint) (*database.Session, error) {
	token, err := GenerateToken()
	if err != nil {
		return nil, err
	}

	session := &database.Session{
		Token:     token,
		AuthorID:  authorID,
		ExpiresAt: time.Now().Add(24 * time.Hour), // 24 hour expiry
	}

	if err := db.Create(session).Error; err != nil {
		return nil, err
	}

	return session, nil
}

// ValidateSession validates a session token and returns the author
func ValidateSession(db *gorm.DB, token string) (*database.Author, error) {
	var session database.Session
	if err := db.Where("token = ? AND expires_at > ?", token, time.Now()).First(&session).Error; err != nil {
		return nil, errors.New("invalid or expired session")
	}

	var author database.Author
	if err := db.First(&author, session.AuthorID).Error; err != nil {
		return nil, errors.New("author not found")
	}

	return &author, nil
}

// DeleteSession deletes a session (logout)
func DeleteSession(db *gorm.DB, token string) error {
	return db.Where("token = ?", token).Delete(&database.Session{}).Error
}

// Context key for session
type contextKey string

const SessionContextKey contextKey = "session"

// GetSessionFromContext retrieves the session from context
func GetSessionFromContext(ctx context.Context) *database.Session {
	session, ok := ctx.Value(SessionContextKey).(*database.Session)
	if !ok {
		return nil
	}
	return session
}

// SetSessionInContext sets the session in context
func SetSessionInContext(ctx context.Context, session *database.Session) context.Context {
	return context.WithValue(ctx, SessionContextKey, session)
}