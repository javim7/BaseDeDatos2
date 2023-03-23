/*
CREACION DE NODOS
*/

//Creacion de personas

CREATE (:Persona {nombre: 'Ana', edad: 25, profesion: 'Ingeniera', departamento: 'Guatemala'}),
       (:Persona {nombre: 'Carlos', edad: 35, profesion: 'Abogado', departamento: 'Huehuetenango'}),
       (:Persona {nombre: 'Lucía', edad: 42, profesion: 'Profesora', departamento: 'Quetzaltenango'}),
       (:Persona {nombre: 'Jorge', edad: 28, profesion: 'Diseñador', departamento: 'Peten'}),
       (:Persona {nombre: 'Willy', edad: 38, profesion: 'Ingeniero', departamento: 'Zacapa'})


//Creacion de companias
CREATE (:Compañia {nombre: 'Amazon', industria: 'Ventas', departamento: 'Guatemala', empleados: 500}),
       (:Compañia {nombre: 'Comex', industria: 'Pinturas', departamento: 'Quetzaltenango', empleados: 1000}),
       (:Compañia {nombre: 'BAC', industria: 'Banca', departamento: 'Peten', empleados: 250}),
       (:Compañia {nombre: 'Initech', industria: 'Software', departamento: 'Huehuetenango', empleados: 150}),
       (:Compañia {nombre: 'La Torre', industria: 'Supermercados', departamento: 'Guetamala', empleados: 250})

//Craecion de productos
CREATE (:Producto {nombre: 'Teléfono inteligente', precio: 799.99, descripción: 'Un teléfono inteligente de alta gama con características avanzadas', marca: 'Samsung'}),
       (:Producto {nombre: 'Pintura', precio: 299.99, descripción: 'Pintura para techo', marca: 'Sherwin Williams'}),
       (:Producto {nombre: 'Seguros', precio: 1599.99, descripción: 'Seguro de vida', marca: 'BAC'}),
       (:Producto {nombre: 'Televisor', precio: 999.99, descripción: 'Un televisor LED de alta definición con sonido envolvente', marca: 'Sony'}),
       (:Producto {nombre: 'Carne', precio: 99.99, descripción: 'Carne de cerdo', marca: 'Toledo'})


//Creacion de Pedidoes
CREATE (:Pedido {id: 'PED001', fecha: '2022-02-01', total: 2123.45, estado: 'En Proceso'}),
       (:Pedido {id: 'PED002', fecha: '2022-02-10', total: 1234.56, estado: 'Enviada'}),
       (:Pedido {id: 'PED003', fecha: '2022-03-01', total: 745.67, estado: 'Entregada'}),
       (:Pedido {id: 'PED004', fecha: '2022-03-15', total: 1456.78, estado: 'En Proceso'}),
       (:Pedido {id: 'PED005', fecha: '2022-03-15', total: 456.78, estado: 'En Proceso'})

/*
CREACION DE RELACIONES
*/

//Relacion de personas con Pedidoes y con compañias


// Ana trabaja para Amazon y realizó la Pedido PED001
MATCH (ana:Persona {nombre: 'Ana'}), (amazon:Compañia {nombre: 'Amazon'}), (PED001:Pedido {id: 'PED001'})
CREATE (ana)-[:TRABAJA_PARA]->(amazon), (ana)-[:REALIZA]->(PED001)

// Carlos trabaja para Initech y realizó la Pedido PED002
MATCH (carlos:Persona {nombre: 'Carlos'}), (initech:Compañia {nombre: 'Initech'}), (PED002:Pedido {id: 'PED002'})
CREATE (carlos)-[:TRABAJA_PARA]->(initech), (carlos)-[:REALIZA]->(PED002)

// Lucia trabaja para Comex y realizó la Pedido PED003
MATCH (lucia:Persona {nombre: 'Lucía'}), (comex:Compañia {nombre: 'Comex'}), (PED003:Pedido {id: 'PED003'})
CREATE (lucia)-[:TRABAJA_PARA]->(comex), (lucia)-[:REALIZA]->(PED003)

// Carlos trabaja para Initech y realizó la Pedido PED002
MATCH (jorge:Persona {nombre: 'Jorge'}), (BAC:Compañia {nombre: 'BAC'}), (PED004:Pedido {id: 'PED004'})
CREATE (jorge)-[:TRABAJA_PARA]->(BAC), (jorge)-[:REALIZA]->(PED004)

// Carlos trabaja para Initech y realizó la Pedido PED002
MATCH (willy:Persona {nombre: 'Willy'}), (laTorre:Compañia {nombre: 'La Torre'}), (PED005:Pedido {id: 'PED005'})
CREATE (willy)-[:TRABAJA_PARA]->(laTorre), (willy)-[:REALIZA]->(PED005)

//realcion de Pedidoes con productos

// Relacionar la Pedido PED001 con los productos Teléfono inteligente y Pintura
MATCH (o:Pedido {id: 'PED001'}), (p:Producto {nombre: 'Pintura'})
CREATE (o)-[:CONTIENE]->(p)

// Relacionar la Pedido PED002 con los productos Seguros y Televisor
MATCH (o:Pedido {id: 'PED002'}), (p1:Producto {nombre: 'Seguros'}), (p2:Producto {nombre: 'Seguros'})
CREATE (o)-[:CONTIENE]->(p1), (o)-[:CONTIENE]->(p2)

// Relacionar la Pedido PED003 con el producto Teléfono inteligente
MATCH (o:Pedido {id: 'PED003'}), (p:Producto {nombre: 'Teléfono inteligente'})
CREATE (o)-[:CONTIENE]->(p)

// Relacionar la Pedido PED004 con los productos Seguros y Pintura
MATCH (o:Pedido {id: 'PED004'}), (p1:Producto {nombre: 'Televisor'}), (p2:Producto {nombre: 'Teléfono inteligente'})
CREATE (o)-[:CONTIENE]->(p1), (o)-[:CONTIENE]->(p2)

// Relacionar la Pedido PED005 con los productos Carnes
MATCH (o:Pedido {id: 'PED005'}), (p:Producto {nombre: 'Carne'})
CREATE (o)-[:CONTIENE]->(p)

//creacion de relacion entre compania y producto

// Relación entre Amazon y Televisor
MATCH (c:Compañia {nombre: 'Amazon'})
MATCH (p1:Producto {nombre: 'Televisor'})
MATCH (p2:Producto {nombre: 'Teléfono inteligente'})
CREATE (c)-[:VENDE]->(p1)
CREATE (c)-[:VENDE]->(p2)

// Relación entre Comex y Pintura
MATCH (c:Compañia {nombre: 'Comex'})
MATCH (p:Producto {nombre: 'Pintura'})
CREATE (c)-[:VENDE]->(p)

// Relación entre BAC y Seguros
MATCH (c:Compañia {nombre: 'BAC'})
MATCH (p:Producto {nombre: 'Seguros'})
CREATE (c)-[:VENDE]->(p)

// Relación entre Initech y Teléfono inteligente
MATCH (c:Compañia {nombre: 'Initech'})
MATCH (p:Producto {nombre: 'Teléfono inteligente'})
CREATE (c)-[:VENDE]->(p)

// Relación entre La Torre y Carne
MATCH (c:Compañia {nombre: 'La Torre'})
MATCH (p:Producto {nombre: 'Carne'})
CREATE (c)-[:VENDE]->(p)

