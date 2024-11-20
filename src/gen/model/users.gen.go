// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package model

const TableNameUser = "users"

// User mapped from table <users>
type User struct {
	ID       int64   `gorm:"column:id;type:bigint unsigned;primaryKey;autoIncrement:true" json:"id"`
	Name     *string `gorm:"column:name;type:varchar(100)" json:"name"`
	Email    *string `gorm:"column:email;type:varchar(191);uniqueIndex:uni_users_email,priority:1" json:"email"`
	Password *string `gorm:"column:password;type:longtext" json:"password"`
}

// TableName User's table name
func (*User) TableName() string {
	return TableNameUser
}
