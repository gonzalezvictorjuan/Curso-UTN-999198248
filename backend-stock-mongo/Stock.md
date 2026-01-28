Mongo

Productos
\_id
name
categoria ref -> doc de categoria
stock
descripcion
price
createAt
updateAt

Categorias
\_id
name

CRUD tanto de Productos como de Categorias

modelo >> servicio >> controller >> router >> index
|| || || ||
(q usa) (q usa) (q usa) (middlewares)

index >> router >> controller >> servicio >> modelo

- index: punto de entrada
- router: agrupa las rutas de un mismo conjunto de apis
  controller: son los encargados de manejar los errores/respuestas exitosas, en casos complejos tambien centralizan los servicios si es que hay mas de uno.
  services: la logica de lo que vamos a necesitar hacer
  modelo: el encargado de hablar con la base de datos

get /api/producto todos los productos
get /api/producto/:id trae un producto
post /api/producto cargo un producto
put /api/producto actualizo un producto
delete /api/producto/:id elimino un producto

get /api/categoria todos los categorias
get /api/categoria/:id trae una categoria
post /api/categoria cargo un categoria
put /api/categoria actualizo un categoria
delete /api/categoria/:id elimino un categoria

curl http://localhost:3000/api/categoria

curl http://localhost:3000/api/categoria/6969868862b4bef89b9e671a

curl -X POST http://localhost:3000/api/categoria -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzJiYTg2MmQxN2I0NzIxYTRmOGY2ZiIsInVzZXJuYW1lIjoicGVwZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2OTU1NTI5NywiZXhwIjoxNzY5NjQxNjk3LCJpc3MiOiJjdXJzby11dG4tYmFja2VuZCJ9.grqQtH1p_yBCwTJE8vCobwET-JD4Yba5bitb8gf0dNk" -d '{"name": "Nueva Categoria"}'

curl -X PUT http://localhost:3000/api/categoria/6969868862b4bef89b9e671a -H "Content-Type: application/json" -d '{"name": "Categoria Actualizada"}'

curl -X DELETE http://localhost:3000/api/categoria/6969868862b4bef89b9e671a

que hace falta??? validaciones!!!!

despues como plus podemos ver de usar el middleware authorize para bloquear las rutas create, update & delete

curl http://localhost:3000/api/producto

curl http://localhost:3000/api/producto/697016f417d05a0e5405c4ec

curl -X POST http://localhost:3000/api/producto -H "Content-Type: application/json" -d '{"name":"Producto Ejemplo", "description" : "el mejor producto del mundo", "price" : 999.99, "stock" : 1, "categoryId" : "6975323294fbbe3a3c2847d6"}'

curl -X PUT http://localhost:3000/api/producto/69701df701c30afa1a593cf2 -H "Content-Type: application/json" -d '{"name":"Producto Actualizado"}'

curl -X DELETE http://localhost:3000/api/producto/69701df701c30afa1a593cf2

curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com", "password":"Password123!", "username":"testuser"}'

curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email": "pepe@example.com", "password":"Password123!"}'

curl -X POST http://localhost:3000/api/producto -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzJiYTg2MmQxN2I0NzIxYTRmOGY2ZiIsInVzZXJuYW1lIjoicGVwZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2OTU1NTI5NywiZXhwIjoxNzY5NjQxNjk3LCJpc3MiOiJjdXJzby11dG4tYmFja2VuZCJ9.grqQtH1p_yBCwTJE8vCobwET-JD4Yba5bitb8gf0dNk" -d '{"name":"Producto Ejemplo", "description":"Descripción", "price":999.99, "stock":1, "categoryId":"6975323294fbbe3a3c2847d6"}'

curl -X PUT http://localhost:3000/api/producto/6972bccb2d17b4721a4f8f76 -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzJiYTg2MmQxN2I0NzIxYTRmOGY2ZiIsInVzZXJuYW1lIjoicGVwZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2OTU1NTI5NywiZXhwIjoxNzY5NjQxNjk3LCJpc3MiOiJjdXJzby11dG4tYmFja2VuZCJ9.grqQtH1p_yBCwTJE8vCobwET-JD4Yba5bitb8gf0dNk" -d '{"name":"Producto Actualizado de pepe", "description":"Descripción actualizada", "price":1099.99, "stock":2, "categoryId":"6975323294fbbe3a3c2847d6"}'

curl -X DELETE http://localhost:3000/api/producto/6972bccb2d17b4721a4f8f76 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzJiYTg2MmQxN2I0NzIxYTRmOGY2ZiIsInVzZXJuYW1lIjoicGVwZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2OTU1NTI5NywiZXhwIjoxNzY5NjQxNjk3LCJpc3MiOiJjdXJzby11dG4tYmFja2VuZCJ9.grqQtH1p_yBCwTJE8vCobwET-JD4Yba5bitb8gf0dNk"
