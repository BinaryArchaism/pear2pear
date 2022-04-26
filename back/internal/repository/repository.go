package repository

type RepositoryInterface interface {
}

type Repository struct {
}

func NewRepository() RepositoryInterface {
	return Repository{}
}
