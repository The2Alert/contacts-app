build:
	npm run frontend:build
	npm run build
	docker run --rm -d -p 3306:3306 --name contacts-app-db-for-migrations -v "contacts-app-db-for-migrations:/var/lib/mysql" -e MYSQL_ROOT_PASSWORD=qwerty123 -e MYSQL_DATABASE=contacts-app mysql
	timeout -t 30
	npm run migration:run || exit 0
	npm run migration:generate || exit 0
	npm run build
	npm run migration:run || exit 0
	docker stop contacts-app-db-for-migrations
	docker build . -t dev2alert/contacts-app
push:
	docker push dev2alert/contacts-app
pull:
	docker pull dev2alert/contacts-app
run:
	docker-compose up
stop:
	docker-compose stop
run-dev:
	docker run --rm -d -p 3306:3306 --name contacts-app-dev-db -v "contacts-app-dev-db:/var/lib/mysql" -e MYSQL_ROOT_PASSWORD=qwerty123 -e MYSQL_DATABASE=contacts-app mysql
	timeout -t 30
	npm run dev
stop-dev:
	docker stop contacts-app-dev-db