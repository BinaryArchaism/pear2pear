package services

type ServiceInterface interface {
}

type Service struct {
}

func NewService() ServiceInterface {
	return Service{}
}
